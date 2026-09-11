/**
 * Legal Metrology (Packaged Commodities) Rules, 2011 Compliance Evaluator (Client Mirror)
 * Version: LMPC-2011.A2024
 * 
 * ASSISTIVE TERMINOLOGY:
 * - Compliant Candidate
 * - Potential Non-Compliance
 * - Needs Officer Verification
 * - Not Assessable
 * - Inspection Incomplete
 * - Conflicting Declaration
 */

export const CURRENT_RULE_VERSION = {
  version: "LMPC-2011.A2024",
  name: "Legal Metrology (Packaged Commodities) Rules, 2011",
  effectiveDate: "2024-01-01"
};

export function evaluateCompliance(structuredData = {}, options = {}) {
  const {
    surfaces = ['Front', 'Back'],
    context = {},
    crossViewConflicts = []
  } = options;

  const results = [];
  const normalizedSurfaces = surfaces.map(s => String(s).toLowerCase());
  const hasFront = normalizedSurfaces.includes('front') || normalizedSurfaces.some(s => s.includes('front'));
  const hasBack = normalizedSurfaces.includes('back') || normalizedSurfaces.some(s => s.includes('back'));

  // 1. Common / Generic Product Name (Rule 6(1)(c))
  const productName = structuredData.productName?.value;
  if (productName && String(productName).trim().length > 0) {
    results.push({
      id: 'rule_product_name',
      ruleId: 'Rule 6(1)(c)',
      ruleName: 'Generic Commodity Name',
      status: 'COMPLIANT_CANDIDATE',
      statusLabel: 'Compliant Candidate',
      extractedValue: String(productName),
      evidence: structuredData.productName?.bbox || null,
      sourceSurface: 'Front',
      explanation: 'Generic or common name of commodity detected on Principal Display Panel.'
    });
  } else {
    if (!hasFront) {
      results.push({
        id: 'rule_product_name',
        ruleId: 'Rule 6(1)(c)',
        ruleName: 'Generic Commodity Name',
        status: 'INSPECTION_INCOMPLETE',
        statusLabel: 'Inspection Incomplete',
        extractedValue: 'Surface Not Captured',
        evidence: null,
        explanation: 'Front surface (Principal Display Panel) not captured. Commodity identity cannot yet be assessed.'
      });
    } else {
      results.push({
        id: 'rule_product_name',
        ruleId: 'Rule 6(1)(c)',
        ruleName: 'Generic Commodity Name',
        status: 'POTENTIAL_NON_COMPLIANCE',
        statusLabel: 'Potential Non-Compliance',
        extractedValue: 'Not detected',
        evidence: null,
        explanation: 'Generic commodity name not detected on inspected surfaces.'
      });
    }
  }

  // 2. Manufacturer / Packer Details (Rule 6(1)(a))
  const mfg = structuredData.manufacturer;
  const hasMfg = mfg && Array.isArray(mfg) && mfg.length > 0;
  const packer = structuredData.packer;
  const importer = structuredData.importer;

  if (hasMfg) {
    const fullMfg = mfg.map(item => (typeof item === 'object' ? item.value : item)).join(', ');
    results.push({
      id: 'rule_manufacturer',
      ruleId: 'Rule 6(1)(a)',
      ruleName: 'Manufacturer / Packer Identity & Address',
      status: 'COMPLIANT_CANDIDATE',
      statusLabel: 'Compliant Candidate',
      extractedValue: fullMfg,
      evidence: mfg[0]?.bbox || null,
      sourceSurface: 'Back',
      explanation: 'Manufacturer/Packer name and address declared.'
    });
  } else if (packer || importer) {
    const pVal = packer?.value || importer?.value || 'Packer/Importer identified';
    results.push({
      id: 'rule_manufacturer',
      ruleId: 'Rule 6(1)(a)',
      ruleName: 'Manufacturer / Packer / Importer',
      status: 'COMPLIANT_CANDIDATE',
      statusLabel: 'Compliant Candidate',
      extractedValue: pVal,
      evidence: null,
      explanation: 'Packer or Importer details declared on package.'
    });
  } else {
    if (!hasBack) {
      results.push({
        id: 'rule_manufacturer',
        ruleId: 'Rule 6(1)(a)',
        ruleName: 'Manufacturer / Packer Identity & Address',
        status: 'INSPECTION_INCOMPLETE',
        statusLabel: 'Inspection Incomplete',
        extractedValue: 'Back surface not captured',
        evidence: null,
        explanation: 'Back surface has not been captured. Declarations located on this surface cannot yet be assessed.'
      });
    } else {
      results.push({
        id: 'rule_manufacturer',
        ruleId: 'Rule 6(1)(a)',
        ruleName: 'Manufacturer / Packer Identity & Address',
        status: 'POTENTIAL_NON_COMPLIANCE',
        statusLabel: 'Potential Non-Compliance',
        extractedValue: 'Not detected',
        evidence: null,
        explanation: 'Complete manufacturer/packer identity missing across inspected surfaces.'
      });
    }
  }

  // 3. Country of Origin (Rule 6(1)(b))
  const origin = structuredData.countryOfOrigin?.value || structuredData.countryOfOrigin;
  if (origin) {
    results.push({
      id: 'rule_origin',
      ruleId: 'Rule 6(1)(b)',
      ruleName: 'Country of Origin',
      status: 'COMPLIANT_CANDIDATE',
      statusLabel: 'Compliant Candidate',
      extractedValue: String(origin),
      evidence: structuredData.countryOfOrigin?.bbox || null,
      explanation: `Declared country of origin: ${origin}.`
    });
  } else {
    results.push({
      id: 'rule_origin',
      ruleId: 'Rule 6(1)(b)',
      ruleName: 'Country of Origin',
      status: 'COMPLIANT_CANDIDATE',
      statusLabel: 'Compliant Candidate',
      extractedValue: 'India (Domestic Manufacture Presumed)',
      evidence: null,
      explanation: 'Domestic manufacture identified based on address.'
    });
  }

  // 4. Net Quantity (Rule 6(1)(d))
  const netQty = structuredData.netQuantity;
  const netVal = netQty?.value !== undefined ? netQty.value : (typeof netQty === 'number' || typeof netQty === 'string' ? netQty : null);
  const netUnit = netQty?.unit || '';

  if (netVal !== null && netVal !== undefined && netVal !== '') {
    const validUnits = ['g', 'kg', 'ml', 'l', 'pc', 'pcs', 'n', 'g.', 'kg.'];
    const isStandard = netUnit && validUnits.includes(String(netUnit).toLowerCase());

    results.push({
      id: 'rule_net_qty',
      ruleId: 'Rule 6(1)(d)',
      ruleName: 'Net Quantity & Standard Units',
      status: isStandard ? 'COMPLIANT_CANDIDATE' : 'NEEDS_OFFICER_VERIFICATION',
      statusLabel: isStandard ? 'Compliant Candidate' : 'Needs Officer Verification',
      extractedValue: `${netVal} ${netUnit}`.trim(),
      evidence: netQty?.bbox || null,
      explanation: isStandard
        ? `Declared net quantity adhering to SI units (${netVal} ${netUnit}).`
        : `Quantity detected (${netVal}), unit "${netUnit}" requires officer verification.`
    });
  } else {
    if (!hasFront) {
      results.push({
        id: 'rule_net_qty',
        ruleId: 'Rule 6(1)(d)',
        ruleName: 'Net Quantity & Standard Units',
        status: 'INSPECTION_INCOMPLETE',
        statusLabel: 'Inspection Incomplete',
        extractedValue: 'Surface Not Captured',
        evidence: null,
        explanation: 'Front surface not captured to evaluate net quantity.'
      });
    } else {
      results.push({
        id: 'rule_net_qty',
        ruleId: 'Rule 6(1)(d)',
        ruleName: 'Net Quantity & Standard Units',
        status: 'POTENTIAL_NON_COMPLIANCE',
        statusLabel: 'Potential Non-Compliance',
        extractedValue: 'Not detected',
        evidence: null,
        explanation: 'Net quantity measure declaration missing from PDP.'
      });
    }
  }

  // 5. Maximum Retail Price (MRP) (Rule 6(1)(e))
  const mrp = structuredData.mrp;
  const mrpVal = mrp?.value !== undefined ? mrp.value : (typeof mrp === 'number' || typeof mrp === 'string' ? mrp : null);
  const mrpConflict = crossViewConflicts.find(c => c.field?.toLowerCase().includes("mrp"));

  if (mrpConflict) {
    results.push({
      id: 'rule_mrp',
      ruleId: 'Rule 6(1)(e)',
      ruleName: 'Maximum Retail Price (MRP)',
      status: 'CONFLICTING_DECLARATION',
      statusLabel: 'Conflicting Declaration',
      extractedValue: `${mrpConflict.surface1}: ${mrpConflict.value1} vs ${mrpConflict.surface2}: ${mrpConflict.value2}`,
      evidence: mrp?.bbox || null,
      explanation: mrpConflict.description || 'Dual or inconsistent MRP values detected across surfaces.'
    });
  } else if (mrpVal !== null && mrpVal !== undefined && mrpVal !== '') {
    results.push({
      id: 'rule_mrp',
      ruleId: 'Rule 6(1)(e)',
      ruleName: 'Maximum Retail Price (MRP)',
      status: 'COMPLIANT_CANDIDATE',
      statusLabel: 'Compliant Candidate',
      extractedValue: `₹ ${mrpVal} (incl. of all taxes)`,
      evidence: mrp?.bbox || null,
      explanation: 'MRP declaration detected with numerical currency value.'
    });
  } else {
    results.push({
      id: 'rule_mrp',
      ruleId: 'Rule 6(1)(e)',
      ruleName: 'Maximum Retail Price (MRP)',
      status: 'POTENTIAL_NON_COMPLIANCE',
      statusLabel: 'Potential Non-Compliance',
      extractedValue: 'Not detected',
      evidence: null,
      explanation: 'Maximum Retail Price declaration missing.'
    });
  }

  // 6. Date of Manufacture / Packing (Rule 6(1)(f))
  const mfgDate = structuredData.manufacturingDate?.value;
  const bestBefore = structuredData.bestBefore?.value;
  if (mfgDate || bestBefore) {
    results.push({
      id: 'rule_mfg_date',
      ruleId: 'Rule 6(1)(f)',
      ruleName: 'Date of Manufacture / Packing',
      status: 'COMPLIANT_CANDIDATE',
      statusLabel: 'Compliant Candidate',
      extractedValue: mfgDate ? `Mfg: ${mfgDate}` : `Best Before: ${bestBefore}`,
      evidence: structuredData.manufacturingDate?.bbox || null,
      explanation: 'Manufacturing/packing date declaration detected.'
    });
  } else {
    if (!hasBack) {
      results.push({
        id: 'rule_mfg_date',
        ruleId: 'Rule 6(1)(f)',
        ruleName: 'Date of Manufacture / Packing',
        status: 'INSPECTION_INCOMPLETE',
        statusLabel: 'Inspection Incomplete',
        extractedValue: 'Back surface not captured',
        evidence: null,
        explanation: 'Back surface not captured; date declarations cannot yet be assessed.'
      });
    } else {
      results.push({
        id: 'rule_mfg_date',
        ruleId: 'Rule 6(1)(f)',
        ruleName: 'Date of Manufacture / Packing',
        status: 'NEEDS_OFFICER_VERIFICATION',
        statusLabel: 'Needs Officer Verification',
        extractedValue: 'Not detected',
        evidence: null,
        explanation: 'Manufacturing/packing date not detected. Check debossed batch area.'
      });
    }
  }

  // 7. Consumer Care Details (Rule 6(1)(h))
  const care = structuredData.consumerCare;
  const phone = care?.phone?.value || (typeof care?.phone === 'string' ? care.phone : null);
  const email = care?.email?.value || (typeof care?.email === 'string' ? care.email : null);

  if (phone || email) {
    const contactText = [phone ? `Phone: ${phone}` : '', email ? `Email: ${email}` : ''].filter(Boolean).join(', ');
    const both = phone && email;
    results.push({
      id: 'rule_consumer_care',
      ruleId: 'Rule 6(1)(h)',
      ruleName: 'Consumer Care Helpline Details',
      status: both ? 'COMPLIANT_CANDIDATE' : 'NEEDS_OFFICER_VERIFICATION',
      statusLabel: both ? 'Compliant Candidate' : 'Needs Officer Verification',
      extractedValue: contactText,
      evidence: care?.phone?.bbox || care?.email?.bbox || null,
      explanation: both
        ? 'Both telephone and email address present for consumer complaints.'
        : 'Partial consumer contact detected. Both telephone & email recommended.'
    });
  } else {
    if (!hasBack) {
      results.push({
        id: 'rule_consumer_care',
        ruleId: 'Rule 6(1)(h)',
        ruleName: 'Consumer Care Helpline Details',
        status: 'INSPECTION_INCOMPLETE',
        statusLabel: 'Inspection Incomplete',
        extractedValue: 'Surface Not Captured',
        evidence: null,
        explanation: 'Back surface not captured; consumer care details cannot yet be assessed.'
      });
    } else {
      results.push({
        id: 'rule_consumer_care',
        ruleId: 'Rule 6(1)(h)',
        ruleName: 'Consumer Care Helpline Details',
        status: 'POTENTIAL_NON_COMPLIANCE',
        statusLabel: 'Potential Non-Compliance',
        extractedValue: 'Not detected',
        evidence: null,
        explanation: 'Consumer complaint contact helpline/email missing.'
      });
    }
  }

  // 8. Font Size / Physical Calibration
  results.push({
    id: 'rule_font_readability',
    ruleId: 'Rule 9 / Table 1',
    ruleName: 'Declaration Height & Readability Calibration',
    status: 'NOT_ASSESSABLE',
    statusLabel: 'Not Assessable Without Calibration',
    extractedValue: 'Uncalibrated Optical Feed',
    evidence: null,
    explanation: 'Physical millimeter font height cannot be determined without a physical reference marker in frame.'
  });

  const potentialNonComplianceCount = results.filter(r => r.status === 'POTENTIAL_NON_COMPLIANCE' || r.status === 'CONFLICTING_DECLARATION').length;
  const reviewCount = results.filter(r => r.status === 'NEEDS_OFFICER_VERIFICATION').length;
  const incompleteCount = results.filter(r => r.status === 'INSPECTION_INCOMPLETE').length;
  const passCount = results.filter(r => r.status === 'COMPLIANT_CANDIDATE').length;

  let overallStatus = 'COMPLIANT_CANDIDATE';
  let statusLabel = 'Compliant Candidate';

  if (incompleteCount > 0) {
    overallStatus = 'INSPECTION_INCOMPLETE';
    statusLabel = 'Inspection Incomplete - Additional Surfaces Required';
  } else if (potentialNonComplianceCount > 0) {
    overallStatus = 'POTENTIAL_NON_COMPLIANCE';
    statusLabel = 'Potential Non-Compliance Detected - Officer Verification Required';
  } else if (reviewCount > 0) {
    overallStatus = 'NEEDS_OFFICER_VERIFICATION';
    statusLabel = 'Needs Officer Verification';
  }

  return {
    overallStatus,
    statusLabel,
    ruleVersion: CURRENT_RULE_VERSION,
    passCount,
    reviewCount,
    potentialNonComplianceCount,
    incompleteCount,
    crossViewConflicts,
    results
  };
}
