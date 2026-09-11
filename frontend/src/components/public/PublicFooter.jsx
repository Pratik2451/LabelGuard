import React from 'react';
import { ShieldCheck, ExternalLink, FileText, CheckCircle2 } from 'lucide-react';

export default function PublicFooter({ onNavigate, onLoginClick }) {
  return (
    <footer style={{
      backgroundColor: 'var(--bg-navy)',
      color: '#ffffff',
      borderTop: '1px solid var(--border-dark)',
      marginTop: 'auto'
    }}>
      <div className="container-max" style={{ padding: '60px 24px 40px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: '40px',
          marginBottom: '48px'
        }}>
          {/* Column 1: Identity & Assistive Disclaimer */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                backgroundColor: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShieldCheck size={18} color="#ffffff" />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '-0.3px' }}>
                LABELGUARD
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6, maxWidth: '360px', marginBottom: '16px' }}>
              An assistive packaged commodity inspection system designed to support Legal Metrology officers in multi-surface verification under Legal Metrology (Packaged Commodities) Rules, 2011.
            </p>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              fontSize: '0.78rem',
              color: '#cbd5e1',
              lineHeight: 1.5
            }}>
              <strong>Regulatory Notice:</strong> LabelGuard is an assistive auditing tool. AI detections and rule evaluations serve to assist officers; final regulatory verification remains with authorized inspection officers.
            </div>
          </div>

          {/* Column 2: Platform Navigation */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ffffff', marginBottom: '16px', letterSpacing: '0.5px' }}>
              PLATFORM
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <li>
                <a href="#home" onClick={(e) => { e.preventDefault(); onNavigate('home'); }} style={{ color: '#94a3b8', textDecoration: 'none' }}>
                  Home
                </a>
              </li>
              <li>
                <a href="#about" onClick={(e) => { e.preventDefault(); onNavigate('about'); }} style={{ color: '#94a3b8', textDecoration: 'none' }}>
                  About Us
                </a>
              </li>
              <li>
                <a href="#how-it-works" onClick={(e) => { e.preventDefault(); onNavigate('how-it-works'); }} style={{ color: '#94a3b8', textDecoration: 'none' }}>
                  How It Works
                </a>
              </li>
              <li>
                <a href="#rules" onClick={(e) => { e.preventDefault(); onNavigate('rules'); }} style={{ color: '#94a3b8', textDecoration: 'none' }}>
                  LMPC Rules Catalog
                </a>
              </li>
              <li>
                <a href="#guidelines" onClick={(e) => { e.preventDefault(); onNavigate('guidelines'); }} style={{ color: '#94a3b8', textDecoration: 'none' }}>
                  Inspection Guidelines
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal Metrology Framework */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ffffff', marginBottom: '16px', letterSpacing: '0.5px' }}>
              REGULATORY
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: '#94a3b8' }}>
              <li>Legal Metrology Act, 2009</li>
              <li>LMPC Rules, 2011 (As Amended)</li>
              <li>Rule 6 Mandatory Declarations</li>
              <li>Second Schedule (SI Units)</li>
              <li>Table 1 (Font Height Schedule)</li>
              <li>Tamper-Evident Evidence Standards</li>
            </ul>
          </div>

          {/* Column 4: Officer Access */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ffffff', marginBottom: '16px', letterSpacing: '0.5px' }}>
              OFFICER ACCESS
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '16px' }}>
              Authorized Legal Metrology field officers can log in to conduct guided scans, evaluate declarations, and generate audit reports.
            </p>
            <button
              onClick={onLoginClick}
              className="btn-primary"
              style={{ width: '100%', fontSize: '0.85rem' }}
            >
              Secure Officer Login
            </button>
          </div>
        </div>

        {/* Bottom Institutional Disclaimer Bar */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.78rem',
          color: '#64748b'
        }}>
          <div>
            © {new Date().getFullYear()} LabelGuard System • Smart India Hackathon 2026 Problem Statement 26034
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => onNavigate('rules')}>LMPC Rules 2011</span>
            <span style={{ cursor: 'pointer' }} onClick={() => onNavigate('guidelines')}>Field Protocols</span>
            <span style={{ cursor: 'pointer' }} onClick={() => onNavigate('contact')}>Contact & Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

