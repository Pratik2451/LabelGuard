import React, { useState } from 'react';
import {
  ShoppingBag, Globe, UploadCloud, CheckCircle2, AlertTriangle, AlertOctagon,
  FileText, ShieldCheck, ArrowRight, RefreshCw, Loader2, Tag, Calendar, Building2, HelpCircle
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export default function ECommerceInspectionView({ token, onBack, onSelectInspection }) {
  const [formData, setFormData] = useState({
    listingUrl: '',
    platformName: 'Amazon India',
    productTitle: '',
    mrp: '',
    declaredQuantity: '',
    countryOfOrigin: '',
    manufacturerDetails: '',
    consumerCare: '',
    expiryDate: ''
  });

  const [screenshot, setScreenshot] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  const platforms = [
    'Amazon India',
    'Flipkart',
    'Blinkit',
    'Zepto',
    'Instamart',
    'JioMart',
    'Other E-Commerce Marketplace'
  ];

  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setScreenshot(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRunAudit = () => {
    setAnalyzing(true);

    // E-Commerce LMPC Rule Assessment (Rule 6(10) Amendments for Digital Platforms)
    setTimeout(() => {
      const audits = [];

      // 1. Country of Origin on E-commerce Listing (Mandatory under Rule 6(10))
      if (formData.countryOfOrigin.trim().length > 0) {
        audits.push({
          ruleId: 'Rule 6(10)(a)',
          name: 'Country of Origin Disclosure on Marketplace',
          status: 'COMPLIANT_CANDIDATE',
          statusLabel: 'Compliant Candidate',
          observation: `Declared as "${formData.countryOfOrigin.trim()}"`,
          requirement: 'Mandatory disclosure of Country of Origin on digital product display page before checkout.'
        });
      } else {
        audits.push({
          ruleId: 'Rule 6(10)(a)',
          name: 'Country of Origin Disclosure on Marketplace',
          status: 'POTENTIAL_NON_COMPLIANCE',
          statusLabel: 'Potential Non-Compliance',
          observation: 'Missing / Not Disclosed on product listing',
          requirement: 'Mandatory disclosure of Country of Origin on digital product display page before checkout.'
        });
      }

      // 2. Maximum Retail Price (MRP) & Unit Sale Price
      if (formData.mrp.trim().length > 0) {
        audits.push({
          ruleId: 'Rule 6(10)(b)',
          name: 'Digital MRP & Unit Sale Price Display',
          status: 'COMPLIANT_CANDIDATE',
          statusLabel: 'Compliant Candidate',
          observation: `Declared as ₹ ${formData.mrp.trim()}`,
          requirement: 'Must declare inclusive Maximum Retail Price and per-unit price (per g/ml/number).'
        });
      } else {
        audits.push({
          ruleId: 'Rule 6(10)(b)',
          name: 'Digital MRP & Unit Sale Price Display',
          status: 'POTENTIAL_NON_COMPLIANCE',
          statusLabel: 'Potential Non-Compliance',
          observation: 'MRP field absent or improperly formatted',
          requirement: 'Must declare inclusive Maximum Retail Price and per-unit price (per g/ml/number).'
        });
      }

      // 3. Net Quantity Declaration
      if (formData.declaredQuantity.trim().length > 0) {
        audits.push({
          ruleId: 'Rule 6(10)(c)',
          name: 'Net Quantity in Standard Metric Units',
          status: 'COMPLIANT_CANDIDATE',
          statusLabel: 'Compliant Candidate',
          observation: `Declared as "${formData.declaredQuantity.trim()}"`,
          requirement: 'Net quantity must be declared in standard SI units (g, kg, ml, l) or count.'
        });
      } else {
        audits.push({
          ruleId: 'Rule 6(10)(c)',
          name: 'Net Quantity in Standard Metric Units',
          status: 'POTENTIAL_NON_COMPLIANCE',
          statusLabel: 'Potential Non-Compliance',
          observation: 'Net quantity metric not visible on listing',
          requirement: 'Net quantity must be declared in standard SI units (g, kg, ml, l) or count.'
        });
      }

      // 4. Manufacturer / Packer Identity
      if (formData.manufacturerDetails.trim().length > 0) {
        audits.push({
          ruleId: 'Rule 6(10)(d)',
          name: 'Manufacturer / Importer / Packer Identification',
          status: 'COMPLIANT_CANDIDATE',
          statusLabel: 'Compliant Candidate',
          observation: `Provided: "${formData.manufacturerDetails.trim().substring(0, 40)}..."`,
          requirement: 'Complete business identity and address of manufacturer/packer must be provided.'
        });
      } else {
        audits.push({
          ruleId: 'Rule 6(10)(d)',
          name: 'Manufacturer / Importer / Packer Identification',
          status: 'NEEDS_OFFICER_VERIFICATION',
          statusLabel: 'Needs Officer Verification',
          observation: 'Manufacturer details not explicitly detailed on listing preview',
          requirement: 'Complete business identity and address of manufacturer/packer must be provided.'
        });
      }

      // 5. Best Before / Expiry Disclosure
      if (formData.expiryDate.trim().length > 0) {
        audits.push({
          ruleId: 'Rule 6(10)(e)',
          name: 'Best Before / Expiry Disclosure for Perishables',
          status: 'COMPLIANT_CANDIDATE',
          statusLabel: 'Compliant Candidate',
          observation: `Declared: "${formData.expiryDate.trim()}"`,
          requirement: 'Expiry date or shelf-life indication mandatory for food/cosmetics on e-commerce.'
        });
      } else {
        audits.push({
          ruleId: 'Rule 6(10)(e)',
          name: 'Best Before / Expiry Disclosure for Perishables',
          status: 'NEEDS_OFFICER_VERIFICATION',
          statusLabel: 'Needs Officer Verification',
          observation: 'Shelf life not observed on primary listing page',
          requirement: 'Expiry date or shelf-life indication mandatory for food/cosmetics on e-commerce.'
        });
      }

      setResults({
        listingId: `ECOM-${Date.now().toString().slice(-6)}`,
        audits,
        timestamp: new Date().toISOString(),
        nonComplianceCount: audits.filter(a => a.status === 'POTENTIAL_NON_COMPLIANCE').length
      });
      setAnalyzing(false);
    }, 600);
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <ShoppingBag size={22} color="var(--primary)" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)' }}>
              E-Commerce Product Listing Audit
            </h2>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Digital marketplace compliance review under Legal Metrology Rule 6(10). Evaluates required digital disclosures.
          </p>
        </div>

        {onBack && (
          <button onClick={onBack} className="btn-secondary">
            Back to Dashboard
          </button>
        )}
      </div>

      {/* Distinction Notice Banner */}
      <div style={{
        backgroundColor: 'var(--primary-subtle)',
        border: '1px solid var(--primary-border)',
        borderRadius: 'var(--radius-md)',
        padding: '14px 18px',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px'
      }}>
        <HelpCircle size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          <strong>Evidence Classification Notice:</strong> E-commerce audit findings constitute <em>"E-commerce Listing Evidence"</em>. A compliant marketplace listing does not substitute for physical package verification, but verifies mandatory online consumer disclosures prior to purchase.
        </div>
      </div>

      {/* 2-Column Form & Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '28px', marginBottom: '32px' }}>
        {/* Left: Input Form */}
        <div className="card-institutional" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px' }}>
            Listing Information &amp; Visible Declarations
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Platform / Marketplace *
              </label>
              <select
                className="input-institutional"
                value={formData.platformName}
                onChange={(e) => setFormData({ ...formData, platformName: e.target.value })}
              >
                {platforms.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Product Listing URL (Source Evidence)
              </label>
              <input
                type="url"
                className="input-institutional"
                placeholder="https://www.amazon.in/dp/..."
                value={formData.listingUrl}
                onChange={(e) => setFormData({ ...formData, listingUrl: e.target.value })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Product Title / Commodity Name *
              </label>
              <input
                type="text"
                className="input-institutional"
                placeholder="e.g. Organic Rolled Oats 1 kg"
                value={formData.productTitle}
                onChange={(e) => setFormData({ ...formData, productTitle: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Maximum Retail Price (₹) *
                </label>
                <input
                  type="text"
                  className="input-institutional"
                  placeholder="e.g. 299"
                  value={formData.mrp}
                  onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Net Quantity Declared *
                </label>
                <input
                  type="text"
                  className="input-institutional"
                  placeholder="e.g. 1000 g"
                  value={formData.declaredQuantity}
                  onChange={(e) => setFormData({ ...formData, declaredQuantity: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Country of Origin *
                </label>
                <input
                  type="text"
                  className="input-institutional"
                  placeholder="e.g. India"
                  value={formData.countryOfOrigin}
                  onChange={(e) => setFormData({ ...formData, countryOfOrigin: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Best Before / Expiry
                </label>
                <input
                  type="text"
                  className="input-institutional"
                  placeholder="e.g. 12 Months from MFD"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Manufacturer / Packer Details
              </label>
              <textarea
                rows={2}
                className="input-institutional"
                placeholder="Name and complete registered address as displayed on listing..."
                value={formData.manufacturerDetails}
                onChange={(e) => setFormData({ ...formData, manufacturerDetails: e.target.value })}
              />
            </div>

            <button
              onClick={handleRunAudit}
              className="btn-primary"
              disabled={analyzing || !formData.productTitle}
              style={{ padding: '12px 20px', marginTop: '8px' }}
            >
              {analyzing ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
              <span>Evaluate E-Commerce Compliance</span>
            </button>
          </div>
        </div>

        {/* Right: Screenshot & Audit Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Screenshot Upload Box */}
          <div className="card-institutional" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px' }}>
              Listing Screenshot / Snapshot Proof
            </h4>

            {preview ? (
              <div style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '200px', backgroundColor: '#0f172a' }}>
                <img src={preview} alt="Listing Screenshot" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                <button
                  onClick={() => { setScreenshot(null); setPreview(null); }}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '0.72rem',
                    cursor: 'pointer'
                  }}
                >
                  Change
                </button>
              </div>
            ) : (
              <label style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '28px 16px',
                border: '2px dashed var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-subtle)',
                cursor: 'pointer'
              }}>
                <UploadCloud size={28} color="var(--primary)" style={{ marginBottom: '8px' }} />
                <span style={{ fontSize: '0.84rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                  Upload Listing Screenshot
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  PNG or JPG (Preserves visual snapshot evidence)
                </span>
                <input type="file" accept="image/*" onChange={handleScreenshotChange} style={{ display: 'none' }} />
              </label>
            )}
          </div>

          {/* Real-time Audit Summary */}
          {results && (
            <div className="card-institutional" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                  Rule 6(10) Evaluation Ledger
                </h4>
                <span className={`badge-status ${results.nonComplianceCount === 0 ? 'badge-pass' : 'badge-fail'}`}>
                  {results.nonComplianceCount === 0 ? 'Fully Disclosed' : `${results.nonComplianceCount} Flags`}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {results.audits.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '10px 12px',
                      backgroundColor: 'var(--bg-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.8rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontWeight: '700', color: 'var(--primary)' }}>{item.ruleId}</span>
                      <StatusBadge status={item.status} label={item.statusLabel} size="small" />
                    </div>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{item.name}</div>
                    <div style={{ color: 'var(--text-muted)', marginTop: '2px' }}>{item.observation}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

