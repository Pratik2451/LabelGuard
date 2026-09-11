import React from 'react';
import { PlusCircle, Wifi, WifiOff, ShieldCheck } from 'lucide-react';

export default function OfficerHeader({
  title = "Dashboard",
  subtitle = "Packaged commodity compliance overview",
  onNewInspection,
  isOnline = true,
  pendingSyncCount = 0
}) {
  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '16px 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      <div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>
          {title}
        </h1>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {subtitle}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Real Network / Offline Connectivity Status */}
        {isOnline ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.75rem',
            color: 'var(--status-pass-text)',
            backgroundColor: 'var(--status-pass-bg)',
            border: '1px solid var(--status-pass-border)',
            padding: '4px 10px',
            borderRadius: '20px',
            fontWeight: '600'
          }}>
            <Wifi size={13} />
            <span>Connected</span>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.75rem',
            color: 'var(--status-review-text)',
            backgroundColor: 'var(--status-review-bg)',
            border: '1px solid var(--status-review-border)',
            padding: '4px 10px',
            borderRadius: '20px',
            fontWeight: '600'
          }}>
            <WifiOff size={13} />
            <span>Offline Mode {pendingSyncCount > 0 ? `(${pendingSyncCount} Queued)` : ''}</span>
          </div>
        )}

        {onNewInspection && (
          <button
            onClick={onNewInspection}
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.86rem' }}
          >
            <PlusCircle size={15} /> New Inspection
          </button>
        )}
      </div>
    </header>
  );
}

