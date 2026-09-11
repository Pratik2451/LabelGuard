import React from 'react';
import { ArrowRight, ShieldCheck, Sparkles, Scan, FileCheck2, Cpu } from 'lucide-react';

export default function DashboardView({ onStartScan }) {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px' }}>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '72px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '30px',
          background: 'rgba(139, 92, 246, 0.12)',
          border: '1px solid var(--border-purple)',
          color: 'var(--accent-purple-light)',
          fontSize: '0.85rem',
          fontWeight: '600',
          marginBottom: '24px'
        }}>
          <Sparkles size={16} /> Powered by PaddleOCR & Legal Metrology AI Engine
        </div>

        <h1 style={{
          fontSize: '3.8rem',
          fontWeight: '800',
          letterSpacing: '-1.5px',
          lineHeight: 1.15,
          marginBottom: '24px',
          background: 'linear-gradient(135deg, #ffffff 30%, #a855f7 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          One Scan.<br />
          Every Rule.<br />
          Zero Doubts.
        </h1>

        <p style={{
          fontSize: '1.2rem',
          color: 'var(--text-muted)',
          maxWidth: '680px',
          margin: '0 auto 36px',
          lineHeight: '1.6',
          fontWeight: '400'
        }}>
          LabelGuard uses AI and OCR to extract product label information and verify compliance with applicable Indian Legal Metrology requirements.
        </p>

        <button
          onClick={onStartScan}
          className="btn-primary pulse-glow"
          style={{ padding: '16px 40px', fontSize: '1.1rem', borderRadius: '14px' }}
        >
          <span>Start New Inspection</span>
          <ArrowRight size={20} />
        </button>
      </div>

      {/* Feature Showcase Grid (Laboratory AI Visual Style) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px'
      }}>
        {/* Feature 1 */}
        <div className="panel-outlined panel-outlined-hover" style={{ padding: '32px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: 'rgba(139, 92, 246, 0.15)',
            border: '1px solid var(--border-purple)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-purple-light)',
            marginBottom: '20px'
          }}>
            <Scan size={26} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '10px', color: '#fff' }}>
            Multi-Angle Label OCR
          </h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Upload or capture Front, Back, and Side product labels. PaddleOCR parses raw text, bounding boxes, and confidence scores across packaging surfaces.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="panel-outlined panel-outlined-hover" style={{ padding: '32px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: 'rgba(6, 182, 212, 0.15)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-cyan)',
            marginBottom: '20px'
          }}>
            <Cpu size={26} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '10px', color: '#fff' }}>
            LMPC Rules Engine
          </h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Automatically evaluates mandatory declarations under Indian Legal Metrology (Packaged Commodities) Rules 2011 including MRP, Net Quantity, and Country of Origin.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="panel-outlined panel-outlined-hover" style={{ padding: '32px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-emerald)',
            marginBottom: '20px'
          }}>
            <FileCheck2 size={26} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '10px', color: '#fff' }}>
            Editable Report & Export
          </h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Review audit findings with PASS/FAIL/WARNING breakdowns, perform inline adjustments, and generate official compliance PDF reports.
          </p>
        </div>
      </div>
    </div>
  );
}
