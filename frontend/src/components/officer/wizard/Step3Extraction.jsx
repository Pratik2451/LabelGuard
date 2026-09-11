import React, { useEffect, useRef, useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import axios from 'axios';

export default function Step3Extraction({
  token,
  slots,
  contextData,
  idempotencyKey,
  onInspectionCreated,
  onBack
}) {
  const [loading, setLoading] = useState(true);
  const [stage, setStage] = useState(1);
  const [error, setError] = useState('');

  // ---------------------------------------------------------------
  // DOUBLE-FIRE GUARD
  // React 19 StrictMode mounts → unmounts → remounts components in
  // development, causing useEffect(() => {}, []) to fire TWICE.
  // This ref tracks whether the first real call has started.
  // On the second (StrictMode) invocation the guard short-circuits.
  //
  // IMPORTANT: We do NOT disable StrictMode. Instead we fix the
  // lifecycle so it is safe to call twice — the backend idempotency
  // key is the second layer of protection even in production.
  // ---------------------------------------------------------------
  const hasStartedRef = useRef(false);

  useEffect(() => {
    // If this is the StrictMode second-mount, skip silently.
    // The first mount's request is already in flight.
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    runExtraction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runExtraction = async () => {
    setLoading(true);
    setError('');
    setStage(1);

    // Filter valid files and matching surface names
    const fileEntries = Object.entries(slots).filter(([_, s]) => !!s.file);
    if (fileEntries.length === 0) {
      setError('No package surface images available for extraction.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    const surfaceNames = [];

    fileEntries.forEach(([key, s]) => {
      formData.append('images', s.file);
      surfaceNames.push(key.charAt(0).toUpperCase() + key.slice(1));
    });

    formData.append('surfaces', JSON.stringify(surfaceNames));
    formData.append('context', JSON.stringify(contextData));

    // Simulated progress transitions while waiting for Python PaddleOCR
    const timer1 = setTimeout(() => setStage(2), 1400);
    const timer2 = setTimeout(() => setStage(3), 3200);

    try {
      const res = await axios.post('/api/v1/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
          // Idempotency key — the backend returns the existing record if this
          // key has already been processed, preventing duplicate DB documents.
          ...(idempotencyKey && { 'x-idempotency-key': idempotencyKey })
        }
      });

      clearTimeout(timer1);
      clearTimeout(timer2);

      const inspection = res.data?.data;
      if (!inspection) {
        throw new Error('Invalid inspection payload returned from backend.');
      }

      // Transition out of loading state before calling onInspectionCreated
      // so any re-render that follows doesn't see a "loading" Step3
      setLoading(false);
      onInspectionCreated(inspection);
    } catch (err) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      console.error('OCR processing error:', err);
      const msg = err?.response?.data?.message || err.message || 'Failed to extract text from packaging images via Python OCR.';
      setError(msg);
      setLoading(false);
    }
  };

  // When user manually clicks Retry: reset the mount guard so runExtraction
  // can fire again. We allow this because a manual retry is an explicit
  // user action — not a framework double-mount.
  const handleRetry = () => {
    hasStartedRef.current = true; // already set, just call runExtraction directly
    runExtraction();
  };

  return (
    <div style={{ maxWidth: '680px', margin: '40px auto', textAlign: 'center' }}>
      <div className="card-institutional" style={{ padding: '40px 32px' }}>
        {loading ? (
          <div>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-subtle)',
              border: '1px solid var(--primary-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              color: 'var(--primary)'
            }}>
              <Loader2 size={32} className="animate-spin" />
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
              Processing Package Imagery
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '28px' }}>
              Communicating with authoritative Python PaddleOCR pipeline and LMPC rule engine.
            </p>

            {/* Stages Ledger */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
              <div style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '0.86rem'
              }}>
                <CheckCircle2 size={18} color="var(--status-pass-text)" />
                <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
                  1. Preprocessing images &amp; computing SHA-256 evidence digests
                </span>
              </div>

              <div style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: stage >= 2 ? 'var(--bg-subtle)' : '#ffffff',
                border: stage >= 2 ? '1px solid var(--primary-border)' : '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '0.86rem'
              }}>
                {stage >= 2 ? (
                  <CheckCircle2 size={18} color="var(--status-pass-text)" />
                ) : (
                  <Loader2 size={18} className="animate-spin" color="var(--primary)" />
                )}
                <span style={{ color: stage >= 2 ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: stage >= 2 ? '600' : '500' }}>
                  2. Running PaddleOCR deep text detection &amp; bounding box localization
                </span>
              </div>

              <div style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: stage >= 3 ? 'var(--bg-subtle)' : '#ffffff',
                border: stage >= 3 ? '1px solid var(--primary-border)' : '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '0.86rem'
              }}>
                {stage >= 3 ? (
                  <CheckCircle2 size={18} color="var(--status-pass-text)" />
                ) : (
                  <Loader2 size={18} className="animate-spin" color="var(--primary)" />
                )}
                <span style={{ color: stage >= 3 ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: stage >= 3 ? '600' : '500' }}>
                  3. Parsing Legal Metrology declarations &amp; cross-view consistency
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <AlertCircle size={40} color="var(--status-fail-text)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
              Extraction Interrupted
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--status-fail-text)', marginBottom: '24px', lineHeight: 1.5 }}>
              {error}
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button onClick={onBack} className="btn-secondary">
                <ArrowLeft size={16} /> Back to Capture
              </button>
              <button onClick={handleRetry} className="btn-primary">
                <RefreshCw size={16} /> Retry OCR Processing
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
