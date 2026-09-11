import React from 'react';
import {
  ShieldCheck, ArrowRight, Scan, Sparkles, CheckCircle2, AlertTriangle,
  FileText, Lock, Eye, Layers, Compass, HelpCircle, Building2, Tag, Scale, Calendar, Phone, Globe
} from 'lucide-react';

export default function HomePage({ onNavigate, onLoginClick }) {
  return (
    <div style={{ backgroundColor: '#ffffff' }}>
      
      {/* 1. HERO SECTION */}
      <section style={{
        padding: '72px 24px 80px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div className="container-max" style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '48px',
          alignItems: 'center'
        }}>
          <div>
            {/* Regulatory Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--primary-subtle)',
              border: '1px solid var(--primary-border)',
              color: 'var(--primary)',
              fontSize: '0.8rem',
              fontWeight: '600',
              marginBottom: '20px'
            }}>
              <ShieldCheck size={16} /> Legal Metrology (Packaged Commodities) Rules, 2011 Assistive Platform
            </div>

            <h1 style={{
              fontSize: '3.2rem',
              fontWeight: '800',
              lineHeight: 1.15,
              letterSpacing: '-1px',
              color: 'var(--text-primary)',
              marginBottom: '20px'
            }}>
              Verify Packaged Commodities. <br />
              <span style={{ color: 'var(--primary)' }}>Strengthen Compliance.</span>
            </h1>

            <p style={{
              fontSize: '1.1rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: '32px',
              maxWidth: '560px'
            }}>
              LabelGuard assists Legal Metrology officers in inspecting packaged commodities through guided multi-surface capture, OCR-assisted declaration extraction, rule-based verification, and evidence-backed inspection records.
            </p>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <button
                onClick={onLoginClick}
                className="btn-primary"
                style={{ padding: '14px 28px', fontSize: '1rem' }}
              >
                <span>Start Inspection</span>
                <ArrowRight size={18} />
              </button>
              <button
                onClick={() => onNavigate('how-it-works')}
                className="btn-secondary"
                style={{ padding: '14px 24px', fontSize: '1rem' }}
              >
                How It Works
              </button>
            </div>

            <div style={{
              marginTop: '32px',
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              fontSize: '0.82rem',
              color: 'var(--text-muted)'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} color="var(--status-pass-text)" /> Human-in-the-Loop Verification
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} color="var(--status-pass-text)" /> SHA-256 Evidence Provenance
              </span>
            </div>
          </div>

          {/* Institutional Product Mockup Visual */}
          <div style={{
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
            boxShadow: 'var(--shadow-md)'
          }}>
            {/* Window Bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: '14px',
              borderBottom: '1px solid var(--border-subtle)',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#cbd5e1' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#cbd5e1' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#cbd5e1' }} />
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                INSPECTION: INSP-2026-9042 • EVIDENCE MAP
              </span>
              <span className="badge-status badge-pass" style={{ fontSize: '0.65rem' }}>ACTIVE RECORD</span>
            </div>

            {/* Split Visual: Package Surface & Extraction Ledger with Animated Scanning Beam */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '14px' }}>
              {/* Simulated Package Image with Bounding Box & Active Scanline */}
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '220px',
                overflow: 'hidden'
              }}>
                {/* Real CSS scanning line animation */}
                <div className="hero-scanner-line" />

                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '8px', width: '100%', textAlign: 'left', fontWeight: '700', letterSpacing: '0.3px' }}>
                  SURFACE: FRONT (PRINCIPAL DISPLAY PANEL)
                </div>

                <div style={{
                  border: '2px solid var(--primary)',
                  backgroundColor: 'rgba(29, 78, 216, 0.08)',
                  padding: '10px 14px',
                  borderRadius: '4px',
                  width: '90%',
                  textAlign: 'center',
                  marginBottom: '10px',
                  position: 'relative'
                }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: '800' }}>[BOUNDING BOX 01 • OCR 94%]</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-primary)' }}>Parle-G Gold Biscuits</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Declared Net Qty: 100 g</div>
                </div>

                <div style={{
                  border: '2px dashed var(--status-review-text)',
                  backgroundColor: 'var(--status-review-bg)',
                  padding: '6px 10px',
                  borderRadius: '4px',
                  width: '90%',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--status-review-text)' }}>
                    MRP ₹ 10.00 (Incl. of all taxes)
                  </div>
                </div>
              </div>

              {/* Verified Declarations List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ backgroundColor: '#ffffff', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600' }}>Rule 6(1)(c) Product Name</span>
                    <span className="badge-status badge-pass" style={{ fontSize: '0.65rem' }}>Compliant</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '2px' }}>Parle-G Gold Biscuits</div>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600' }}>Rule 6(1)(d) Net Quantity</span>
                    <span className="badge-status badge-pass" style={{ fontSize: '0.65rem' }}>Compliant</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '2px' }}>100 g (Standard SI)</div>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600' }}>Rule 6(1)(a) Manufacturer</span>
                    <span className="badge-status badge-incomplete" style={{ fontSize: '0.65rem' }}>Back Surface Req.</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>Awaiting Back Panel Scan</div>
                </div>
              </div>
            </div>

            {/* Verification Metadata Footnote */}
            <div style={{
              marginTop: '16px',
              paddingTop: '12px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.72rem',
              color: 'var(--text-muted)'
            }}>
              <span>SHA-256: 7f8a92b...e4a1</span>
              <span>Officer: Authorized Inspector</span>
            </div>
          </div>
        </div>
      </section>

      {/* DUAL COMPLIANCE ENVIRONMENTS SECTION (SIH 2026 PS 26034) */}
      <section style={{ padding: '64px 24px', backgroundColor: '#ffffff', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container-max">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Comprehensive Jurisdiction
            </span>
            <h2 style={{ fontSize: '2.1rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '6px' }}>
              One Platform. Two Compliance Environments.
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', maxWidth: '640px', margin: '8px auto 0' }}>
              Enforcing Legal Metrology Packaged Commodities Rules across both physical point-of-sale retail and digital e-commerce marketplaces.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
            {/* Card 1: Physical */}
            <div className="card-institutional" style={{ padding: '32px', borderTop: '4px solid var(--primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <Scale size={22} color="var(--primary)" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                  Physical Market Inspection
                </h3>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
                Dedicated multi-surface physical capture for packaged goods in retail stores, distribution hubs, and ports.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                <li style={{ display: 'flex', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--status-pass-text)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  Guided capture: Front (PDP), Back (Info Panel), Side, Top/Bottom.
                </li>
                <li style={{ display: 'flex', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--status-pass-text)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  PaddleOCR text extraction &amp; localized bounding boxes.
                </li>
                <li style={{ display: 'flex', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--status-pass-text)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  Tamper-evident SHA-256 cryptographic image hashing.
                </li>
                <li style={{ display: 'flex', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--status-pass-text)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  Physical font size calibration for Rule 9 compliance.
                </li>
              </ul>
            </div>

            {/* Card 2: E-Commerce */}
            <div className="card-institutional" style={{ padding: '32px', borderTop: '4px solid #0284c7' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <Globe size={22} color="#0284c7" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                  E-Commerce Listing Review
                </h3>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
                Rule 6(10) digital marketplace review auditing mandatory digital disclosures on Amazon, Flipkart, Blinkit, and quick commerce.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                <li style={{ display: 'flex', gap: '8px' }}>
                  <CheckCircle2 size={16} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
                  Verifies digital Country of Origin, MRP, and per-unit price.
                </li>
                <li style={{ display: 'flex', gap: '8px' }}>
                  <CheckCircle2 size={16} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
                  Preserves listing screenshots and source URLs with timestamps.
                </li>
                <li style={{ display: 'flex', gap: '8px' }}>
                  <CheckCircle2 size={16} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
                  Audits expiry / best-before dates on perishable product pages.
                </li>
                <li style={{ display: 'flex', gap: '8px' }}>
                  <CheckCircle2 size={16} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
                  Clearly stamps findings as <em>"E-Commerce Listing Evidence"</em>.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>


      {/* 2. WHY LABELGUARD (4 CLEAN FEATURE CARDS) */}
      <section style={{ padding: '72px 24px', backgroundColor: 'var(--bg-page)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container-max">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Purpose-Built Architecture
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '6px' }}>
              Why LabelGuard for Packaged Commodity Inspection?
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', maxWidth: '620px', margin: '8px auto 0' }}>
              Standard OCR tools fail when faced with non-flat packaging, missing surfaces, or multi-angle declarations. LabelGuard is built around statutory inspection reality.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {/* Card 1 */}
            <div className="card-institutional card-institutional-hover" style={{ padding: '28px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary-subtle)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px'
              }}>
                <Compass size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '10px' }}>
                Guided Multi-Surface Inspection
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Captures package surfaces systematically (Front, Back, Side, Top, Bottom). Calculates coverage completeness before evaluating requirements.
              </p>
            </div>

            {/* Card 2 */}
            <div className="card-institutional card-institutional-hover" style={{ padding: '28px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary-subtle)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px'
              }}>
                <Scan size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '10px' }}>
                AI-Assisted Extraction
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Extracts mandatory declarations from packaging imagery using OCR and computer vision, isolating bounding boxes, text values, and confidence scores.
              </p>
            </div>

            {/* Card 3 */}
            <div className="card-institutional card-institutional-hover" style={{ padding: '28px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary-subtle)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px'
              }}>
                <Layers size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '10px' }}>
                Rule-Based Verification
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Evaluates extracted declarations against applicable Legal Metrology rules (Rule 6(1)(a)-(h)) with context sensitivity for domestic vs. imported goods.
              </p>
            </div>

            {/* Card 4 */}
            <div className="card-institutional card-institutional-hover" style={{ padding: '28px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary-subtle)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px'
              }}>
                <Lock size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '10px' }}>
                Evidence-Backed Records
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Links findings directly to preserved high-resolution imagery, SHA-256 evidence integrity checksums, rule versions, and officer verification records.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (5-STEP CLEAN WORKFLOW) */}
      <section style={{ padding: '72px 24px', backgroundColor: '#ffffff', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container-max">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Operational Workflow
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '6px' }}>
              5-Step Structured Inspection Process
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', maxWidth: '580px', margin: '8px auto 0' }}>
              From initial context entry to officer-verified formal report generation.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
            {[
              { num: '01', title: 'Context & Capture', desc: 'Specify commodity type and capture package surfaces via camera or file upload.' },
              { num: '02', title: 'OCR Extraction', desc: 'PaddleOCR engine parses text lines, coordinates, and confidence scores across surfaces.' },
              { num: '03', title: 'Rule Evaluation', desc: 'Context-aware engine matches declarations against LMPC 2011 requirements.' },
              { num: '04', title: 'Officer Verification', desc: 'Field officer reviews potential findings, inspects localized bounding boxes, and records decision.' },
              { num: '05', title: 'Report & Hash', desc: 'Tamper-evident SHA-256 hashes generated; export formal PDF inspection record.' }
            ].map((step) => (
              <div key={step.num} style={{
                backgroundColor: 'var(--bg-page)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px 20px',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{
                  fontSize: '1.4rem',
                  fontWeight: '800',
                  color: 'var(--primary)',
                  marginBottom: '12px'
                }}>
                  {step.num}
                </div>
                <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
                  {step.title}
                </h4>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. INSPECTION INTELLIGENCE (CORE DIFFERENTIATOR) */}
      <section style={{ padding: '72px 24px', backgroundColor: 'var(--bg-navy)', color: '#ffffff' }}>
        <div className="container-max" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
          <div>
            <div style={{
              display: 'inline-block',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#93c5fd',
              fontSize: '0.78rem',
              fontWeight: '700',
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Core Differentiator
            </div>

            <h2 style={{ fontSize: '2.4rem', fontWeight: '800', lineHeight: 1.2, marginBottom: '20px' }}>
              "Not Visible is NOT the Same as Missing."
            </h2>

            <p style={{ fontSize: '1rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '20px' }}>
              Traditional automated scanners falsely declare non-compliance whenever a single photograph does not show manufacturer or consumer care declarations.
            </p>

            <p style={{ fontSize: '1rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '28px' }}>
              LabelGuard implements a statutory <strong>Package Surface Completeness Model</strong>. If the back panel has not been captured, the system flags the inspection as incomplete rather than generating a false violation accusation against the brand.
            </p>

            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              borderLeft: '4px solid var(--primary)',
              padding: '16px 20px',
              borderRadius: '0 var(--radius-md) var(--radius-md) 0'
            }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#93c5fd', marginBottom: '4px' }}>
                STATUTORY ACCURACY PRINCIPLE
              </div>
              <div style={{ fontSize: '0.9rem', color: '#e2e8f0', fontStyle: 'italic' }}>
                "Back surface not captured. Manufacturer declaration cannot yet be assessed. Recapture or supplemental capture required before audit conclusion."
              </div>
            </div>
          </div>

          {/* Side Comparison Box */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            padding: '28px',
            color: 'var(--text-primary)',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '16px', color: 'var(--text-primary)' }}>
              Surface Coverage vs. Violation Accuracy
            </h4>

            {/* Case A: Naive AI */}
            <div style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--status-fail-bg)',
              border: '1px solid var(--status-fail-border)',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--status-fail-text)' }}>GENERIC OCR TOOL</span>
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--status-fail-text)' }}>
                "VIOLATION: Manufacturer Address Missing (Rule 6(1)(a) FAIL)"
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                (Flawed: Only the front label was photographed; manufacturer details are printed on the back panel.)
              </div>
            </div>

            {/* Case B: LabelGuard */}
            <div style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--status-pass-bg)',
              border: '1px solid var(--status-pass-border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--status-pass-text)' }}>LABELGUARD ASSISTIVE ENGINE</span>
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--status-pass-text)' }}>
                "INSPECTION INCOMPLETE: Back surface not yet captured."
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                (Statutorily Sound: Directs officer to capture back surface before drawing legal non-compliance inferences.)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHAT LABELGUARD CHECKS */}
      <section style={{ padding: '72px 24px', backgroundColor: '#ffffff', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container-max">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Statutory Declarations
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '6px' }}>
              What Declarations Does LabelGuard Audit?
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', maxWidth: '640px', margin: '8px auto 0' }}>
              Rule applicability depends on commodity category, domestic vs. imported context, and packaging dimensions under LMPC Rules 2011.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
            {[
              { rule: 'Rule 6(1)(a)', name: 'Manufacturer / Packer / Importer', desc: 'Complete name and physical street address identification.' },
              { rule: 'Rule 6(1)(b)', name: 'Country of Origin', desc: 'Origin declaration mandatory for imported goods; domestic origin by address.' },
              { rule: 'Rule 6(1)(c)', name: 'Generic / Common Name', desc: 'Explicit product identification on the Principal Display Panel.' },
              { rule: 'Rule 6(1)(d)', name: 'Net Quantity & Standard Units', desc: 'Weight, volume, or count in prescribed SI units (g, kg, ml, l, N).' },
              { rule: 'Rule 6(1)(e)', name: 'Maximum Retail Price (MRP)', desc: 'Retail price inclusive of all taxes; detects dual-pricing discrepancies.' },
              { rule: 'Rule 6(1)(f)', name: 'Date of Mfg / Packing', desc: 'Month and year of manufacture, packing, or import (MM/YYYY).' },
              { rule: 'Rule 6(1)(h)', name: 'Consumer Care Helpline', desc: 'Telephone number and email address for consumer grievance redressal.' },
              { rule: 'Rule 9 / Table 1', name: 'Declaration Readability', desc: 'Minimum numeral and letter font height based on area (requires calibration).' },
              { rule: 'Cross-View', name: 'Cross-Surface Consistency', desc: 'Detects conflicting declarations (e.g. Front MRP ₹120 vs Back MRP ₹150).' }
            ].map((item, idx) => (
              <div key={idx} className="card-institutional" style={{ padding: '20px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase' }}>
                  {item.rule}
                </span>
                <h4 style={{ fontSize: '0.98rem', fontWeight: '700', color: 'var(--text-primary)', margin: '4px 0 6px' }}>
                  {item.name}
                </h4>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. STAKEHOLDER BENEFITS */}
      <section style={{ padding: '72px 24px', backgroundColor: 'var(--bg-page)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container-max">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Impact & Value
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '6px' }}>
              Benefits Across Key Stakeholders
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {/* Inspectors */}
            <div className="card-institutional" style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '12px' }}>
                For Field Inspectors
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                <li style={{ display: 'flex', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  Faster, structured on-site multi-surface capture.
                </li>
                <li style={{ display: 'flex', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  Automated OCR text extraction with highlighted bounding boxes.
                </li>
                <li style={{ display: 'flex', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  Immediate cross-surface conflict detection (dual MRP).
                </li>
                <li style={{ display: 'flex', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  Tamper-evident SHA-256 evidence record generation.
                </li>
              </ul>
            </div>

            {/* Authorities */}
            <div className="card-institutional" style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--bg-navy)', marginBottom: '12px' }}>
                For Legal Metrology Authorities
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                <li style={{ display: 'flex', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--bg-navy)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  Searchable, standardized digital inspection archives.
                </li>
                <li style={{ display: 'flex', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--bg-navy)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  Repeat non-compliance tracking grouped by brand/manufacturer.
                </li>
                <li style={{ display: 'flex', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--bg-navy)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  Standardized formal PDF inspection report export.
                </li>
                <li style={{ display: 'flex', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--bg-navy)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  Verifiable audit trails with officer signature metadata.
                </li>
              </ul>
            </div>

            {/* Consumers */}
            <div className="card-institutional" style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--status-pass-text)', marginBottom: '12px' }}>
                For Indian Consumers
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                <li style={{ display: 'flex', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--status-pass-text)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  Protection against misleading or suppressed declarations.
                </li>
                <li style={{ display: 'flex', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--status-pass-text)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  Prevention of unfair dual-pricing practices across retail tiers.
                </li>
                <li style={{ display: 'flex', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--status-pass-text)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  Accessible consumer care details for grievance redressal.
                </li>
                <li style={{ display: 'flex', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--status-pass-text)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  Accurate declared net quantities and standard SI units.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FINAL CTA */}
      <section style={{
        padding: '64px 24px',
        backgroundColor: '#ffffff',
        textAlign: 'center'
      }}>
        <div className="container-max" style={{ maxWidth: '680px' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '12px' }}>
            Ready to Begin an Assistive Inspection?
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '28px' }}>
            Access the authorized officer portal to initiate multi-surface guided packaging captures, inspect declarations, and build evidence-backed inspection records.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button
              onClick={onLoginClick}
              className="btn-primary"
              style={{ padding: '12px 28px', fontSize: '0.95rem' }}
            >
              Secure Officer Login
            </button>
            <button
              onClick={() => onNavigate('rules')}
              className="btn-secondary"
              style={{ padding: '12px 24px', fontSize: '0.95rem' }}
            >
              Explore LMPC Rules
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

