import React from 'react';
import { BookOpen, Camera, CheckCircle2, AlertTriangle, ShieldCheck, FileCheck } from 'lucide-react';

export default function GuidelinesPage() {
  const guidelines = [
    {
      title: '1. Multi-Surface Coverage Protocol',
      desc: 'Field officers must capture both the Principal Display Panel (PDP) and Information Panel (back/side) before concluding an audit. An inspection lacking the back surface must remain flagged as "Inspection Incomplete" to prevent unsubstantiated violation notices against packers.'
    },
    {
      title: '2. Optical Quality & Framing Requirements',
      desc: 'Ensure the packaged commodity is placed flat with diffuse lighting to avoid flash hot-spots and reflective glare on plastic/foil substrates. All four corners of the target surface should be visible inside the capture viewfinder.'
    },
    {
      title: '3. Physical Readability & Font Calibration',
      desc: 'While OCR extracts textual strings, physical font height (mm) under Table 1 Schedule II cannot be conclusively adjudicated without an in-frame calibrated measurement card. When font height is contested, use calibrated scale references.'
    },
    {
      title: '4. Cross-View Consistency Verification',
      desc: 'Always cross-check MRP values between front promotional flashes and barcode pricing panels. Where dual pricing is identified, both surfaces must be preserved as separate evidence entries.'
    },
    {
      title: '5. Tamper-Evident Evidence Provenance',
      desc: 'Original high-resolution images are cryptographically hashed using SHA-256 immediately upon upload. Modified, cropped, or filtered images must never replace original captured evidence in the audit archive.'
    },
    {
      title: '6. Officer Verification Authority',
      desc: 'Automated AI confidence scores and rule flags serve exclusively to expedite discovery. Every formal notice or report must be corroborated and verified by the authorized inspection officer.'
    }
  ];

  return (
    <div style={{ backgroundColor: '#ffffff' }}>
      <div style={{
        backgroundColor: 'var(--bg-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '54px 24px 48px'
      }}>
        <div className="container-max">
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Standard Operating Procedures
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '8px', marginBottom: '12px' }}>
            Field Inspection Guidelines
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '720px', lineHeight: 1.6 }}>
            Recommended field operating protocols for Legal Metrology officers conducting packaged commodity audits.
          </p>
        </div>
      </div>

      <div className="container-max" style={{ padding: '60px 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          {guidelines.map((g, idx) => (
            <div key={idx} className="card-institutional" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px' }}>
                {g.title}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {g.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

