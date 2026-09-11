import fs from "fs";
import path from "path";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { Product } from "../models/product.model.js";
import { runOcrPipeline } from "../services/ocr.service.js";
import { evaluateCompliance, CURRENT_RULE_VERSION } from "../services/compliance.service.js";
import { generateProductReportPdf } from "../services/pdf.service.js";
import { calculateFileSha256 } from "../services/hash.service.js";
import { detectCrossViewConflicts } from "../services/consistency.service.js";

/**
 * Creates an inspection by processing uploaded multi-surface package images,
 * calculating SHA-256 evidence hashes, running OCR, evaluating surface coverage,
 * running cross-view consistency, and executing context-aware compliance checks.
 */
const createProductInspection = asyncHandler(async (req, res) => {
    if (!req.files || req.files.length === 0) {
        throw new ApiError(400, "Please upload at least 1 packaging label image to begin inspection");
    }

    if (req.files.length > 5) {
        throw new ApiError(400, "Maximum 5 package surfaces can be uploaded per inspection");
    }

    // ---------------------------------------------------------------
    // IDEMPOTENCY GUARD
    // The frontend generates a one-time UUID per wizard session and
    // sends it as x-idempotency-key. If this same key is seen again
    // (e.g. from React StrictMode double-mount or accidental retry),
    // return the existing record immediately — no duplicate created.
    // ---------------------------------------------------------------
    const idempotencyKey = req.headers['x-idempotency-key'] || null;
    if (idempotencyKey) {
        const existing = await Product.findOne({
            createdBy: req.user._id,
            idempotencyKey
        });
        if (existing) {
            console.log(`[IDEMPOTENCY] Returning existing inspection for key: ${idempotencyKey}`);
            // Clean up the duplicate uploaded files since we won't use them
            if (req.files && req.files.length > 0) {
                req.files.forEach(file => {
                    try { fs.unlinkSync(file.path); } catch (e) { /* ignore cleanup errors */ }
                });
            }
            return res.status(200).json(
                new ApiResponse(200, existing, "Existing inspection returned (idempotent response)")
            );
        }
    }

    const imagePaths = req.files.map((file) => file.path);

    // Parse surface names mapping from request body (e.g. ['Front', 'Back'])
    let surfaceNames = [];
    if (req.body.surfaces) {
        try {
            surfaceNames = typeof req.body.surfaces === "string" ? JSON.parse(req.body.surfaces) : req.body.surfaces;
        } catch (e) {
            surfaceNames = Array.isArray(req.body.surfaces) ? req.body.surfaces : [req.body.surfaces];
        }
    }
    // Default fallback surface naming
    const defaultSurfaceLabels = ["Front", "Back", "Side", "Top", "Bottom"];
    const finalSurfaces = imagePaths.map((_, idx) => surfaceNames[idx] || defaultSurfaceLabels[idx] || `Surface ${idx + 1}`);

    // Parse inspection context
    let context = {};
    if (req.body.context) {
        try {
            context = typeof req.body.context === "string" ? JSON.parse(req.body.context) : req.body.context;
        } catch (e) {
            context = {};
        }
    }

    // 1. Calculate SHA-256 hash for each uploaded image (Evidence Integrity)
    const surfacesData = [];
    const evidenceHashes = [];

    for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const surfaceName = finalSurfaces[i];
        let fileHash = "UNKNOWN_HASH";

        try {
            fileHash = await calculateFileSha256(file.path);
        } catch (hErr) {
            console.error(`Error hashing file ${file.path}:`, hErr);
        }

        surfacesData.push({
            surfaceName,
            imagePath: file.path,
            hash: fileHash,
            qualityStatus: "ACCEPTED",
            capturedAt: new Date()
        });

        evidenceHashes.push({
            surface: surfaceName,
            hash: fileHash,
            file: path.basename(file.path),
            timestamp: new Date()
        });
    }

    // 2. Evaluate Surface Coverage & Completeness
    const capturedLower = finalSurfaces.map(s => s.toLowerCase());
    const coreSurfaces = ["front", "back"];
    const missingCore = coreSurfaces.filter(cs => !capturedLower.some(c => c.includes(cs)));
    const coveragePercentage = Math.round(((coreSurfaces.length - missingCore.length) / coreSurfaces.length) * 100);

    const surfaceCoverage = {
        percentage: coveragePercentage,
        capturedSurfaces: finalSurfaces,
        missingSurfaces: missingCore.map(m => m.charAt(0).toUpperCase() + m.slice(1))
    };

    // 3. Run OCR extraction pipeline via Python PaddleOCR engine
    const ocrStart = Date.now();
    let ocrResult = { rawOcrText: [], structuredData: {}, boundingBoxes: [], ocrConfidence: [] };

    try {
        ocrResult = await runOcrPipeline(imagePaths);
        console.log(`OCR SERVICE TOTAL: ${((Date.now() - ocrStart) / 1000).toFixed(2)} seconds`);
    } catch (ocrErr) {
        console.error("OCR execution error:", ocrErr);
        throw new ApiError(500, `OCR pipeline execution failed: ${ocrErr.message}`);
    }

    // Tag OCR items with surface names
    if (Array.isArray(ocrResult.rawOcrText)) {
        ocrResult.rawOcrText.forEach((item) => {
            if (item.imageIndex !== undefined && finalSurfaces[item.imageIndex]) {
                item.sourceSurface = finalSurfaces[item.imageIndex];
            }
        });
    }

    // Tag structured data items with surface source
    if (ocrResult.structuredData) {
        Object.keys(ocrResult.structuredData).forEach((key) => {
            const field = ocrResult.structuredData[key];
            if (field && typeof field === "object") {
                if (Array.isArray(field)) {
                    field.forEach(sub => {
                        if (sub.imageIndex !== undefined && finalSurfaces[sub.imageIndex]) {
                            sub.sourceSurface = finalSurfaces[sub.imageIndex];
                        }
                    });
                } else if (field.imageIndex !== undefined && finalSurfaces[field.imageIndex]) {
                    field.sourceSurface = finalSurfaces[field.imageIndex];
                }
            }
        });
    }

    // 4. Run Cross-View Consistency Detection across surfaces
    const crossViewConflicts = detectCrossViewConflicts(
        ocrResult.rawOcrText || [],
        finalSurfaces,
        ocrResult.structuredData || {}
    );

    // 5. Authoritative Context-Aware Compliance Evaluation
    const complianceStart = Date.now();
    const complianceResults = evaluateCompliance(ocrResult.structuredData || {}, {
        surfaces: finalSurfaces,
        context,
        crossViewConflicts,
        evalDate: new Date().toISOString()
    });
    console.log(`COMPLIANCE TIME: ${((Date.now() - complianceStart) / 1000).toFixed(2)} seconds`);

    // 6. Generate Unique Inspection ID
    const inspectionId = `INSP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 7. Save Product Record in MongoDB Atlas
    const product = await Product.create({
        createdBy: req.user._id,
        inspectionId,
        ...(idempotencyKey && { idempotencyKey }),  // Only store if provided
        context: {
            category: context.category || "Packaged Commodity",
            inspectionType: context.inspectionType || "Retail Market Surveillance",
            originType: context.originType || "Domestic",
            location: context.location || "",
            notes: context.notes || ""
        },
        originalImages: imagePaths,
        surfaces: surfacesData,
        surfaceCoverage,
        crossViewConflicts,
        rawOcrText: ocrResult.rawOcrText,
        structuredData: ocrResult.structuredData,
        boundingBoxes: ocrResult.boundingBoxes,
        ocrConfidence: ocrResult.ocrConfidence,
        complianceResults,
        evidenceIntegrity: {
            algorithm: "SHA-256",
            hashes: evidenceHashes
        },
        ruleVersion: CURRENT_RULE_VERSION,
        status: complianceResults.incompleteCount > 0 ? "IN_PROGRESS" : "PENDING_VERIFICATION"
    });

    const createdProduct = await Product.findById(product._id);

    return res.status(201).json(
        new ApiResponse(
            201,
            createdProduct,
            "Product label inspection created successfully"
        )
    );
});

/**
 * Retrieves all inspections for the logged-in officer with optional search and filters.
 */
const getAllProducts = asyncHandler(async (req, res) => {
    const { search, status, category } = req.query;
    const filter = { createdBy: req.user._id };

    if (status && status !== "ALL") {
        filter.status = status;
    }

    if (category && category !== "ALL") {
        filter["context.category"] = category;
    }

    if (search && String(search).trim().length > 0) {
        const regex = new RegExp(String(search).trim(), "i");
        filter.$or = [
            { inspectionId: regex },
            { "structuredData.productName.value": regex },
            { "context.location": regex },
            { "context.category": regex }
        ];
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(
            200,
            products,
            "Product inspection history fetched successfully"
        )
    );
});

/**
 * Retrieves single inspection record by ID.
 */
const getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const product = await Product.findOne({
        _id: id,
        createdBy: req.user._id
    });

    if (!product) {
        throw new ApiError(404, "Product inspection record not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            product,
            "Product inspection details fetched successfully"
        )
    );
});

/**
 * Stores officer verification decisions for inspection findings.
 */
const verifyInspectionFinding = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { verifications = [], remarks = "", status = "VERIFIED" } = req.body;

    const product = await Product.findOne({
        _id: id,
        createdBy: req.user._id
    });

    if (!product) {
        throw new ApiError(404, "Product inspection record not found");
    }

    // Attach officer identity and verification date
    const verifiedEntries = verifications.map(v => ({
        ruleId: v.ruleId,
        field: v.field,
        officerDecision: v.officerDecision,
        remarks: v.remarks || remarks,
        verifiedAt: new Date(),
        verifiedBy: req.user._id
    }));

    product.verifications = verifiedEntries;
    product.status = status;
    if (remarks) {
        product.context.notes = (product.context.notes ? product.context.notes + " | " : "") + `Officer: ${remarks}`;
    }

    await product.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            product,
            "Officer verification recorded successfully"
        )
    );
});

/**
 * Aggregates real inspection statistics for the authenticated officer dashboard.
 * Zero fabricated numbers: derived strictly from database.
 */
const getDashboardStats = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const totalInspections = await Product.countDocuments({ createdBy: userId });
    const completedCount = await Product.countDocuments({
        createdBy: userId,
        status: { $in: ["VERIFIED", "COMPLETED"] }
    });
    const pendingReviewCount = await Product.countDocuments({
        createdBy: userId,
        status: "PENDING_VERIFICATION"
    });
    const potentialNonComplianceCount = await Product.countDocuments({
        createdBy: userId,
        "complianceResults.overallStatus": "POTENTIAL_NON_COMPLIANCE"
    });
    const incompleteCount = await Product.countDocuments({
        createdBy: userId,
        status: "IN_PROGRESS"
    });

    // Recent 5 inspections
    const recentInspections = await Product.find({ createdBy: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("inspectionId createdAt context structuredData status complianceResults surfaces");

    // Timeline aggregation: inspections grouped by date (last 30 days) from real DB records
    const timelineStats = await Product.aggregate([
        { $match: { createdBy: userId } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    // Violation breakdown by rule from actual DB results
    const violationStats = await Product.aggregate([
        { $match: { createdBy: userId, "complianceResults.results": { $exists: true } } },
        { $unwind: "$complianceResults.results" },
        {
            $match: {
                "complianceResults.results.status": {
                    $in: ["POTENTIAL_NON_COMPLIANCE", "CONFLICTING_DECLARATION"]
                }
            }
        },
        {
            $group: {
                _id: "$complianceResults.results.ruleId",
                ruleName: { $first: "$complianceResults.results.ruleName" },
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } }
    ]);

    // Status breakdown from real DB records
    const statusDistribution = [
        { label: "Compliant / Verified", count: completedCount, color: "var(--status-pass-text)" },
        { label: "Needs Verification", count: pendingReviewCount, color: "var(--status-review-text)" },
        { label: "Potential Non-Compliance", count: potentialNonComplianceCount, color: "var(--status-fail-text)" },
        { label: "Incomplete Coverage", count: incompleteCount, color: "var(--text-muted)" }
    ].filter(s => s.count > 0);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                totalInspections,
                completedCount,
                pendingReviewCount,
                potentialNonComplianceCount,
                incompleteCount,
                recentInspections,
                timelineStats,
                violationStats,
                statusDistribution
            },
            "Officer dashboard statistics retrieved successfully"
        )
    );
});

/**
 * Allows an officer to correct misread OCR declarations.
 * Preserves the original machine extraction, stores an immutable audit record,
 * re-evaluates compliance against applicable LMPC rules, and updates the inspection.
 */
const correctProductDeclaration = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { field, correctedValue, reason } = req.body;

    if (!field || correctedValue === undefined) {
        throw new ApiError(400, "Field name and corrected value are required");
    }

    const product = await Product.findOne({
        _id: id,
        createdBy: req.user._id
    });

    if (!product) {
        throw new ApiError(404, "Inspection record not found");
    }

    // Capture original value before modification
    const currentFieldObj = product.structuredData?.[field];
    const originalVal = currentFieldObj?.value !== undefined ? currentFieldObj.value : currentFieldObj;

    // Record audit trail
    if (!product.officerCorrections) {
        product.officerCorrections = [];
    }

    product.officerCorrections.push({
        field,
        originalOcrValue: originalVal,
        correctedValue,
        reason: reason || "Officer manual verification and OCR typo correction",
        correctedAt: new Date(),
        correctedBy: req.user._id
    });

    // Update structured data while keeping bounding box and surface provenance
    if (typeof product.structuredData[field] === "object" && product.structuredData[field] !== null) {
        product.structuredData[field].value = correctedValue;
        product.structuredData[field].isOfficerCorrected = true;
    } else {
        product.structuredData[field] = {
            value: correctedValue,
            isOfficerCorrected: true
        };
    }

    product.markModified("structuredData");

    // Dynamic Compliance Re-evaluation
    const surfaces = product.surfaces?.map(s => s.surfaceName) || ["Front", "Back"];
    const updatedCompliance = evaluateCompliance(product.structuredData, {
        surfaces,
        context: product.context || {},
        crossViewConflicts: product.crossViewConflicts || [],
        calibration: product.calibrationMetadata || null,
        evalDate: new Date().toISOString()
    });

    product.complianceResults = updatedCompliance;
    product.status = updatedCompliance.incompleteCount > 0 ? "IN_PROGRESS" : "PENDING_VERIFICATION";

    await product.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            product,
            "Declaration corrected and compliance re-evaluated successfully"
        )
    );
});

/**
 * Calibrates physical millimeter text scale (Rule 9 / Table 1)
 */
const calibrateInspectionScale = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { referenceLengthMm, pixelDistance } = req.body;

    if (!referenceLengthMm || !pixelDistance || pixelDistance <= 0 || referenceLengthMm <= 0) {
        throw new ApiError(400, "Valid reference millimeter size and measured pixel span are required");
    }

    const product = await Product.findOne({
        _id: id,
        createdBy: req.user._id
    });

    if (!product) {
        throw new ApiError(404, "Inspection record not found");
    }

    const pixelsPerMm = pixelDistance / referenceLengthMm;

    product.calibrationMetadata = {
        hasCalibration: true,
        referenceLengthMm: Number(referenceLengthMm),
        pixelsPerMm: Number(pixelsPerMm),
        calibratedAt: new Date()
    };

    // Re-evaluate compliance with physical calibration enabled
    const surfaces = product.surfaces?.map(s => s.surfaceName) || ["Front", "Back"];
    const updatedCompliance = evaluateCompliance(product.structuredData, {
        surfaces,
        context: product.context || {},
        crossViewConflicts: product.crossViewConflicts || [],
        calibration: product.calibrationMetadata,
        evalDate: new Date().toISOString()
    });

    product.complianceResults = updatedCompliance;
    await product.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            product,
            "Physical scale calibration applied and Rule 9 re-evaluated successfully"
        )
    );
});


/**
 * Provides authoritative Legal Metrology Rules catalog with versioning.
 */
const getRulesCatalog = asyncHandler(async (req, res) => {
    const rulesCatalog = [
        {
            ruleId: "Rule 6(1)(a)",
            title: "Manufacturer / Packer / Importer Name & Address",
            requirement: "Name and complete address of the manufacturer, or where the manufacturer is not the packer, the name and address of the manufacturer and packer, or for imported goods, the manufacturer and importer.",
            applicability: "All Packaged Commodities",
            source: "LMPC Rules 2011",
            version: CURRENT_RULE_VERSION.version,
            status: "ACTIVE"
        },
        {
            ruleId: "Rule 6(1)(b)",
            title: "Country of Origin",
            requirement: "Name of the country of origin or manufacture or assembly in case of imported products shall be mentioned on the package.",
            applicability: "Mandatory for Imported Commodities; Domestic Identified by Address",
            source: "LMPC Rules 2011 & Amendments",
            version: CURRENT_RULE_VERSION.version,
            status: "ACTIVE"
        },
        {
            ruleId: "Rule 6(1)(c)",
            title: "Common or Generic Name of Commodity",
            requirement: "The common or generic name of the commodity contained in the package and in case of packages with more than one product, the name and quantity of each commodity.",
            applicability: "All Packaged Commodities (Principal Display Panel)",
            source: "LMPC Rules 2011",
            version: CURRENT_RULE_VERSION.version,
            status: "ACTIVE"
        },
        {
            ruleId: "Rule 6(1)(d)",
            title: "Net Quantity & Standard Units",
            requirement: "The net quantity, in terms of the standard unit of weight or measure, of the commodity contained in the package or where the commodity is sold by number, the number of the commodity contained in the package.",
            applicability: "All Packaged Commodities",
            source: "LMPC Rules 2011 & Second Schedule",
            version: CURRENT_RULE_VERSION.version,
            status: "ACTIVE"
        },
        {
            ruleId: "Rule 6(1)(e)",
            title: "Maximum Retail Price (MRP)",
            requirement: "The retail sale price of the package shall clearly indicate that it is the maximum retail price inclusive of all taxes in standard currency symbols.",
            applicability: "All Packaged Commodities for Retail Sale",
            source: "LMPC Rules 2011",
            version: CURRENT_RULE_VERSION.version,
            status: "ACTIVE"
        },
        {
            ruleId: "Rule 6(1)(f)",
            title: "Month and Year of Manufacture / Packing",
            requirement: "The month and year in which the commodity is manufactured or pre-packed or imported shall be clearly mentioned.",
            applicability: "All Packaged Commodities",
            source: "LMPC Rules 2011",
            version: CURRENT_RULE_VERSION.version,
            status: "ACTIVE"
        },
        {
            ruleId: "Rule 6(1)(h)",
            title: "Consumer Care Information",
            requirement: "Name, address, telephone number, and email address of the person or office who may be contacted in case of consumer complaints.",
            applicability: "All Packaged Commodities",
            source: "LMPC Rules 2011",
            version: CURRENT_RULE_VERSION.version,
            status: "ACTIVE"
        },
        {
            ruleId: "Rule 9 / Table 1",
            title: "Numeral & Letter Height (Readability)",
            requirement: "Minimum height of numerals and letters depending on the net quantity and area of the Principal Display Panel.",
            applicability: "Principal Display Panel Declarations",
            source: "LMPC Rules 2011 First Schedule",
            version: CURRENT_RULE_VERSION.version,
            status: "ACTIVE"
        }
    ];

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                ruleVersion: CURRENT_RULE_VERSION,
                rules: rulesCatalog
            },
            "Rules catalog fetched successfully"
        )
    );
});

/**
 * Downloads formal PDF report generated by Python ReportLab engine.
 */
const downloadProductReport = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const product = await Product.findOne({
        _id: id,
        createdBy: req.user._id
    });

    if (!product) {
        throw new ApiError(404, "Product inspection record not found or unauthorized access");
    }

    if (!product.complianceResults || !product.complianceResults.results) {
        product.complianceResults = evaluateCompliance(product.structuredData || {}, {
            surfaces: product.surfaces?.map(s => s.surfaceName) || ["Front", "Back"],
            context: product.context || {}
        });
        await product.save();
    }

    // Generate formal PDF report via ReportLab engine
    const pdfFilePath = await generateProductReportPdf(product, req.user);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
        "Content-Disposition",
        `inline; filename="LabelGuard_Report_${product.inspectionId}.pdf"`
    );

    const fileStream = fs.createReadStream(pdfFilePath);
    fileStream.pipe(res);

    fileStream.on("end", () => {
        try { fs.unlinkSync(pdfFilePath); } catch (e) {}
    });

    fileStream.on("error", (err) => {
        console.error("Stream PDF file error:", err);
        try { fs.unlinkSync(pdfFilePath); } catch (e) {}
    });
});

export {
    createProductInspection,
    getAllProducts,
    getProductById,
    verifyInspectionFinding,
    getDashboardStats,
    getRulesCatalog,
    downloadProductReport,
    correctProductDeclaration,
    calibrateInspectionScale
};

