import React from 'react';
import {
  FileText, Camera, Eye, Cpu, Crosshair, CheckSquare, Layers, ShieldAlert, Lock, Download, ArrowRight
} from 'lucide-react';

export default function HowItWorksPage({ onNavigate, onLoginClick }) {
  const steps = [
    {
      step: '01',
      title: 'Inspection Context Definition',
      icon: FileText,
      summary: 'Define statutory context before capture.',
      detail: 'The officer specifies the commodity category (Food, Beverage, Cosmetics, Electronics), inspection type (Retail surveillance, warehouse audit, import clearance), and origin type (Domestic or Imported). Rule applicability dynamically adjusts based on this context.'
    },
    {
      step: '02',
      title: 'Guided Multi-Surface Capture',
      icon: Camera,
      summary: 'Systematic photo capture across packaging surfaces.',
      detail: 'The officer captures or uploads photos for Front (Principal Display Panel), Back (Information Panel), and optional Side/Top/Bottom panels using either a live camera or high-resolution file uploads with alignment reticles.'
    },
    {
      step: '03',
      title: 'Surface Completeness & Quality Gate',
      icon: Eye,
      summary: '"Not visible is not the same as missing."',
      detail: 'LabelGuard computes surface coverage percentage. If the back panel is missing, the system warns "Inspection Incomplete: Back surface not captured. Declarations on uncaptured surfaces cannot yet be assessed," preventing false non-compliance accusations.'
    },
    {
      step: '04',
      title: 'PaddleOCR Declaration Extraction',
      icon: Cpu,
      summary: 'High-accuracy optical text recognition and declaration parsing.',
      detail: 'The image files are processed by the Python PaddleOCR pipeline. Raw text lines, bounding coordinates, and confidence scores are parsed into structured declarations (Product Name, MRP, Net Quantity, Dates, Manufacturer details).'
    },
    {
      step: '05',
      title: 'Declaration Evidence Localization',
      icon: Crosshair,
      summary: 'Interactive bounding box mapping on source packaging.',
      detail: 'Every extracted declaration links directly to its source image and coordinates. When an officer selects a declaration, its exact physical bounding box is highlighted on the packaging canvas.'
    },
    {
      step: '06',
      title: 'Context-Aware Rule Evaluation',
      icon: CheckSquare,
      summary: 'Statutory compliance evaluation against LMPC Rules 2011.',
      detail: 'The rule engine evaluates applicable provisions (Rule 6(1)(a)-(h), Second Schedule SI units, Table 1 font readability guidelines). Results are categorized using assistive terminology (Compliant Candidate, Potential Non-Compliance, Needs Verification).'
    },
    {
      step: '07',
      title: 'Cross-View Consistency Verification',
      icon: Layers,
      summary: 'Multi-angle comparison to detect dual-pricing or quantity discrepancies.',
      detail: 'Extracted values across captured surfaces are compared automatically. If Front displays MRP ₹120 while Back displays MRP ₹150, the system flags a "Potential Conflicting Declaration" alert with both visual evidences side-by-side.'
    },
    {
      step: '08',
      title: 'Human-in-the-Loop Officer Verification',
      icon: ShieldAlert,
      summary: 'Officer retains complete authority to review and decide.',
      detail: 'For every potential issue or low-confidence extraction, the officer can Confirm Finding, Dismiss as False Positive, Request Recapture, or Mark Not Assessable, along with recording field notes.'
    },
    {
      step: '09',
      title: 'Tamper-Evident SHA-256 Evidence Ledger',
      icon: Lock,
      summary: 'Cryptographic provenance for legal integrity.',
      detail: 'Original high-resolution images are hashed using SHA-256 upon capture. The hashes, timestamps, surface metadata, and officer identity are recorded into an immutable audit ledger.'
    },
    {
      step: '10',
      title: 'Formal Report & Historical Archival',
      icon: Download,
      summary: 'Standardized ReportLab PDF export and searchable history.',
      detail: 'A comprehensive, formal inspection certificate is generated and archived in the officer database, complete with surface photographs, compliance tables, officer signature block, and audit timestamps.'
    }
  ];

  return (
    <div style={{ backgroundColor: '#ffffff' }}>
      {/* Banner */}
      <div style={{
        backgroundColor: 'var(--bg-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '54px 24px 48px'
      }}>
        <div className="container-max">
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            System Architecture & Methodology
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '8px', marginBottom: '12px' }}>
            How LabelGuard Works
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '720px', lineHeight: 1.6 }}>
            A rigorous 10-stage assistive inspection methodology designed for statutory Legal Metrology enforcement.
          </p>
        </div>
      </div>

      {/* 10-Step Timeline */}
      <div className="container-max" style={{ padding: '60px 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="card-institutional"
                style={{
                  padding: '28px',
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr',
                  gap: '24px',
                  alignItems: 'start'
                }}
              >
                {/* Step Badge */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px 10px',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                    {s.step}
                  </span>
                  <div style={{ color: 'var(--text-muted)', marginTop: '6px' }}>
                    <Icon size={20} />
                  </div>
                </div>

                {/* Content */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {s.title}
                    </h3>
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--primary)', marginBottom: '8px' }}>
                    {s.summary}
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {s.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{
          marginTop: '60px',
          textAlign: 'center',
          padding: '48px',
          backgroundColor: 'var(--bg-subtle)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '10px' }}>
            Ready to Run a Field Inspection?
          </h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', maxWidth: '520px', margin: '0 auto 24px' }}>
            Log in to the authorized officer workspace to experience the full 10-step inspection workflow.
          </p>
          <button onClick={onLoginClick} className="btn-primary" style={{ padding: '12px 28px' }}>
            Officer Sign In <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

