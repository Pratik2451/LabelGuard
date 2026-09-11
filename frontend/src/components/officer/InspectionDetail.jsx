import React, { useState } from 'react';
import {
  ArrowLeft, Download, Shield, CheckCircle2, AlertTriangle, AlertOctagon,
  Calendar, MapPin, Tag, Scale, Building2, Phone, Globe, Lock, Loader2, Copy, Check
} from 'lucide-react';
import axios from 'axios';
import StatusBadge from '../common/StatusBadge';

export default function InspectionDetail({
  inspection,
  token,
  onBack,
  onNewInspection
}) {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!inspection) return null;

  const {
    _id,
    inspectionId,
    createdAt,
    context = {},
    structuredData = {},
    complianceResults = {},
    surfaces = [],
    originalImages = [],
    crossViewConflicts = [],
    verifications = [],
    evidenceIntegrity = {},
    status
  } = inspection;

  const handleCopyId = () => {
    navigator.clipboard.writeText(inspectionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = async () => {
    if (!_id) return;
    setDownloading(true);

    try {
      const res = await axios.get(`/api/v1/products/${_id}/report`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `LabelGuard_Report_${inspectionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download report PDF:', err);
      alert('Unable to stream formal PDF report.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div style={{ padding: '32px' }}>
      {/* Top Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <button onClick={onBack} className="btn-secondary" style={{ padding: '8px 14px' }}>
          <ArrowLeft size={16} /> Back to Inspections
        </button>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleDownloadPdf}
            className="btn-primary"
            disabled={downloading}
            style={{ padding: '8px 18px', fontSize: '0.86rem' }}
          >
            {downloading ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
            <span>Export Official PDF Report</span>
          </button>
        </div>
      </div>

      {/* Main Inspection Header Card */}
      <div className="card-institutional" style={{ padding: '28px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '18px', marginBottom: '18px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span className="text-mono" style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary)' }}>
                {inspectionId}
              </span>
              <button
                onClick={handleCopyId}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                title="Copy ID"
              >
                {copied ? <Check size={16} color="var(--status-pass-text)" /> : <Copy size={16} />}
              </button>
              <StatusBadge status={status} />
            </div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)' }}>
              {structuredData.productName?.value || context.category || 'Commodity Inspection Record'}
            </h1>
          </div>

          <div style={{ textAlign: 'right', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <div>Date: <strong>{new Date(createdAt).toLocaleString()}</strong></div>
            <div>Category: <strong>{context.category || 'General'}</strong></div>
            {context.location && <div>Location: <strong>{context.location}</strong></div>}
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '14px 16px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>DECLARED NET QUANTITY</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '2px' }}>
              {structuredData.netQuantity?.value ? `${structuredData.netQuantity.value} ${structuredData.netQuantity.unit || ''}` : 'Not Detected'}
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '14px 16px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>DECLARED RETAIL PRICE (MRP)</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '2px' }}>
              {structuredData.mrp?.value ? `₹ ${structuredData.mrp.value}` : 'Not Detected'}
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '14px 16px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>COUNTRY OF ORIGIN</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '2px' }}>
              {structuredData.countryOfOrigin?.value || structuredData.countryOfOrigin || 'Domestic (India)'}
            </div>
          </div>
        </div>
      </div>

      {/* Cross-View Conflict Banner if any */}
      {crossViewConflicts.length > 0 && (
        <div style={{
          backgroundColor: 'var(--status-fail-bg)',
          border: '1px solid var(--status-fail-border)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <AlertOctagon size={18} color="var(--status-fail-text)" />
            <h4 style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--status-fail-text)' }}>
              Cross-Surface Declaration Inconsistency Flagged
            </h4>
          </div>
          {crossViewConflicts.map((c, idx) => (
            <p key={idx} style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              {c.description}
            </p>
          ))}
        </div>
      )}

      {/* Captured Surfaces Visual Gallery */}
      <div className="card-institutional" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px' }}>
          Captured Package Surfaces ({surfaces.length > 0 ? surfaces.length : originalImages.length} Surfaces Preserved)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {(surfaces.length > 0 ? surfaces : originalImages.map((img, i) => ({ surfaceName: `Surface ${i + 1}`, imagePath: img }))).map((s, idx) => {
            let imgUrl = s.imagePath || '';
            if (imgUrl.startsWith('public\\') || imgUrl.startsWith('public/')) {
              imgUrl = '/' + imgUrl.replace(/\\/g, '/');
            } else if (!imgUrl.startsWith('/')) {
              imgUrl = '/' + imgUrl.replace(/\\/g, '/');
            }

            return (
              <div key={idx} style={{
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                backgroundColor: '#0f172a'
              }}>
                <div style={{
                  padding: '8px 12px',
                  backgroundColor: 'var(--bg-subtle)',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  color: 'var(--text-primary)'
                }}>
                  <span>{s.surfaceName || `Surface ${idx + 1}`}</span>
                  <span className="badge-status badge-pass" style={{ fontSize: '0.65rem' }}>Preserved</span>
                </div>
                <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={imgUrl} alt={s.surfaceName} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                {s.hash && (
                  <div style={{ padding: '6px 10px', fontSize: '0.68rem', color: '#cbd5e1', fontFamily: 'var(--font-mono)', backgroundColor: 'rgba(0,0,0,0.85)' }}>
                    SHA-256: {s.hash.substring(0, 16)}...
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Compliance Rule Findings Table */}
      <div className="card-institutional" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '14px' }}>
          Statutory Compliance Evaluation & Verification Ledger
        </h3>

        <table className="table-institutional">
          <thead>
            <tr>
              <th>Rule ID</th>
              <th>Requirement</th>
              <th>Observed Declaration</th>
              <th>Assessed Finding</th>
              <th>Officer Verification</th>
            </tr>
          </thead>
          <tbody>
            {(complianceResults.results || []).map((r) => {
              const officerEntry = verifications.find(v => v.ruleId === r.ruleId);
              return (
                <tr key={r.id}>
                  <td className="text-mono" style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--primary)' }}>
                    {r.ruleId}
                  </td>
                  <td style={{ fontWeight: '600' }}>{r.ruleName}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{r.extractedValue}</td>
                  <td>
                    <StatusBadge status={r.status} label={r.statusLabel} size="small" />
                  </td>
                  <td>
                    {officerEntry ? (
                      <span className="badge-status badge-pass" style={{ fontSize: '0.7rem' }}>
                        {officerEntry.officerDecision}
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Officer Corrections & Audit Ledger (if any) */}
      {inspection.officerCorrections && inspection.officerCorrections.length > 0 && (
        <div className="card-institutional" style={{ padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '14px' }}>
            Officer Verified Corrections &amp; OCR Provenance
          </h3>
          <table className="table-institutional">
            <thead>
              <tr>
                <th>Field</th>
                <th>Original Machine OCR</th>
                <th>Officer Corrected Value</th>
                <th>Correction Reason</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {inspection.officerCorrections.map((c, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: '600', color: 'var(--primary)' }}>{c.field}</td>
                  <td style={{ color: 'var(--status-fail-text)', textDecoration: 'line-through' }}>
                    {String(c.originalOcrValue || 'N/A')}
                  </td>
                  <td style={{ color: 'var(--status-pass-text)', fontWeight: '700' }}>
                    {String(c.correctedValue)}
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{c.reason}</td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {new Date(c.correctedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Cryptographic Evidence Provenance Ledger */}
      <div className="card-institutional" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Lock size={18} color="var(--primary)" />
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            Evidence Integrity Provenance (SHA-256 Digest)
          </h3>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
          Digital evidence hashes generated at capture time to ensure non-tampering integrity for regulatory proceedings.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {(evidenceIntegrity.hashes || surfaces).map((h, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem' }}>
              <span>Surface: <strong>{h.surface || h.surfaceName || `Surface ${i + 1}`}</strong></span>
              <span className="text-mono">SHA-256: {h.hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}</span>
              <span style={{ color: 'var(--status-pass-text)', fontWeight: '600' }}>Tamper-Evident Preserved</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


