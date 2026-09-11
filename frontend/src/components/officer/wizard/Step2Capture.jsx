import React, { useState } from 'react';
import {
  UploadCloud, Camera, X, Check, AlertTriangle, AlertCircle, ArrowRight, ArrowLeft, ShieldCheck, RefreshCw, Eye
} from 'lucide-react';
import CameraCapture from '../../common/CameraCapture';
import { computeFileSha256 } from '../../../utils/cryptoUtils';

export default function Step2Capture({
  slots,
  setSlots,
  onNext,
  onBack
}) {
  const [activeCameraSlot, setActiveCameraSlot] = useState(null);
  const [qualityWarnings, setQualityWarnings] = useState({});

  const surfaceDefinitions = [
    { key: 'front', label: 'Front Surface (Principal Display Panel)', role: 'Core Mandatory', required: true },
    { key: 'back', label: 'Back Surface (Information Panel)', role: 'Core Mandatory', required: true },
    { key: 'side', label: 'Side Surface (Auxiliary Declarations)', role: 'Optional', required: false },
    { key: 'top', label: 'Top / Bottom / Flap Surface', role: 'Optional', required: false }
  ];

  const handleFileSelect = async (key, file) => {
    if (!file) return;

    // Quality Gate Checks
    const warnings = [];
    if (file.size < 15 * 1024) {
      warnings.push('Image file size very small (<15 KB); potential low text resolution.');
    }
    if (file.size > 10 * 1024 * 1024) {
      warnings.push('Image file exceeds 10 MB limit.');
      return;
    }

    // Compute client-side SHA-256 for initial integrity tracking
    const hash = await computeFileSha256(file);
    const preview = URL.createObjectURL(file);

    setSlots(prev => ({
      ...prev,
      [key]: {
        file,
        preview,
        source: 'upload',
        hash,
        qualityStatus: warnings.length > 0 ? 'POOR_QUALITY' : 'ACCEPTED'
      }
    }));

    if (warnings.length > 0) {
      setQualityWarnings(prev => ({ ...prev, [key]: warnings.join(' ') }));
    } else {
      setQualityWarnings(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleCameraConfirm = async (capturedFile) => {
    if (!activeCameraSlot || !capturedFile) return;

    const hash = await computeFileSha256(capturedFile);
    const preview = URL.createObjectURL(capturedFile);

    setSlots(prev => ({
      ...prev,
      [activeCameraSlot]: {
        file: capturedFile,
        preview,
        source: 'camera',
        hash,
        qualityStatus: 'ACCEPTED'
      }
    }));

    setActiveCameraSlot(null);
  };

  const handleRemoveSlot = (key) => {
    setSlots(prev => ({
      ...prev,
      [key]: { file: null, preview: null, source: null, hash: null, qualityStatus: null }
    }));
    setQualityWarnings(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  // Surface completeness calculation
  const hasFront = !!slots.front?.file;
  const hasBack = !!slots.back?.file;
  const capturedCount = Object.values(slots).filter(s => !!s.file).length;

  let coveragePct = 0;
  if (hasFront && hasBack) coveragePct = 100;
  else if (hasFront || hasBack) coveragePct = 50;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
            Step 2: Guided Multi-Surface Package Capture
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Capture relevant packaging surfaces. Legal Metrology declarations are distributed across the Principal Display Panel and Information Panels.
          </p>
        </div>

        {/* Coverage Completeness Card */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Surface Coverage</div>
            <div style={{ fontSize: '1.15rem', fontWeight: '800', color: coveragePct === 100 ? 'var(--status-pass-text)' : 'var(--status-review-text)', fontFamily: 'var(--font-mono)' }}>
              {coveragePct}% Core Surfaces
            </div>
          </div>
          <span className={`badge-status ${coveragePct === 100 ? 'badge-pass' : 'badge-review'}`}>
            {coveragePct === 100 ? 'Complete' : 'Partial Coverage'}
          </span>
        </div>
      </div>

      {/* CORE STATUTORY WARNING IF BACK SURFACE NOT CAPTURED */}
      {hasFront && !hasBack && (
        <div style={{
          backgroundColor: 'var(--status-review-bg)',
          border: '1px solid var(--status-review-border)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 18px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px'
        }}>
          <AlertTriangle size={20} color="var(--status-review-text)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--status-review-text)', marginBottom: '2px' }}>
              Inspection Incomplete: Back Surface Not Yet Captured
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Declarations located on the information panel (such as Manufacturer Name, Complete Address, and Consumer Care helpline) cannot yet be assessed. <em>(Not visible is not the same as missing.)</em> You may capture the back surface now, or proceed to evaluate only the front panel.
            </p>
          </div>
        </div>
      )}

      {/* Multi-Surface Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {surfaceDefinitions.map((def) => {
          const slot = slots[def.key] || {};
          const isCaptured = !!slot.file;
          const warning = qualityWarnings[def.key];

          return (
            <div
              key={def.key}
              className="card-institutional"
              style={{
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                height: '340px',
                border: isCaptured ? '1px solid var(--primary-border)' : '1px solid var(--border-subtle)'
              }}
            >
              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {def.label}
                  </h4>
                  <span style={{ fontSize: '0.72rem', color: def.required ? 'var(--primary)' : 'var(--text-muted)' }}>
                    {def.role}
                  </span>
                </div>
                {isCaptured && (
                  <span className="badge-status badge-pass" style={{ fontSize: '0.65rem' }}>
                    {slot.source === 'camera' ? 'Live Camera' : 'Uploaded'}
                  </span>
                )}
              </div>

              {/* View / Upload Area */}
              {isCaptured ? (
                <div style={{
                  position: 'relative',
                  flex: 1,
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  backgroundColor: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img
                    src={slot.preview}
                    alt={def.label}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                  <button
                    onClick={() => handleRemoveSlot(def.key)}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      backgroundColor: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: '#ffffff',
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    title="Remove and retake"
                  >
                    <X size={15} />
                  </button>
                  {slot.hash && (
                    <div style={{
                      position: 'absolute',
                      bottom: '6px',
                      left: '8px',
                      fontSize: '0.65rem',
                      fontFamily: 'var(--font-mono)',
                      color: '#cbd5e1',
                      backgroundColor: 'rgba(0,0,0,0.65)',
                      padding: '2px 6px',
                      borderRadius: '3px'
                    }}>
                      SHA: {slot.hash.substring(0, 10)}...
                    </div>
                  )}
                </div>
              ) : (
                <div style={{
                  flex: 1,
                  border: '2px dashed var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px',
                  textAlign: 'center'
                }}>
                  <UploadCloud size={28} color="var(--text-muted)" style={{ marginBottom: '8px' }} />
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                    JPG, PNG, or WEBP (Max 10MB)
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                    <label className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                      <UploadCloud size={13} /> Select File
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileSelect(def.key, e.target.files[0])}
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => setActiveCameraSlot(def.key)}
                      className="btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.78rem', color: 'var(--primary)' }}
                    >
                      <Camera size={13} /> Open Camera
                    </button>
                  </div>
                </div>
              )}

              {/* Quality Alert */}
              {warning && (
                <div style={{ marginTop: '8px', fontSize: '0.72rem', color: 'var(--status-review-text)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={12} /> {warning}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
        <button onClick={onBack} className="btn-secondary">
          <ArrowLeft size={16} /> Back to Context
        </button>

        <button
          onClick={onNext}
          className="btn-primary"
          disabled={capturedCount === 0}
          style={{ padding: '10px 24px' }}
        >
          <span>Extract Declarations ({capturedCount} Surfaces Ready)</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Live Camera Modal */}
      {activeCameraSlot && (
        <CameraCapture
          surfaceName={surfaceDefinitions.find(s => s.key === activeCameraSlot)?.label || 'Package'}
          onCaptureConfirm={handleCameraConfirm}
          onClose={() => setActiveCameraSlot(null)}
        />
      )}
    </div>
  );
}

