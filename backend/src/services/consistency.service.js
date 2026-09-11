/**
 * Cross-View Consistency Verification Service
 * Compares declarations extracted across different package surfaces to identify discrepancies.
 * e.g., Front label MRP says ₹120 while back label says ₹150.
 */

export function detectCrossViewConflicts(ocrItems = [], surfaces = [], structuredData = {}) {
    const conflicts = [];
    if (!ocrItems || ocrItems.length === 0 || !surfaces || surfaces.length < 2) {
        return conflicts;
    }

    // Helper: Find numbers matching regex near a keyword in a specific surface
    const extractMrpPerSurface = () => {
        const mrpsBySurface = {}; // { surfaceName: [{ value, text, bbox }] }

        ocrItems.forEach((item) => {
            const surfaceName = surfaces[item.imageIndex] || `Surface ${item.imageIndex + 1}`;
            const text = item.text || "";

            // Matches MRP ₹ 120 or MRP: 120 or Rs. 120
            const match = text.match(/(?:mrp|m\.r\.p\.|rs\.?|₹)\s*[:.]?\s*₹?\s*(\d+(?:\.\d+)?)/i);
            if (match) {
                const val = parseFloat(match[1]);
                if (!isNaN(val) && val > 0) {
                    if (!mrpsBySurface[surfaceName]) mrpsBySurface[surfaceName] = [];
                    mrpsBySurface[surfaceName].push({
                        value: val,
                        text: item.text,
                        confidence: item.confidence,
                        bbox: item.bbox,
                        surface: surfaceName
                    });
                }
            }
        });

        return mrpsBySurface;
    };

    // Helper: Find Net Quantity per surface
    const extractQtyPerSurface = () => {
        const qtyBySurface = {};

        ocrItems.forEach((item) => {
            const surfaceName = surfaces[item.imageIndex] || `Surface ${item.imageIndex + 1}`;
            const text = item.text || "";

            const match = text.match(/(\d+(?:\.\d+)?)\s*(kg|g|mg|l|ml|pcs?|n)\b/i);
            if (match) {
                const val = parseFloat(match[1]);
                const unit = match[2].toLowerCase();
                if (!qtyBySurface[surfaceName]) qtyBySurface[surfaceName] = [];
                qtyBySurface[surfaceName].push({
                    value: val,
                    unit,
                    text: item.text,
                    confidence: item.confidence,
                    surface: surfaceName
                });
            }
        });

        return qtyBySurface;
    };

    // 1. Check MRP consistency across distinct surfaces
    const mrpBySurface = extractMrpPerSurface();
    const surfaceNamesWithMrp = Object.keys(mrpBySurface);

    if (surfaceNamesWithMrp.length >= 2) {
        for (let i = 0; i < surfaceNamesWithMrp.length; i++) {
            for (let j = i + 1; j < surfaceNamesWithMrp.length; j++) {
                const s1 = surfaceNamesWithMrp[i];
                const s2 = surfaceNamesWithMrp[j];
                const val1 = mrpBySurface[s1][0]?.value;
                const val2 = mrpBySurface[s2][0]?.value;

                if (val1 && val2 && Math.abs(val1 - val2) > 0.01) {
                    conflicts.push({
                        id: `conflict_mrp_${s1}_${s2}`,
                        field: "Maximum Retail Price (MRP)",
                        ruleRef: "Rule 6(1)(e) - Dual MRP / Inconsistent Declaration",
                        surface1: s1,
                        value1: `₹${val1}`,
                        evidence1: mrpBySurface[s1][0],
                        surface2: s2,
                        value2: `₹${val2}`,
                        evidence2: mrpBySurface[s2][0],
                        severity: "POTENTIAL_NON_COMPLIANCE",
                        status: "POTENTIAL_CONFLICT",
                        description: `Discrepancy detected between ${s1} (declared as ₹${val1}) and ${s2} (declared as ₹${val2}). Potential non-compliance under dual-pricing provisions.`
                    });
                }
            }
        }
    }

    // 2. Check Net Quantity consistency across surfaces
    const qtyBySurface = extractQtyPerSurface();
    const surfaceNamesWithQty = Object.keys(qtyBySurface);

    if (surfaceNamesWithQty.length >= 2) {
        for (let i = 0; i < surfaceNamesWithQty.length; i++) {
            for (let j = i + 1; j < surfaceNamesWithQty.length; j++) {
                const s1 = surfaceNamesWithQty[i];
                const s2 = surfaceNamesWithQty[j];
                const q1 = qtyBySurface[s1][0];
                const q2 = qtyBySurface[s2][0];

                if (q1 && q2 && (q1.value !== q2.value || q1.unit !== q2.unit)) {
                    // Check if different or conversion mismatch
                    conflicts.push({
                        id: `conflict_qty_${s1}_${s2}`,
                        field: "Net Quantity",
                        ruleRef: "Rule 6(1)(d) - Net Quantity Consistency",
                        surface1: s1,
                        value1: `${q1.value} ${q1.unit}`,
                        surface2: s2,
                        value2: `${q2.value} ${q2.unit}`,
                        severity: "NEEDS_OFFICER_VERIFICATION",
                        status: "POTENTIAL_CONFLICT",
                        description: `Different quantity values or units observed on ${s1} (${q1.value} ${q1.unit}) vs ${s2} (${q2.value} ${q2.unit}). Officer verification required.`
                    });
                }
            }
        }
    }

    return conflicts;
}

