import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        inspectionId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        // Client-generated idempotency key — prevents duplicate creation from double-fired useEffect / retries
        idempotencyKey: {
            type: String,
            index: true,
            sparse: true  // Only enforces uniqueness on docs that have this field (legacy docs without it are unaffected)
        },
        // Context information
        context: {
            category: { type: String, default: "General Packaged Commodity" },
            inspectionType: { type: String, default: "Retail Market Surveillance" },
            originType: { type: String, default: "Domestic" },
            location: { type: String, default: "" },
            notes: { type: String, default: "" }
        },
        // Original images stored on disk
        originalImages: [
            {
                type: String,
                required: true
            }
        ],
        // Surfaces breakdown with SHA-256 hashes and quality markers
        surfaces: [
            {
                surfaceName: { type: String, default: "Front" },
                imagePath: { type: String },
                hash: { type: String },
                qualityStatus: { type: String, default: "ACCEPTED" }, // ACCEPTED, POOR_QUALITY, NEEDS_RECAPTURE
                capturedAt: { type: Date, default: Date.now }
            }
        ],
        // Coverage evaluation
        surfaceCoverage: {
            percentage: { type: Number, default: 100 },
            capturedSurfaces: [{ type: String }],
            missingSurfaces: [{ type: String }]
        },
        // Cross-surface inconsistencies detected
        crossViewConflicts: {
            type: mongoose.Schema.Types.Mixed,
            default: []
        },
        // Raw and structured OCR extractions
        rawOcrText: {
            type: mongoose.Schema.Types.Mixed,
            default: []
        },
        structuredData: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },
        boundingBoxes: {
            type: mongoose.Schema.Types.Mixed,
            default: []
        },
        ocrConfidence: {
            type: mongoose.Schema.Types.Mixed,
            default: []
        },
        // Compliance evaluation engine output
        complianceResults: {
            type: mongoose.Schema.Types.Mixed,
            default: null
        },
        // Evidence integrity metadata (tamper-evident SHA-256 records)
        evidenceIntegrity: {
            algorithm: { type: String, default: "SHA-256" },
            hashes: [
                {
                    surface: String,
                    hash: String,
                    file: String,
                    timestamp: { type: Date, default: Date.now }
                }
            ]
        },
        // Human-in-the-loop officer verifications
        verifications: [
            {
                ruleId: String,
                field: String,
                officerDecision: {
                    type: String,
                    enum: ["CONFIRMED", "DISMISSED", "REQUEST_RECAPTURE", "NOT_ASSESSABLE", "PENDING"],
                    default: "PENDING"
                },
                remarks: String,
                verifiedAt: { type: Date, default: Date.now },
                verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
            }
        ],
        // Officer OCR corrections preserving original machine extractions with full traceability
        officerCorrections: [
            {
                field: String,
                originalOcrValue: mongoose.Schema.Types.Mixed,
                correctedValue: mongoose.Schema.Types.Mixed,
                reason: String,
                correctedAt: { type: Date, default: Date.now },
                correctedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
            }
        ],
        // Text-size physical calibration metadata (Rule 9 / Table 1)
        calibrationMetadata: {
            hasCalibration: { type: Boolean, default: false },
            referenceLengthMm: { type: Number },
            pixelsPerMm: { type: Number },
            calibratedAt: { type: Date }
        },
        // Inspection Environment: 'PHYSICAL_PACKAGE' or 'ECOMMERCE_LISTING'
        environmentType: {
            type: String,
            enum: ["PHYSICAL_PACKAGE", "ECOMMERCE_LISTING"],
            default: "PHYSICAL_PACKAGE"
        },
        // E-commerce listing specific metadata if applicable
        ecommerceData: {
            listingUrl: String,
            platformName: String,
            sellerName: String,
            capturedTimestamp: Date
        },
        // Lifecycle status
        status: {
            type: String,
            enum: ["IN_PROGRESS", "PENDING_VERIFICATION", "VERIFIED", "COMPLETED"],
            default: "PENDING_VERIFICATION"
        },

        // Version of rules applied
        ruleVersion: {
            type: mongoose.Schema.Types.Mixed,
            default: null
        }
    },
    {
        timestamps: true
    }
);

export const Product = mongoose.model("Product", productSchema);
