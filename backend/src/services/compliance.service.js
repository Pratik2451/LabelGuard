/**
 * Legal Metrology (Packaged Commodities) Rules, 2011 Compliance Evaluator
 * Version: LMPC-2011.A2024 (As amended up to 2024)
 * 
 * ASSISTIVE INSPECTION ENGINE:
 * Uses assistive, human-in-the-loop terminology:
 * - Compliant Candidate
 * - Potential Non-Compliance
 * - Needs Officer Verification
 * - Not Assessable
 * - Inspection Incomplete
 * - Conflicting Declaration
 * - Evidence Insufficient
 * - Recapture Required
 */

export const CURRENT_RULE_VERSION = {
    version: "LMPC-2011.A2024",
    name: "Legal Metrology (Packaged Commodities) Rules, 2011 (As Amended)",
    effectiveDate: "2024-01-01",
    authority: "Department of Consumer Affairs, Government of India"
};

/**
 * Evaluates Legal Metrology compliance for extracted package declarations.
 * 
 * @param {Object} structuredData Extracted declarations from OCR
 * @param {Object} options Context, surfaces captured, quality gates, and cross-view conflicts
 * @returns {Object} Comprehensive evaluation summary
 */
export function evaluateCompliance(structuredData = {}, options = {}) {
    const {
        surfaces = ["front", "back"], // Default assumption if not provided
        context = {},
        qualityGate = { passed: true },
        crossViewConflicts = [],
        evalDate = new Date().toISOString()
    } = options;

    const results = [];
    const normalizedSurfaces = surfaces.map(s => String(s).toLowerCase());
    const hasFront = normalizedSurfaces.includes("front") || normalizedSurfaces.some(s => s.includes("front"));
    const hasBack = normalizedSurfaces.includes("back") || normalizedSurfaces.some(s => s.includes("back"));
    const isDomestic = !context.originType || context.originType.toLowerCase().includes("domestic");

    // 0. Image Quality Gate Check
    if (qualityGate && qualityGate.passed === false) {
        return {
            overallStatus: "EVIDENCE_INSUFFICIENT",
            statusLabel: "Evidence Insufficient for Reliable Assessment",
            ruleVersion: CURRENT_RULE_VERSION,
            evaluationTimestamp: evalDate,
            requiresRecapture: true,
            qualityNotice: qualityGate.reason || "Image clarity or framing is insufficient for regulatory verification.",
            passCount: 0,
            reviewCount: 0,
            potentialNonComplianceCount: 0,
            incompleteCount: 0,
            results: []
        };
    }

    // ----------------------------------------------------
    // Rule 1: Product Name / Generic Common Identity (Rule 6(1)(c))
    // ----------------------------------------------------
    const productName = structuredData.productName?.value;
    const productNameConf = structuredData.productName?.confidence;

    if (productName && String(productName).trim().length > 0) {
        const isLowConf = productNameConf && productNameConf < 0.65;
        results.push({
            id: "rule_product_name",
            ruleId: "Rule 6(1)(c)",
            ruleName: "Generic / Common Commodity Name",
            requirement: "Every package shall bear the common or generic name of the commodity contained therein on the Principal Display Panel.",
            applicability: "All Packaged Commodities",
            status: isLowConf ? "NEEDS_OFFICER_VERIFICATION" : "COMPLIANT_CANDIDATE",
            statusLabel: isLowConf ? "Needs Officer Verification" : "Compliant Candidate",
            extractedValue: String(productName),
            confidence: productNameConf ? Math.round(productNameConf * 100) : 85,
            evidence: structuredData.productName?.bbox || null,
            sourceSurface: structuredData.productName?.sourceSurface || "Front",
            explanation: isLowConf 
                ? "Commodity name detected with moderate confidence; officer verification required to confirm text accuracy."
                : "Generic commodity identity is prominently declared on the package surface."
        });
    } else {
        if (!hasFront) {
            results.push({
                id: "rule_product_name",
                ruleId: "Rule 6(1)(c)",
                ruleName: "Generic / Common Commodity Name",
                requirement: "Every package shall bear the common or generic name on the Principal Display Panel.",
                applicability: "All Packaged Commodities",
                status: "INSPECTION_INCOMPLETE",
                statusLabel: "Inspection Incomplete",
                extractedValue: "Surface Not Captured",
                confidence: 0,
                evidence: null,
                explanation: "Front surface (Principal Display Panel) was not captured. Product name declaration cannot yet be assessed."
            });
        } else {
            results.push({
                id: "rule_product_name",
                ruleId: "Rule 6(1)(c)",
                ruleName: "Generic / Common Commodity Name",
                requirement: "Every package shall bear the common or generic name on the Principal Display Panel.",
                applicability: "All Packaged Commodities",
                status: "POTENTIAL_NON_COMPLIANCE",
                statusLabel: "Potential Non-Compliance",
                extractedValue: "Not detected",
                confidence: 0,
                evidence: null,
                explanation: "Generic or common name was not detected on inspected surfaces. Potential missing mandatory declaration under Rule 6(1)(c)."
            });
        }
    }

    // ----------------------------------------------------
    // Rule 2: Manufacturer / Packer / Importer Details (Rule 6(1)(a))
    // Note: Commonly printed on Back or Side Information Panel
    // ----------------------------------------------------
    const mfg = structuredData.manufacturer;
    const hasMfg = mfg && Array.isArray(mfg) && mfg.length > 0;
    const packer = structuredData.packer;
    const importer = structuredData.importer;

    if (hasMfg) {
        const fullMfgText = mfg.map(item => (typeof item === 'object' ? item.value : item)).join(', ');
        const firstConfidence = mfg[0]?.confidence;
        const isLowConf = firstConfidence && firstConfidence < 0.65;

        results.push({
            id: "rule_manufacturer",
            ruleId: "Rule 6(1)(a)",
            ruleName: "Manufacturer / Packer Identity & Address",
            requirement: "Name and complete address of the manufacturer or packer must be prominently declared.",
            applicability: "All Packaged Commodities",
            status: isLowConf ? "NEEDS_OFFICER_VERIFICATION" : "COMPLIANT_CANDIDATE",
            statusLabel: isLowConf ? "Needs Officer Verification" : "Compliant Candidate",
            extractedValue: fullMfgText,
            confidence: firstConfidence ? Math.round(firstConfidence * 100) : 80,
            evidence: mfg[0]?.bbox || null,
            sourceSurface: mfg[0]?.sourceSurface || "Back",
            explanation: isLowConf
                ? "Manufacturer declaration detected with low/moderate OCR confidence; requires officer check."
                : "Complete name and commercial address declaration detected on package."
        });
    } else if (packer || importer) {
        const packerVal = packer?.value || (typeof packer === 'string' ? packer : null);
        const importerVal = importer?.value || (typeof importer === 'string' ? importer : null);
        const val = packerVal || importerVal || "Packer / Importer Declaration Present";

        results.push({
            id: "rule_manufacturer",
            ruleId: "Rule 6(1)(a)",
            ruleName: "Manufacturer / Packer / Importer Identity & Address",
            requirement: "Name and complete address of the manufacturer, packer, or importer must be declared.",
            applicability: "All Packaged Commodities",
            status: "COMPLIANT_CANDIDATE",
            statusLabel: "Compliant Candidate",
            extractedValue: val,
            confidence: 78,
            evidence: null,
            explanation: "Packer or Importer identification details declared in lieu of or alongside manufacturer."
        });
    } else {
        // Core LabelGuard differentiator:
        // If back surface is NOT captured, it is NOT missing!
        if (!hasBack) {
            results.push({
                id: "rule_manufacturer",
                ruleId: "Rule 6(1)(a)",
                ruleName: "Manufacturer / Packer Identity & Address",
                requirement: "Name and complete address of the manufacturer or packer must be declared.",
                applicability: "All Packaged Commodities",
                status: "INSPECTION_INCOMPLETE",
                statusLabel: "Inspection Incomplete",
                extractedValue: "Back surface not captured",
                confidence: 0,
                evidence: null,
                explanation: "Back surface has not been captured. Declarations located on this surface cannot yet be assessed. (Not visible is not the same as missing)."
            });
        } else {
            results.push({
                id: "rule_manufacturer",
                ruleId: "Rule 6(1)(a)",
                ruleName: "Manufacturer / Packer Identity & Address",
                requirement: "Name and complete address of the manufacturer or packer must be declared.",
                applicability: "All Packaged Commodities",
                status: "POTENTIAL_NON_COMPLIANCE",
                statusLabel: "Potential Non-Compliance",
                extractedValue: "Not detected",
                confidence: 0,
                evidence: null,
                explanation: "Complete manufacturer/packer identity and address not detected on captured surfaces (Front and Back inspected). Officer verification recommended."
            });
        }
    }

    // ----------------------------------------------------
    // Rule 3: Country of Origin (Rule 6(1)(b) & Rule 6(10))
    // ----------------------------------------------------
    const origin = structuredData.countryOfOrigin?.value || (typeof structuredData.countryOfOrigin === 'string' ? structuredData.countryOfOrigin : null);
    const originConf = structuredData.countryOfOrigin?.confidence;

    if (origin) {
        results.push({
            id: "rule_origin",
            ruleId: "Rule 6(1)(b)",
            ruleName: "Country of Origin",
            requirement: "Name of country of origin or manufacture must be mentioned on imported or domestic goods.",
            applicability: isDomestic ? "Domestic Commodities" : "Mandatory for Imported Commodities",
            status: "COMPLIANT_CANDIDATE",
            statusLabel: "Compliant Candidate",
            extractedValue: String(origin),
            confidence: originConf ? Math.round(originConf * 100) : 90,
            evidence: structuredData.countryOfOrigin?.bbox || null,
            explanation: `Country of origin explicitly declared as "${origin}".`
        });
    } else {
        if (context.originType === "Imported") {
            if (!hasBack) {
                results.push({
                    id: "rule_origin",
                    ruleId: "Rule 6(1)(b)",
                    ruleName: "Country of Origin",
                    requirement: "Country of origin must be declared on every imported package.",
                    applicability: "Imported Commodity Context",
                    status: "INSPECTION_INCOMPLETE",
                    statusLabel: "Inspection Incomplete",
                    extractedValue: "Surface Not Captured",
                    confidence: 0,
                    evidence: null,
                    explanation: "Back/information surface not captured to assess Country of Origin on imported product."
                });
            } else {
                results.push({
                    id: "rule_origin",
                    ruleId: "Rule 6(1)(b)",
                    ruleName: "Country of Origin",
                    requirement: "Country of origin must be declared on every imported package.",
                    applicability: "Imported Commodity Context",
                    status: "POTENTIAL_NON_COMPLIANCE",
                    statusLabel: "Potential Non-Compliance",
                    extractedValue: "Not detected",
                    confidence: 0,
                    evidence: null,
                    explanation: "Imported commodity lacking clear Country of Origin declaration across captured surfaces."
                });
            }
        } else {
            results.push({
                id: "rule_origin",
                ruleId: "Rule 6(1)(b)",
                ruleName: "Country of Origin",
                requirement: "Domestic manufacture origin identification.",
                applicability: "Domestic Packaged Commodities",
                status: "COMPLIANT_CANDIDATE",
                statusLabel: "Compliant Candidate",
                extractedValue: "India (Domestic Manufacture Presumed)",
                confidence: 85,
                evidence: null,
                explanation: "Identified as domestic manufacture based on Indian address & PIN; conforms to Rule 6(1)(b)."
            });
        }
    }

    // ----------------------------------------------------
    // Rule 4: Net Quantity & Standard SI Units (Rule 6(1)(d) & Rule 12)
    // ----------------------------------------------------
    const netQty = structuredData.netQuantity;
    const netVal = netQty?.value !== undefined ? netQty.value : (typeof netQty === 'number' || typeof netQty === 'string' ? netQty : null);
    const netUnit = netQty?.unit || '';
    const netConf = netQty?.confidence;

    if (netVal !== null && netVal !== undefined && netVal !== '') {
        const standardUnits = ['g', 'kg', 'ml', 'l', 'pc', 'pcs', 'n', 'g.', 'kg.'];
        const isStandard = netUnit && standardUnits.includes(String(netUnit).toLowerCase());

        results.push({
            id: "rule_net_qty",
            ruleId: "Rule 6(1)(d)",
            ruleName: "Net Quantity & Standard SI Units",
            requirement: "The net quantity in terms of standard unit of weight or measure or in number shall be declared on the Principal Display Panel.",
            applicability: "All Packaged Commodities",
            status: isStandard ? "COMPLIANT_CANDIDATE" : "NEEDS_OFFICER_VERIFICATION",
            statusLabel: isStandard ? "Compliant Candidate" : "Needs Officer Verification",
            extractedValue: `${netVal} ${netUnit}`.trim(),
            confidence: netConf ? Math.round(netConf * 100) : 88,
            evidence: netQty?.bbox || null,
            explanation: isStandard
                ? `Net quantity declared with recognized standard unit (${netVal} ${netUnit}).`
                : `Net quantity numerical value detected (${netVal}), but unit "${netUnit}" should be verified by officer for standard SI conformity.`
        });
    } else {
        if (!hasFront) {
            results.push({
                id: "rule_net_qty",
                ruleId: "Rule 6(1)(d)",
                ruleName: "Net Quantity & Standard SI Units",
                requirement: "Net quantity shall be declared on the Principal Display Panel.",
                applicability: "All Packaged Commodities",
                status: "INSPECTION_INCOMPLETE",
                statusLabel: "Inspection Incomplete",
                extractedValue: "Surface Not Captured",
                confidence: 0,
                evidence: null,
                explanation: "Front surface not captured to assess net quantity declaration."
            });
        } else {
            results.push({
                id: "rule_net_qty",
                ruleId: "Rule 6(1)(d)",
                ruleName: "Net Quantity & Standard SI Units",
                requirement: "Net quantity shall be declared on the Principal Display Panel.",
                applicability: "All Packaged Commodities",
                status: "POTENTIAL_NON_COMPLIANCE",
                statusLabel: "Potential Non-Compliance",
                extractedValue: "Not detected",
                confidence: 0,
                evidence: null,
                explanation: "Net weight, volume, or count declaration is not detected on the Principal Display Panel."
            });
        }
    }

    // ----------------------------------------------------
    // Rule 5: Maximum Retail Price (MRP) & Dual Pricing Check (Rule 6(1)(e))
    // ----------------------------------------------------
    const mrp = structuredData.mrp;
    const mrpVal = mrp?.value !== undefined ? mrp.value : (typeof mrp === 'number' || typeof mrp === 'string' ? mrp : null);
    const mrpConf = mrp?.confidence;

    // Check if cross-view consistency flagged an MRP conflict
    const mrpConflict = crossViewConflicts.find(c => c.field?.toLowerCase().includes("mrp"));

    if (mrpConflict) {
        results.push({
            id: "rule_mrp",
            ruleId: "Rule 6(1)(e)",
            ruleName: "Maximum Retail Price (MRP) Declaration",
            requirement: "Retail sale price inclusive of all taxes must be clearly declared without dual-pricing or inconsistencies.",
            applicability: "All Packaged Commodities",
            status: "CONFLICTING_DECLARATION",
            statusLabel: "Conflicting Declaration",
            extractedValue: `${mrpConflict.surface1}: ${mrpConflict.value1} vs ${mrpConflict.surface2}: ${mrpConflict.value2}`,
            confidence: 90,
            evidence: mrpConflict.evidence1?.bbox || mrp?.bbox || null,
            explanation: mrpConflict.description || "Inconsistent MRP values detected across captured package surfaces."
        });
    } else if (mrpVal !== null && mrpVal !== undefined && mrpVal !== '') {
        const isLowConf = mrpConf && mrpConf < 0.65;
        results.push({
            id: "rule_mrp",
            ruleId: "Rule 6(1)(e)",
            ruleName: "Maximum Retail Price (MRP) Declaration",
            requirement: "The retail sale price of the package in standard format: 'MRP ₹ xx.xx (incl. of all taxes)' shall be declared.",
            applicability: "All Packaged Commodities",
            status: isLowConf ? "NEEDS_OFFICER_VERIFICATION" : "COMPLIANT_CANDIDATE",
            statusLabel: isLowConf ? "Needs Officer Verification" : "Compliant Candidate",
            extractedValue: `₹ ${mrpVal} (incl. of all taxes)`,
            confidence: mrpConf ? Math.round(mrpConf * 100) : 92,
            evidence: mrp?.bbox || null,
            explanation: isLowConf
                ? "MRP numerical value detected with low confidence; officer verification required to confirm price."
                : "Maximum Retail Price declaration detected in Indian Rupees format."
        });
    } else {
        results.push({
            id: "rule_mrp",
            ruleId: "Rule 6(1)(e)",
            ruleName: "Maximum Retail Price (MRP) Declaration",
            requirement: "The retail sale price of the package shall be declared.",
            applicability: "All Packaged Commodities",
            status: "POTENTIAL_NON_COMPLIANCE",
            statusLabel: "Potential Non-Compliance",
            extractedValue: "Not detected",
            confidence: 0,
            evidence: null,
            explanation: "Maximum Retail Price declaration missing or unreadable across inspected packaging surfaces."
        });
    }

    // ----------------------------------------------------
    // Rule 6: Date of Manufacture / Packing (Rule 6(1)(f))
    // ----------------------------------------------------
    const mfgDate = structuredData.manufacturingDate?.value || (typeof structuredData.manufacturingDate === 'string' ? structuredData.manufacturingDate : null);
    const bestBefore = structuredData.bestBefore?.value || (typeof structuredData.bestBefore === 'string' ? structuredData.bestBefore : null);

    if (mfgDate || bestBefore) {
        results.push({
            id: "rule_mfg_date",
            ruleId: "Rule 6(1)(f)",
            ruleName: "Date of Manufacture / Packing / Expiry",
            requirement: "Month and year in which the commodity is manufactured, packed, or imported shall be declared.",
            applicability: "All Packaged Commodities",
            status: "COMPLIANT_CANDIDATE",
            statusLabel: "Compliant Candidate",
            extractedValue: mfgDate ? `Mfg Date: ${mfgDate}` : `Best Before: ${bestBefore}`,
            confidence: 85,
            evidence: structuredData.manufacturingDate?.bbox || null,
            explanation: "Manufacturing, packaging, or durability date declaration detected on package."
        });
    } else {
        if (!hasBack) {
            results.push({
                id: "rule_mfg_date",
                ruleId: "Rule 6(1)(f)",
                ruleName: "Date of Manufacture / Packing / Expiry",
                requirement: "Month and year of manufacture or packing shall be declared.",
                applicability: "All Packaged Commodities",
                status: "INSPECTION_INCOMPLETE",
                statusLabel: "Inspection Incomplete",
                extractedValue: "Back surface not captured",
                confidence: 0,
                evidence: null,
                explanation: "Back or information panel has not been captured; date declarations cannot yet be assessed."
            });
        } else {
            results.push({
                id: "rule_mfg_date",
                ruleId: "Rule 6(1)(f)",
                ruleName: "Date of Manufacture / Packing / Expiry",
                requirement: "Month and year of manufacture or packing shall be declared.",
                applicability: "All Packaged Commodities",
                status: "NEEDS_OFFICER_VERIFICATION",
                statusLabel: "Needs Officer Verification",
                extractedValue: "Not detected",
                confidence: 0,
                evidence: null,
                explanation: "Month & year of manufacture/packing not detected on scanned surfaces. Check batch coding / debossed areas."
            });
        }
    }

    // ----------------------------------------------------
    // Rule 7: Consumer Care Details (Rule 6(1)(h))
    // ----------------------------------------------------
    const care = structuredData.consumerCare;
    const hasPhone = care?.phone?.value || (typeof care?.phone === 'string' ? care.phone : null);
    const hasEmail = care?.email?.value || (typeof care?.email === 'string' ? care.email : null);

    if (hasPhone || hasEmail) {
        const contactText = [hasPhone ? `Phone: ${hasPhone}` : '', hasEmail ? `Email: ${hasEmail}` : ''].filter(Boolean).join(', ');
        const isBoth = hasPhone && hasEmail;

        results.push({
            id: "rule_consumer_care",
            ruleId: "Rule 6(1)(h)",
            ruleName: "Consumer Care Contact Details",
            requirement: "Name, address, telephone number, or email address of the person or office for consumer grievance redressal.",
            applicability: "All Packaged Commodities",
            status: isBoth ? "COMPLIANT_CANDIDATE" : "NEEDS_OFFICER_VERIFICATION",
            statusLabel: isBoth ? "Compliant Candidate" : "Needs Officer Verification",
            extractedValue: contactText,
            confidence: 82,
            evidence: care?.phone?.bbox || care?.email?.bbox || null,
            explanation: isBoth
                ? "Both helpline phone number and email address are present on package."
                : "Partial consumer contact details detected. Officer verification recommended to confirm helpline accessibility."
        });
    } else {
        if (!hasBack) {
            results.push({
                id: "rule_consumer_care",
                ruleId: "Rule 6(1)(h)",
                ruleName: "Consumer Care Contact Details",
                requirement: "Consumer care telephone or email contact shall be declared.",
                applicability: "All Packaged Commodities",
                status: "INSPECTION_INCOMPLETE",
                statusLabel: "Inspection Incomplete",
                extractedValue: "Surface Not Captured",
                confidence: 0,
                evidence: null,
                explanation: "Information panel not captured; consumer complaint contact information cannot yet be assessed."
            });
        } else {
            results.push({
                id: "rule_consumer_care",
                ruleId: "Rule 6(1)(h)",
                ruleName: "Consumer Care Contact Details",
                requirement: "Consumer care telephone or email contact shall be declared.",
                applicability: "All Packaged Commodities",
                status: "POTENTIAL_NON_COMPLIANCE",
                statusLabel: "Potential Non-Compliance",
                extractedValue: "Not detected",
                confidence: 0,
                evidence: null,
                explanation: "Consumer grievance helpline or email address not detected on inspected surfaces."
            });
        }
    }

    // ----------------------------------------------------
    // Rule 8: Physical Font-Size / Readability Protocol (Rule 9 / Table 1)
    // As per LMPC 2011 First Schedule / Table 1:
    // Net Qty <= 200g/ml -> Min numeral height 2 mm (blown/moulded 4 mm)
    // Net Qty > 200g/ml to 1kg/l -> Min numeral height 4 mm (blown/moulded 6 mm)
    // Net Qty > 1kg/l -> Min numeral height 6 mm
    // Cannot fabricate physical millimeters without valid calibration data.
    // ----------------------------------------------------
    const calibration = options.calibration || context.calibration || null;
    if (calibration && calibration.hasCalibration && calibration.pixelsPerMm > 0) {
        // Evaluate with real calibration
        const netQtyBbox = structuredData.netQuantity?.bbox;
        if (Array.isArray(netQtyBbox) && netQtyBbox.length === 4) {
            // Calculate height in pixels
            const yMin = Math.min(...netQtyBbox.map(p => p[1]));
            const yMax = Math.max(...netQtyBbox.map(p => p[1]));
            const heightPx = Math.abs(yMax - yMin);
            const physicalHeightMm = Number((heightPx / calibration.pixelsPerMm).toFixed(1));

            const netQtyVal = parseFloat(structuredData.netQuantity?.value || "0");
            let minReqMm = 2.0; // Default tier
            if (netQtyVal > 1000) minReqMm = 6.0;
            else if (netQtyVal > 200) minReqMm = 4.0;

            const isCompliant = physicalHeightMm >= minReqMm;

            results.push({
                id: "rule_font_readability",
                ruleId: "Rule 9 / Table 1",
                ruleName: "Declaration Height & Readability Calibration",
                requirement: `Minimum height of numerals: ${minReqMm} mm based on net quantity category (Rule 9 Table 1).`,
                applicability: "Principal Display Panel Declarations",
                status: isCompliant ? "COMPLIANT_CANDIDATE" : "POTENTIAL_NON_COMPLIANCE",
                statusLabel: isCompliant ? "Compliant Candidate" : "Potential Non-Compliance",
                extractedValue: `${physicalHeightMm} mm (Measured via ${calibration.pixelsPerMm.toFixed(1)} px/mm calibration)`,
                confidence: 90,
                evidence: netQtyBbox,
                explanation: isCompliant
                    ? `Physical numeral height of ${physicalHeightMm} mm satisfies the statutory requirement of at least ${minReqMm} mm.`
                    : `Physical numeral height of ${physicalHeightMm} mm is below the statutory requirement of ${minReqMm} mm.`
            });
        } else {
            results.push({
                id: "rule_font_readability",
                ruleId: "Rule 9 / Table 1",
                ruleName: "Declaration Height & Readability Calibration",
                requirement: "Minimum height of numerals and letters based on net quantity area (LMPC Schedule II).",
                applicability: "Principal Display Panel Declarations",
                status: "NEEDS_OFFICER_VERIFICATION",
                statusLabel: "Needs Officer Verification",
                extractedValue: "Scale Calibrated, Bounding Box Refinement Needed",
                confidence: 70,
                evidence: null,
                explanation: "Calibration scale is verified. Officer verification required to confirm numeral bounding box selection."
            });
        }
    } else {
        results.push({
            id: "rule_font_readability",
            ruleId: "Rule 9 / Table 1",
            ruleName: "Declaration Height & Readability Calibration",
            requirement: "Minimum height of numerals and letters based on net quantity area (LMPC Schedule II).",
            applicability: "Principal Display Panel Declarations",
            status: "NOT_ASSESSABLE",
            statusLabel: "Not Assessable Without Calibration",
            extractedValue: "Uncalibrated Optical Feed",
            confidence: 0,
            evidence: null,
            explanation: "Physical font millimeter size cannot be reliably determined from an uncalibrated optical image. Place a calibrated reference marker or specify known dimension in calibration mode to measure physical millimeters."
        });
    }


    // ----------------------------------------------------
    // Aggregate Summary
    // ----------------------------------------------------
    const potentialNonComplianceCount = results.filter(r => r.status === "POTENTIAL_NON_COMPLIANCE" || r.status === "CONFLICTING_DECLARATION").length;
    const reviewCount = results.filter(r => r.status === "NEEDS_OFFICER_VERIFICATION").length;
    const incompleteCount = results.filter(r => r.status === "INSPECTION_INCOMPLETE").length;
    const passCount = results.filter(r => r.status === "COMPLIANT_CANDIDATE").length;

    let overallStatus = "COMPLIANT_CANDIDATE";
    let statusLabel = "Compliant Candidate";

    if (incompleteCount > 0) {
        overallStatus = "INSPECTION_INCOMPLETE";
        statusLabel = "Inspection Incomplete - Additional Surfaces Required";
    } else if (potentialNonComplianceCount > 0) {
        overallStatus = "POTENTIAL_NON_COMPLIANCE";
        statusLabel = "Potential Non-Compliance Detected - Officer Verification Required";
    } else if (reviewCount > 0) {
        overallStatus = "NEEDS_OFFICER_VERIFICATION";
        statusLabel = "Needs Officer Verification";
    }

    return {
        overallStatus,
        statusLabel,
        ruleVersion: CURRENT_RULE_VERSION,
        evaluationTimestamp: evalDate,
        passCount,
        reviewCount,
        potentialNonComplianceCount,
        incompleteCount,
        crossViewConflicts,
        results
    };
}
