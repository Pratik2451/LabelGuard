import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({
  icon: Icon = Inbox,
  title = "No records found",
  description = "No data is currently available for this section.",
  actionLabel,
  onAction
}) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '48px 24px',
      backgroundColor: '#ffffff',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        backgroundColor: 'var(--bg-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-muted)',
        marginBottom: '16px'
      }}>
        <Icon size={24} />
      </div>
      <h3 style={{
        fontSize: '1.05rem',
        fontWeight: '600',
        color: 'var(--text-primary)',
        marginBottom: '6px'
      }}>
        {title}
      </h3>
      <p style={{
        fontSize: '0.88rem',
        color: 'var(--text-muted)',
        maxWidth: '440px',
        lineHeight: 1.5,
        marginBottom: actionLabel ? '20px' : '0'
      }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn-primary">
          {actionLabel}
        </button>
      )}
    </div>
  );
}

