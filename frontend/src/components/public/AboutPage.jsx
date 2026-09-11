import React from 'react';
import { ShieldCheck, Target, Users, Cpu, FileCheck2, ArrowRight } from 'lucide-react';

export default function AboutPage({ onNavigate, onLoginClick }) {
  return (
    <div style={{ backgroundColor: '#ffffff' }}>
      {/* Header Banner */}
      <div style={{
        backgroundColor: 'var(--bg-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '54px 24px 48px'
      }}>
        <div className="container-max">
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            About The System
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '8px', marginBottom: '12px' }}>
            About LabelGuard
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '720px', lineHeight: 1.6 }}>
            An assistive packaged commodity compliance inspection system engineered for Legal Metrology officers under SIH 2026 Problem Statement 26034.
          </p>
        </div>
      </div>

      <div className="container-max" style={{ padding: '60px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '48px', marginBottom: '60px' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px' }}>
              The Problem We Address
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>
              Every year, millions of packaged commodities are sold across Indian retail markets. Under the <strong>Legal Metrology (Packaged Commodities) Rules, 2011</strong>, manufacturers and packers are legally mandated to declare crucial information such as Maximum Retail Price (MRP), Net Quantity, Manufacturer details, Country of Origin, Manufacturing date, and Consumer Care contacts.
            </p>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>
              However, field inspection of physical packages is inherently challenging:
            </p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.92rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              <li><strong>Multi-Surface Declarations:</strong> Declarations are spread across multiple panels (PDP, Information Panel, back, sides, crimp folds). Single-angle photos provide incomplete evidence.</li>
              <li><strong>Optical Variations:</strong> Glare, metallic foils, cylindrical containers, small font sizes, and debossed batch codes impede accurate detection.</li>
              <li><strong>False Allegations from Partial Scans:</strong> If a system searches only a front photo, it falsely claims the manufacturer address is missing when it is actually printed on the back.</li>
              <li><strong>Evidence Tampering Concerns:</strong> Manual inspections often lack cryptographic provenance, making evidence challenging to substantiate during regulatory proceedings.</li>
            </ul>

            <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px' }}>
              Our Approach: Human-in-the-Loop Inspection
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>
              LabelGuard is fundamentally an <strong>assistive inspection tool</strong>. It never usurps the statutory authority of the inspection officer. Instead:
            </p>
            <div style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '18px 20px', marginBottom: '24px' }}>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <li><strong>1. Computer Vision & OCR:</strong> Detect, localize, and extract printed declarations from guided package surfaces.</li>
                <li><strong>2. Algorithmic Rule Engine:</strong> Evaluates extracted text against applicable LMPC 2011 rule conditions.</li>
                <li><strong>3. Cross-View Checker:</strong> Identifies potential discrepancies across surfaces (e.g. dual MRP).</li>
                <li><strong>4. Inspection Completeness:</strong> Differentiates "uncaptured surface" from "missing declaration."</li>
                <li><strong>5. Officer Verification:</strong> The officer retains final decision-making power to confirm or dismiss potential findings.</li>
              </ul>
            </div>
          </div>

          {/* Side Info Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card-institutional" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', marginBottom: '12px' }}>
                <Cpu size={20} />
                <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>Technology Stack</h4>
              </div>
              <ul style={{ listStyle: 'none', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>• <strong>OCR Engine:</strong> PaddleOCR with PP-OCR text detection</li>
                <li>• <strong>Backend:</strong> Node.js / Express micro-architecture</li>
                <li>• <strong>Database:</strong> MongoDB Atlas persistent repository</li>
                <li>• <strong>Evidence Hashing:</strong> SHA-256 cryptographic provenance</li>
                <li>• <strong>Reporting:</strong> Formal ReportLab PDF generation engine</li>
                <li>• <strong>Offline Queue:</strong> Browser-backed field cache</li>
              </ul>
            </div>

            <div className="card-institutional" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--bg-navy)', marginBottom: '12px' }}>
                <Users size={20} />
                <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>Intended Users</h4>
              </div>
              <ul style={{ listStyle: 'none', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>• Legal Metrology Inspectors & Controllers</li>
                <li>• Enforcement Officers on Market Surveillance</li>
                <li>• Port & Customs Officers on Import Verification</li>
                <li>• Quality Control & Compliance Auditors</li>
              </ul>
            </div>

            <div className="card-institutional" style={{ padding: '24px', backgroundColor: 'var(--bg-navy)', color: '#ffffff' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '8px' }}>Regulatory Integrity</h4>
              <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '16px' }}>
                Every inspection record preserves original uncompressed photos, bounding boxes, SHA-256 checksums, and officer review timestamps.
              </p>
              <button onClick={onLoginClick} className="btn-primary" style={{ width: '100%', fontSize: '0.82rem' }}>
                Access Officer Workspace
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

