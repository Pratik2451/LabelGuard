import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowRight, ArrowLeft, Eye, Crosshair, AlertOctagon, CheckCircle2,
  AlertTriangle, Tag, Scale, Building2, Calendar, Phone, Globe, Edit3, HelpCircle,
  Check, X, Loader2, RefreshCw, Ruler
} from 'lucide-react';
import axios from 'axios';
import StatusBadge from '../../common/StatusBadge';
import { getImageUrl } from '../../../utils/imageUrl';

export default function Step4EvidenceMap({
  inspection,
  token,
  onInspectionUpdated,
  onNext,
  onBack
}) {
  const [selectedFieldKey, setSelectedFieldKey] = useState('productName');
  const [selectedSurfaceIndex, setSelectedSurfaceIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Editing State for OCR Correction
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [editReason, setEditReason] = useState('');
  const [savingCorrection, setSavingCorrection] = useState(false);
  const [correctionError, setCorrectionError] = useState('');

  // Calibration State for Rule 9 Font Size
  const [showCalibrationModal, setShowCalibrationModal] = useState(false);
  const [refLengthMm, setRefLengthMm] = useState('25.0'); // Standard 25mm reference coin/marker
  const [pixelSpan, setPixelSpan] = useState('');
  const [savingCalibration, setSavingCalibration] = useState(false);

  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  const structuredData = inspection?.structuredData || {};
  const originalImages = inspection?.originalImages || [];
  const surfaces = inspection?.surfaces || [];
  const crossViewConflicts = inspection?.crossViewConflicts || [];
  const corrections = inspection?.officerCorrections || [];
  const calibration = inspection?.calibrationMetadata || {};

  // Construct declaration items list
  const declarationFields = [
    {
      key: 'productName',
      name: 'Product / Generic Commodity Name',
      ruleRef: 'Rule 6(1)(c)',
      data: structuredData.productName,
      icon: Tag
    },
    {
      key: 'mrp',
      name: 'Maximum Retail Price (MRP)',
      ruleRef: 'Rule 6(1)(e)',
      data: structuredData.mrp,
      icon: Tag,
      isPrice: true
    },
    {
      key: 'netQuantity',
      name: 'Net Quantity',
      ruleRef: 'Rule 6(1)(d)',
      data: structuredData.netQuantity,
      icon: Scale
    },
    {
      key: 'manufacturer',
      name: 'Manufacturer / Packer Details',
      ruleRef: 'Rule 6(1)(a)',
      data: Array.isArray(structuredData.manufacturer) ? structuredData.manufacturer[0] : structuredData.manufacturer,
      icon: Building2
    },
    {
      key: 'countryOfOrigin',
      name: 'Country of Origin',
      ruleRef: 'Rule 6(1)(b)',
      data: structuredData.countryOfOrigin,
      icon: Globe
    },
    {
      key: 'manufacturingDate',
      name: 'Date of Manufacture / Packing',
      ruleRef: 'Rule 6(1)(f)',
      data: structuredData.manufacturingDate,
      icon: Calendar
    },
    {
      key: 'consumerCare',
      name: 'Consumer Care Helpline Details',
      ruleRef: 'Rule 6(1)(h)',
      data: structuredData.consumerCare?.phone || structuredData.consumerCare?.email || structuredData.consumerCare,
      icon: Phone
    }
  ];

  const currentField = declarationFields.find(f => f.key === selectedFieldKey);
  const activeBbox = currentField?.data?.bbox || null;

  // Active image path (served from backend static /public)
  // Active image path (served from backend static /public or remote Render URL)
  const currentImageRecord = surfaces[selectedSurfaceIndex] || {};
  let currentImagePath = currentImageRecord.imagePath || originalImages[selectedSurfaceIndex] || '';
  if (currentImagePath.startsWith('public\\') || currentImagePath.startsWith('public/')) {
    currentImagePath = '/' + currentImagePath.replace(/\\/g, '/');
  } else if (!currentImagePath.startsWith('/')) {
    currentImagePath = '/' + currentImagePath.replace(/\\/g, '/');
  }
  const rawImagePath = currentImageRecord.imagePath || originalImages[selectedSurfaceIndex] || '';
  const currentImagePath = getImageUrl(rawImagePath);

  // Draw bounding box overlay on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !imageLoaded) return;

    const ctx = canvas.getContext('2d');
    canvas.width = img.clientWidth;
    canvas.height = img.clientHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Strict validation: activeBbox must be a 4-point polygon where each point is [x, y]
    const isBboxValid =
      Array.isArray(activeBbox) &&
      activeBbox.length === 4 &&
      activeBbox.every(
        (pt) => Array.isArray(pt) && pt.length >= 2 && typeof pt[0] === 'number' && typeof pt[1] === 'number'
      );

    if (!isBboxValid) return; // No bbox or malformed — clear canvas and exit cleanly

    const naturalW = img.naturalWidth > 0 ? img.naturalWidth : img.clientWidth;
    const naturalH = img.naturalHeight > 0 ? img.naturalHeight : img.clientHeight;
    const scaleX = canvas.width / naturalW;
    const scaleY = canvas.height / naturalH;

    const pts = activeBbox.map(([x, y]) => [x * scaleX, y * scaleY]);

    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    ctx.lineTo(pts[1][0], pts[1][1]);
    ctx.lineTo(pts[2][0], pts[2][1]);
    ctx.lineTo(pts[3][0], pts[3][1]);
    ctx.closePath();

    // Highlight Fill & Border
    ctx.fillStyle = 'rgba(37, 99, 235, 0.25)';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#1d4ed8';
    ctx.stroke();

    // Draw label pill
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(pts[0][0], Math.max(0, pts[0][1] - 22), 140, 20);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillText(currentField?.ruleRef || 'Declaration Evidence', pts[0][0] + 6, Math.max(14, pts[0][1] - 8));
  }, [selectedFieldKey, selectedSurfaceIndex, imageLoaded, activeBbox, currentField]);

  // Handle Opening Edit Modal
  const handleStartEdit = (field) => {
    const val = field.data?.value !== undefined ? field.data.value : field.data;
    setEditingField(field);
    setEditValue(val ? String(val) : '');
    setEditReason('');
    setCorrectionError('');
  };

  // Submit OCR Correction to Backend & Re-evaluate Compliance
  const handleSaveCorrection = async () => {
    if (!editingField) return;
    setSavingCorrection(true);
    setCorrectionError('');

    try {
      const res = await axios.patch(
        `/api/v1/products/${inspection._id}/correct`,
        {
          field: editingField.key,
          correctedValue: editValue.trim(),
          reason: editReason.trim() || 'Officer verified correction'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (onInspectionUpdated) {
        onInspectionUpdated(res.data.data);
      }
      setEditingField(null);
    } catch (err) {
      console.error('Failed to submit OCR correction:', err);
      setCorrectionError(err?.response?.data?.message || err.message || 'Correction failed');
    } finally {
      setSavingCorrection(false);
    }
  };

  // Submit Calibration Data to Backend
  const handleSaveCalibration = async () => {
    const refMm = parseFloat(refLengthMm);
    const px = parseFloat(pixelSpan);
    if (!refMm || !px || refMm <= 0 || px <= 0) {
      alert('Please enter valid positive numbers for reference length and pixel distance.');
      return;
    }

    setSavingCalibration(true);
    try {
      const res = await axios.post(
        `/api/v1/products/${inspection._id}/calibrate`,
        {
          referenceLengthMm: refMm,
          pixelDistance: px
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (onInspectionUpdated) {
        onInspectionUpdated(res.data.data);
      }
      setShowCalibrationModal(false);
    } catch (err) {
      console.error('Failed to apply scale calibration:', err);
      alert(err?.response?.data?.message || err.message || 'Scale calibration failed');
    } finally {
      setSavingCalibration(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
            Step 3: Declaration Evidence & Officer Localization
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Click an extracted declaration to locate its bounding box on the package. You may edit misread OCR values to re-evaluate compliance.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => setShowCalibrationModal(true)}
            className="btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <Ruler size={15} />
            <span>{calibration.hasCalibration ? 'Scale Calibrated' : 'Calibrate Text Scale'}</span>
          </button>

          <button onClick={onNext} className="btn-primary" style={{ padding: '8px 20px' }}>
            <span>Proceed to Verification</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* CROSS-VIEW CONSISTENCY CONFLICT BANNER IF DETECTED */}
      {crossViewConflicts.length > 0 && (
        <div style={{
          backgroundColor: 'var(--status-fail-bg)',
          border: '1px solid var(--status-fail-border)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '14px'
        }}>
          <AlertOctagon size={22} color="var(--status-fail-text)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge-status badge-conflict" style={{ fontSize: '0.7rem' }}>POTENTIAL CONFLICT DETECTED</span>
              <h4 style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--status-fail-text)' }}>
                Cross-Surface Declaration Inconsistency
              </h4>
            </div>
            {crossViewConflicts.map((c, i) => (
              <p key={i} style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {c.description} (Declared as <strong>{c.value1}</strong> on {c.surface1} vs. <strong>{c.value2}</strong> on {c.surface2}).
              </p>
            ))}
          </div>
        </div>
      )}

      {/* 2-Column Layout: Left Surface Canvas, Right Declarations List */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', marginBottom: '32px' }}>
        
        {/* Left: Package Image with Canvas Overlay */}
        <div className="card-institutional" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
          {/* Surface Switcher Tabs */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              {surfaces.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => { setSelectedSurfaceIndex(idx); setImageLoaded(false); }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.78rem',
                    fontWeight: selectedSurfaceIndex === idx ? '700' : '500',
                    cursor: 'pointer',
                    border: selectedSurfaceIndex === idx ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                    backgroundColor: selectedSurfaceIndex === idx ? 'var(--primary-subtle)' : '#ffffff',
                    color: selectedSurfaceIndex === idx ? 'var(--primary)' : 'var(--text-secondary)'
                  }}
                >
                  {s.surfaceName || `Surface ${idx + 1}`}
                </button>
              ))}
            </div>

            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              SHA-256 Verified
            </span>
          </div>

          {/* Interactive Image Frame */}
          <div style={{
            position: 'relative',
            flex: 1,
            minHeight: '380px',
            backgroundColor: '#0f172a',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {currentImagePath ? (
              <>
                <img
                  ref={imgRef}
                  src={currentImagePath}
                  alt="Packaging Surface"
                  onLoad={() => setImageLoaded(true)}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                />
                <canvas
                  ref={canvasRef}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none'
                  }}
                />
              </>
            ) : (
              <div style={{ color: '#ffffff', fontSize: '0.85rem' }}>No image available</div>
            )}
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Active Selection: <strong>{currentField?.name}</strong></span>
            <span>{activeBbox ? 'Bounding Box Highlighted' : 'No Coordinates Available'}</span>
          </div>
        </div>

        {/* Right: Extracted Declarations Interactive Ledger */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Detected Declarations (Click to Localize)
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {corrections.length > 0 && `${corrections.length} officer correction(s)`}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '480px', overflowY: 'auto' }}>
            {declarationFields.map((field) => {
              const Icon = field.icon;
              const isSelected = selectedFieldKey === field.key;
              const val = field.data?.value !== undefined ? field.data.value : field.data;
              const isPresent = val !== null && val !== undefined && String(val).trim() !== '';
              const conf = field.data?.confidence ? Math.round(field.data.confidence * 100) : null;
              const isCorrected = field.data?.isOfficerCorrected || corrections.some(c => c.field === field.key);

              return (
                <div
                  key={field.key}
                  onClick={() => {
                    setSelectedFieldKey(field.key);
                    if (field.data?.imageIndex !== undefined && field.data.imageIndex < surfaces.length) {
                      setSelectedSurfaceIndex(field.data.imageIndex);
                    }
                  }}
                  className="card-institutional card-institutional-hover"
                  style={{
                    padding: '14px 16px',
                    cursor: 'pointer',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                    backgroundColor: isSelected ? 'var(--primary-subtle)' : '#ffffff',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Icon size={16} color="var(--primary)" />
                      <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
                        {field.ruleRef} • {field.name}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {isCorrected && (
                        <span className="badge-status badge-pass" style={{ fontSize: '0.65rem' }}>
                          Officer Verified
                        </span>
                      )}
                      {conf && !isCorrected && (
                        <span style={{ fontSize: '0.7rem', color: conf > 75 ? 'var(--status-pass-text)' : 'var(--status-review-text)', fontWeight: '600' }}>
                          {conf}% OCR Conf
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartEdit(field);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--primary)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}
                        title="Correct OCR extraction"
                      >
                        <Edit3 size={13} />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.92rem', fontWeight: isPresent ? '700' : '400', color: isPresent ? 'var(--text-primary)' : 'var(--status-fail-text)' }}>
                    {isPresent ? (
                      <span>{field.isPrice ? `₹ ${val} (incl. taxes)` : String(val)}</span>
                    ) : (
                      <span style={{ fontStyle: 'italic' }}>Not detected on inspected surfaces</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Readability & Scale Calibration Protocol Note */}
          <div style={{
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px'
          }}>
            <HelpCircle size={16} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Rule 9 Font Size Verification:</strong>{' '}
              {calibration.hasCalibration ? (
                <span style={{ color: 'var(--status-pass-text)', fontWeight: '600' }}>
                  Calibrated at {calibration.pixelsPerMm?.toFixed(1)} px/mm (Ref: {calibration.referenceLengthMm} mm). Rule 9 evaluation active.
                </span>
              ) : (
                <span>
                  Physical millimeter font height cannot be evaluated without calibration. Use the "Calibrate Text Scale" button with a reference marker.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
        <button onClick={onBack} className="btn-secondary">
          <ArrowLeft size={16} /> Back
        </button>

        <button onClick={onNext} className="btn-primary" style={{ padding: '10px 24px' }}>
          <span>Proceed to Officer Verification</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* EDIT DECLARATION MODAL */}
      {editingField && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            width: '100%',
            maxWidth: '500px',
            boxShadow: 'var(--shadow-lg)',
            padding: '28px',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                Correct Observed Declaration
              </h3>
              <button onClick={() => setEditingField(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '18px', lineHeight: 1.5 }}>
              Modifying <strong>{editingField.name}</strong> ({editingField.ruleRef}). Original machine extraction will remain preserved in the audit log, and compliance rules will re-evaluate automatically.
            </p>

            {correctionError && (
              <div style={{ backgroundColor: 'var(--status-fail-bg)', color: 'var(--status-fail-text)', padding: '10px', borderRadius: 'var(--radius-sm)', marginBottom: '14px', fontSize: '0.82rem' }}>
                {correctionError}
              </div>
            )}

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Corrected Value *
              </label>
              <input
                type="text"
                className="input-institutional"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder="Enter corrected value as seen on physical package..."
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Reason for Officer Correction *
              </label>
              <input
                type="text"
                className="input-institutional"
                value={editReason}
                onChange={(e) => setEditReason(e.target.value)}
                placeholder="e.g. OCR misread decimal point / character substitution"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setEditingField(null)} className="btn-secondary">
                Cancel
              </button>
              <button
                onClick={handleSaveCorrection}
                className="btn-primary"
                disabled={savingCorrection || !editValue.trim()}
              >
                {savingCorrection ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                <span>Save & Re-evaluate Compliance</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CALIBRATION MODAL */}
      {showCalibrationModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            width: '100%',
            maxWidth: '480px',
            boxShadow: 'var(--shadow-lg)',
            padding: '28px',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Ruler size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                  Optical Scale Calibration (Rule 9)
                </h3>
              </div>
              <button onClick={() => setShowCalibrationModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '18px', lineHeight: 1.5 }}>
              To determine physical millimeter font heights without guesswork, calibrate using a standard known-size marker on the package (e.g., standard ₹5 coin: 23 mm, or calibration card).
            </p>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Reference Object Dimension (Millimeters) *
              </label>
              <input
                type="number"
                step="0.1"
                className="input-institutional"
                value={refLengthMm}
                onChange={(e) => setRefLengthMm(e.target.value)}
                placeholder="e.g. 25.0"
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Measured Pixel Span of Reference Object *
              </label>
              <input
                type="number"
                className="input-institutional"
                value={pixelSpan}
                onChange={(e) => setPixelSpan(e.target.value)}
                placeholder="e.g. 150 (pixels)"
                required
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                Yields {(parseFloat(pixelSpan) / (parseFloat(refLengthMm) || 1)).toFixed(1) || 0} pixels per millimeter.
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setShowCalibrationModal(false)} className="btn-secondary">
                Cancel
              </button>
              <button
                onClick={handleSaveCalibration}
                className="btn-primary"
                disabled={savingCalibration || !refLengthMm || !pixelSpan}
              >
                {savingCalibration ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                <span>Apply Scale Calibration</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
