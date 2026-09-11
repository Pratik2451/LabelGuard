import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children, onRequireLogin }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        color: 'var(--text-muted)'
      }}>
        <Loader2 size={36} className="animate-spin" color="var(--primary)" />
        <p style={{ fontSize: '0.9rem', fontWeight: '500' }}>
          Verifying authorized officer session credentials...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Unauthenticated: invoke login prompt immediately
    if (typeof onRequireLogin === 'function') {
      onRequireLogin();
    }
    return (
      <div style={{
        padding: '60px 20px',
        textAlign: 'center',
        maxWidth: '520px',
        margin: '60px auto',
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
          Restricted Officer Portal
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: 1.5 }}>
          Access to packaged commodity inspection ledgers, statutory finding audits, and the inspection wizard requires official authentication.
        </p>
        <button
          onClick={onRequireLogin}
          className="btn-primary"
          style={{ padding: '10px 24px' }}
        >
          Sign In with Officer Credentials
        </button>
      </div>
    );
  }

  return children;
}
