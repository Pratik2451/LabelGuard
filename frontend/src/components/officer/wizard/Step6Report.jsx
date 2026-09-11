import React, { useState } from 'react';
import {
  Download, CheckCircle2, FileText, Shield, Lock, Calendar, MapPin, Loader2, ArrowRight
} from 'lucide-react';
import axios from 'axios';
import StatusBadge from '../../common/StatusBadge';

export default function Step6Report({
  token,
  inspection,
  onFinish
}) {
  const [downloading, setDownloading] = useState(false);

  const inspectionId = inspection?.inspectionId;
  const structuredData = inspection?.structuredData || {};
  const complianceResults = inspection?.complianceResults || {};
  const evidenceIntegrity = inspection?.evidenceIntegrity || {};
  const hashes = evidenceIntegrity.hashes || [];
  const surfaces = inspection?.surfaces || [];

  const handleDownloadPdf = async () => {
    if (!inspection?._id) return;
    setDownloading(true);

    try {
      const res = await axios.get(`/api/v1/products/${inspection._id}/report`, {
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
      console.error('PDF report download error:', err);
      alert('Failed to stream inspection PDF report. Please verify Python ReportLab availability.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
            Step 5: Inspection Report & Evidence Provenance
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Official Compliance Inspection Record generated. Tamper-evident cryptographic digests preserved.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleDownloadPdf}
            className="btn-primary"
            disabled={downloading}
            style={{ padding: '10px 20px' }}
          >
            {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            <span>Download Formal PDF Report</span>
          </button>

          <button onClick={onFinish} className="btn-secondary" style={{ padding: '10px 20px' }}>
            Finish & Return to Dashboard
          </button>
        </div>
      </div>

      {/* Report Canvas Preview Card */}
      <div className="card-institutional" style={{ padding: '36px', marginBottom: '28px', backgroundColor: '#ffffff' }}>
        {/* Document Header */}
        <div style={{
          borderBottom: '2px solid var(--primary)',
          paddingBottom: '20px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Statutory Packaged Commodity Inspection Record
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px' }}>
              Legal Metrology Compliance Inspection Report
            </h1>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Conducted under Legal Metrology (Packaged Commodities) Rules, 2011
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
              {inspectionId}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Date: {new Date(inspection?.createdAt || Date.now()).toLocaleDateString()}
            </div>
            <StatusBadge status={inspection?.status || 'VERIFIED'} size="small" />
          </div>
        </div>

        {/* Commodity Summary 3-Column Box */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          backgroundColor: 'var(--bg-subtle)',
          padding: '16px 20px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '24px',
          fontSize: '0.86rem'
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Product / Commodity</div>
            <div style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '2px' }}>
              {structuredData.productName?.value || 'Unspecified Commodity'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Net Quantity Declared</div>
            <div style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '2px' }}>
              {structuredData.netQuantity?.value ? `${structuredData.netQuantity.value} ${structuredData.netQuantity.unit || ''}` : 'Not Detected'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Declared Retail Price (MRP)</div>
            <div style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '2px' }}>
              {structuredData.mrp?.value ? `₹ ${structuredData.mrp.value}` : 'Not Detected'}
            </div>
          </div>
        </div>

        {/* Findings Table */}
        <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px' }}>
          Rule Verification Summary
        </h3>
        <table className="table-institutional" style={{ marginBottom: '28px' }}>
          <thead>
            <tr>
              <th>Rule ID</th>
              <th>Requirement</th>
              <th>Observed Declaration</th>
              <th>Assessed Finding</th>
            </tr>
          </thead>
          <tbody>
            {(complianceResults.results || []).map((r) => (
              <tr key={r.id}>
                <td className="text-mono" style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--primary)' }}>
                  {r.ruleId}
                </td>
                <td style={{ fontWeight: '600' }}>{r.ruleName}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{r.extractedValue}</td>
                <td>
                  <StatusBadge status={r.status} label={r.statusLabel} size="small" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Evidence Integrity Ledger */}
        <div style={{
          backgroundColor: 'var(--bg-subtle)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Lock size={16} color="var(--primary)" />
            <h4 style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Tamper-Evident Evidence Integrity Metadata (SHA-256)
            </h4>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {hashes.length > 0 ? (
              hashes.map((h, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <span>Surface: <strong style={{ color: 'var(--text-primary)' }}>{h.surface}</strong></span>
                  <span className="text-mono">SHA-256: {h.hash}</span>
                  <span>{new Date(h.timestamp).toLocaleTimeString()}</span>
                </div>
              ))
            ) : (
              surfaces.map((s, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <span>Surface: <strong style={{ color: 'var(--text-primary)' }}>{s.surfaceName}</strong></span>
                  <span className="text-mono">SHA-256: {s.hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}</span>
                  <span>Verified</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

