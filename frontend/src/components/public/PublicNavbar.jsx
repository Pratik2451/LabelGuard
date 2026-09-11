import React from 'react';
import { LogIn, ArrowRight, LayoutDashboard, UserCheck } from 'lucide-react';
import LabelGuardLogo from '../common/LabelGuardLogo';

/**
 * PublicNavbar — Always displays institutional public interface.
 * When not authenticated: shows "Officer Login" & "Get Started".
 * When authenticated: shows a clean "Officer Portal" entry button without transforming the page.
 */
export default function PublicNavbar({ activePage, onNavigate, onLoginClick, user, isAuthenticated, onGoToPortal }) {
  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'rules', label: 'LMPC Rules' },
    { id: 'guidelines', label: 'Guidelines' },
    { id: 'contact', label: 'Contact Us' }
  ];

  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Top Government Notice Bar */}
      <div style={{
        backgroundColor: 'var(--bg-navy)',
        color: '#e2e8f0',
        fontSize: '0.75rem',
        padding: '6px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div className="container-max" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: 0 }}>
          <span>Legal Metrology (Packaged Commodities) Rules, 2011 • Enforcement Inspection System</span>
          {isAuthenticated && user ? (
            <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <UserCheck size={13} color="#38bdf8" />
              <span>Officer Session Active</span>
            </span>
          ) : (
            <span style={{ color: '#94a3b8' }}>Authorized Officer Portal Available</span>
          )}
        </div>
      </div>

      {/* Main Header */}
      <div className="container-max" style={{
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand & Logo */}
        <div
          onClick={() => onNavigate('home')}
          style={{ cursor: 'pointer' }}
        >
          <LabelGuardLogo size={36} color="var(--primary)" textColor="var(--text-primary)" showText={true} />
        </div>

        {/* Public Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {navLinks.map((link) => {
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '8px 14px',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? '600' : '500',
                  color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'color 0.15s ease, background-color 0.15s ease',
                  backgroundColor: isActive ? 'var(--primary-subtle)' : 'transparent'
                }}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isAuthenticated && user ? (
            <button
              onClick={onGoToPortal}
              className="btn-primary"
              style={{ fontSize: '0.85rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <LayoutDashboard size={15} />
              <span>Officer Portal</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <>
              <button
                onClick={onLoginClick}
                className="btn-secondary"
                style={{ fontSize: '0.85rem', padding: '8px 16px' }}
              >
                <LogIn size={15} /> Officer Login
              </button>
              <button
                onClick={onLoginClick}
                className="btn-primary"
                style={{ fontSize: '0.85rem', padding: '8px 16px' }}
              >
                Get Started <ArrowRight size={15} />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
