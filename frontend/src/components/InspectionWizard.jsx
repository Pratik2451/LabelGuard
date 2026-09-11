import React, { useState, useRef } from 'react';
import Step1Context from './officer/wizard/Step1Context';
import Step2Capture from './officer/wizard/Step2Capture';
import Step3Extraction from './officer/wizard/Step3Extraction';
import Step4EvidenceMap from './officer/wizard/Step4EvidenceMap';
import Step5Verification from './officer/wizard/Step5Verification';
import Step6Report from './officer/wizard/Step6Report';
import ErrorBoundary from './common/ErrorBoundary';
import { Check } from 'lucide-react';

/**
 * Generates a UUID-like idempotency key.
 * Uses crypto.randomUUID() if available (modern browsers),
 * otherwise falls back to a timestamp + random hex string.
 */
function generateIdempotencyKey() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback: timestamp + random hex
  return `${Date.now()}-${Math.random().toString(16).slice(2)}-${Math.random().toString(16).slice(2)}`;
}

export default function InspectionWizard({ token, user, onFinish, onSelectInspection }) {
  // Step tracker: 1 = Context, 2 = Capture, 3 = Extraction, 4 = Evidence Map, 5 = Verification, 6 = Report
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1 State: Inspection Context
  const [contextData, setContextData] = useState({
    category: 'Packaged Food & Snacks',
    inspectionType: 'Retail Market Surveillance',
    originType: 'Domestic',
    location: '',
    notes: ''
  });

  // Step 2 State: Multi-Surface Images
  const [slots, setSlots] = useState({
    front: { file: null, preview: null, source: null, hash: null, qualityStatus: null },
    back: { file: null, preview: null, source: null, hash: null, qualityStatus: null },
    side: { file: null, preview: null, source: null, hash: null, qualityStatus: null },
    top: { file: null, preview: null, source: null, hash: null, qualityStatus: null }
  });

  // Inspection Result State from Backend
  const [inspection, setInspection] = useState(null);

  // ---------------------------------------------------------------
  // IDEMPOTENCY KEY — generated ONCE per wizard session via useRef.
  // useRef ensures the value is stable across re-renders AND across
  // the double-invocation that React 19 StrictMode performs in dev.
  // This key is passed to Step3Extraction and sent as the
  // x-idempotency-key header in the POST /api/v1/products request.
  // The backend uses it to detect and reject duplicate submissions.
  // ---------------------------------------------------------------
  const idempotencyKeyRef = useRef(generateIdempotencyKey());

  const wizardSteps = [
    { num: 1, label: 'Context' },
    { num: 2, label: 'Capture' },
    { num: 3, label: 'OCR Extraction' },
    { num: 4, label: 'Evidence Map' },
    { num: 5, label: 'Verification' },
    { num: 6, label: 'Report & Hash' }
  ];

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* 6-Step Stepper Header */}
      <div className="card-institutional" style={{ padding: '16px 24px', marginBottom: '28px', backgroundColor: '#ffffff' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px', alignItems: 'center' }}>
          {wizardSteps.map((s) => {
            const isActive = currentStep === s.num;
            const isDone = currentStep > s.num;

            return (
              <div key={s.num} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: isDone ? 'var(--status-pass-bg)' : isActive ? 'var(--primary)' : 'var(--bg-subtle)',
                    border: isDone ? '1px solid var(--status-pass-border)' : isActive ? '1px solid var(--primary)' : '1px solid var(--border-medium)',
                    color: isDone ? 'var(--status-pass-text)' : isActive ? '#ffffff' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: '700'
                  }}>
                    {isDone ? <Check size={14} /> : s.num}
                  </div>
                  <span style={{
                    fontSize: '0.82rem',
                    fontWeight: isActive ? '700' : '500',
                    color: isActive ? 'var(--primary)' : isDone ? 'var(--text-primary)' : 'var(--text-muted)'
                  }}>
                    {s.label}
                  </span>
                </div>
                <div style={{
                  height: '3px',
                  borderRadius: '2px',
                  backgroundColor: isDone ? 'var(--status-pass-text)' : isActive ? 'var(--primary)' : 'var(--border-subtle)'
                }} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Renderings — wrapped in ErrorBoundary to prevent blank screen on unexpected errors */}
      <ErrorBoundary onReset={() => setCurrentStep(1)}>
        {currentStep === 1 && (
          <Step1Context
            contextData={contextData}
            setContextData={setContextData}
            onNext={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 2 && (
          <Step2Capture
            slots={slots}
            setSlots={setSlots}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && (
          <Step3Extraction
            token={token}
            slots={slots}
            contextData={contextData}
            idempotencyKey={idempotencyKeyRef.current}
            onInspectionCreated={(createdInspection) => {
              setInspection(createdInspection);
              setCurrentStep(4);
            }}
            onBack={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 4 && inspection && (
          <Step4EvidenceMap
            inspection={inspection}
            token={token}
            onInspectionUpdated={(updated) => setInspection(updated)}
            onNext={() => setCurrentStep(5)}
            onBack={() => setCurrentStep(2)}
          />
        )}


        {currentStep === 5 && inspection && (
          <Step5Verification
            token={token}
            inspection={inspection}
            onVerificationSaved={(updatedInspection) => {
              setInspection(updatedInspection);
              setCurrentStep(6);
            }}
            onBack={() => setCurrentStep(4)}
          />
        )}

        {currentStep === 6 && inspection && (
          <Step6Report
            token={token}
            inspection={inspection}
            onFinish={() => {
              if (onSelectInspection) {
                onSelectInspection(inspection);
              } else if (onFinish) {
                onFinish();
              }
            }}
          />
        )}
      </ErrorBoundary>
    </div>
  );
}
