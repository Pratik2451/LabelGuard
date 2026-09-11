import React, { useState } from 'react';
import {
  CheckCircle2, AlertTriangle, XCircle, FileText,
  Building2, Tag, Scale, Calendar, Phone, Mail,
  Globe, Eye, ChevronDown, ChevronUp, Copy, Check, Download, Loader2
} from 'lucide-react';
import axios from 'axios';

export default function InspectionView({ inspection, token, onNewScan }) {
  const [copied, setCopied] = useState(false);
  const [showRawOcr, setShowRawOcr] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!inspection) return null;

  const { _id, inspectionId, createdAt, structuredData = {}, originalImages = [], rawOcrText = [] } = inspection;

  const handleCopyId = () => {
    navigator.clipboard.writeText(inspectionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReport = async () => {
    if (!_id) return;
    setDownloading(true);
    try {
      const res = await axios.get(`/api/v1/products/${_id}/report`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
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
      console.error('Failed to download report:', err);
    } finally {
      setDownloading(false);
    }
  };

  // Helper to render field value cleanly
  const renderField = (fieldData) => {
    if (!fieldData) return null;
    if (typeof fieldData === 'string' || typeof fieldData === 'number') return fieldData;
    if (fieldData.value !== undefined) {
      return (
        <span>
          {fieldData.value} {fieldData.unit ? fieldData.unit : ''}
        </span>
      );
    }
    return JSON.stringify(fieldData);
  };

  const getConfidenceBadge = (fieldData) => {
    if (!fieldData || !fieldData.confidence) return null;
    const confPct = Math.round(fieldData.confidence * 100);
    const badgeClass = confPct >= 85 ? 'badge-success' : confPct >= 60 ? 'badge-warning' : 'badge-danger';
    return (
      <span className={`badge ${badgeClass}`} style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
        {confPct}% confidence
      </span>
    );
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '32px auto', padding: '0 16px' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px 32px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Inspection Report</h2>
            <span className="badge badge-success">COMPLETED</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              ID: <strong style={{ color: '#fff' }}>{inspectionId}</strong>
              <button
                onClick={handleCopyId}
                style={{ background: 'none', border: 'none', color: 'var(--primary-cyan)', cursor: 'pointer', padding: '2px' }}
                title="Copy Inspection ID"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </span>
            <span>•</span>
            <span>Date: {new Date(createdAt).toLocaleString()}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={handleDownloadReport} className="btn-primary" disabled={downloading}>
            {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            Download Formal PDF Report
          </button>
          <button onClick={onNewScan} className="glass-button">
            + Start New Scan
          </button>
        </div>
      </div>

      {/* Main Grid: Structured Declarations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>

        {/* 1. Product Name */}
        <div className="glass-panel glass-panel-hover" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-indigo)' }}>
              <Tag size={20} />
              <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff' }}>Product Name</h4>
            </div>
            {getConfidenceBadge(structuredData.productName)}
          </div>
          {structuredData.productName ? (
            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary-cyan)' }}>
              {renderField(structuredData.productName)}
            </div>
          ) : (
            <div style={{ color: 'var(--accent-rose)', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <XCircle size={16} /> Not Detected / Missing
            </div>
          )}
        </div>

        {/* 2. MRP */}
        <div className="glass-panel glass-panel-hover" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-emerald)' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: '800' }}>₹</span>
              <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff' }}>MRP (Max Retail Price)</h4>
            </div>
            {getConfidenceBadge(structuredData.mrp)}
          </div>
          {structuredData.mrp ? (
            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--accent-emerald)' }}>
              ₹ {renderField(structuredData.mrp)} <span style={{ fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-muted)' }}>(Incl. of all taxes)</span>
            </div>
          ) : (
            <div style={{ color: 'var(--accent-rose)', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <XCircle size={16} /> MRP Declaration Missing
            </div>
          )}
        </div>

        {/* 3. Net Quantity */}
        <div className="glass-panel glass-panel-hover" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-amber)' }}>
              <Scale size={20} />
              <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff' }}>Net Quantity</h4>
            </div>
            {getConfidenceBadge(structuredData.netQuantity)}
          </div>
          {structuredData.netQuantity ? (
            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--accent-amber)' }}>
              {renderField(structuredData.netQuantity)}
            </div>
          ) : (
            <div style={{ color: 'var(--accent-rose)', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <XCircle size={16} /> Net Quantity Missing
            </div>
          )}
        </div>

        {/* 4. Manufacturing Date */}
        <div className="glass-panel glass-panel-hover" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-purple)' }}>
              <Calendar size={20} />
              <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff' }}>Mfg / Packing Date</h4>
            </div>
            {getConfidenceBadge(structuredData.manufacturingDate)}
          </div>
          {structuredData.manufacturingDate ? (
            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff' }}>
              {renderField(structuredData.manufacturingDate)}
            </div>
          ) : (
            <div style={{ color: 'var(--text-subtle)', fontSize: '0.88rem' }}>
              Not Specified
            </div>
          )}
        </div>

        {/* 5. Consumer Care Details */}
        <div className="glass-panel glass-panel-hover" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-cyan)' }}>
              <Phone size={20} />
              <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff' }}>Consumer Care</h4>
            </div>
          </div>
          {structuredData.consumerCare ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9rem' }}>
              {structuredData.consumerCare.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={14} color="var(--primary-cyan)" /> {renderField(structuredData.consumerCare.phone)}
                </div>
              )}
              {structuredData.consumerCare.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={14} color="var(--primary-cyan)" /> {renderField(structuredData.consumerCare.email)}
                </div>
              )}
            </div>
          ) : (
            <div style={{ color: 'var(--accent-rose)', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <XCircle size={16} /> Consumer Care Details Missing
            </div>
          )}
        </div>

        {/* 6. Country of Origin */}
        <div className="glass-panel glass-panel-hover" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-indigo)' }}>
              <Globe size={20} />
              <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff' }}>Country of Origin</h4>
            </div>
            {getConfidenceBadge(structuredData.countryOfOrigin)}
          </div>
          {structuredData.countryOfOrigin ? (
            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff' }}>
              {renderField(structuredData.countryOfOrigin)}
            </div>
          ) : (
            <div style={{ color: 'var(--text-subtle)', fontSize: '0.88rem' }}>
              Default (India / Domestic)
            </div>
          )}
        </div>
      </div>

      {/* Manufacturer Information Card */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: 'var(--primary-cyan)' }}>
          <Building2 size={22} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#fff' }}>Manufacturer / Packer Details</h3>
        </div>

        {structuredData.manufacturer && structuredData.manufacturer.length > 0 ? (
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {structuredData.manufacturer.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem', color: '#e2e8f0', borderBottom: idx !== structuredData.manufacturer.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', paddingBottom: '6px' }}>
                  <span>{item.value}</span>
                  {getConfidenceBadge(item)}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ color: 'var(--accent-rose)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <XCircle size={18} /> Manufacturer Name & Address Not Detected
          </div>
        )}
      </div>

      {/* Raw OCR Text Collapsible Drawer */}
      <div className="glass-panel" style={{ padding: '20px 24px', marginBottom: '32px' }}>
        <button
          onClick={() => setShowRawOcr(!showRawOcr)}
          style={{
            width: '100%',
            background: 'none',
            border: 'none',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '1rem',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} color="var(--primary-cyan)" />
            <span>Raw Detected OCR Bounding Boxes ({rawOcrText.length} text lines)</span>
          </div>
          {showRawOcr ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {showRawOcr && (
          <div style={{ marginTop: '16px', maxHeight: '300px', overflowY: 'auto', background: '#07090e', padding: '16px', borderRadius: '8px', fontSize: '0.82rem', fontFamily: 'monospace' }}>
            {rawOcrText.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ color: '#64748b', marginRight: '12px' }}>[{idx + 1}]</span>
                <span style={{ color: '#e2e8f0', flex: 1 }}>{item.text}</span>
                <span style={{ color: 'var(--primary-cyan)', marginLeft: '12px' }}>{(item.confidence * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
