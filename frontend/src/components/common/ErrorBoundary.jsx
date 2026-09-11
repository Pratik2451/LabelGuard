import React from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';

/**
 * ErrorBoundary — catches any unhandled render/lifecycle errors inside
 * the wizard and displays a professional error card instead of a blank screen.
 *
 * Usage:
 *   <ErrorBoundary onReset={() => setCurrentStep(1)}>
 *     <WizardStep ... />
 *   </ErrorBoundary>
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: '',
      errorStack: ''
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorMessage: error?.message || 'An unexpected error occurred.',
      errorStack: error?.stack || ''
    };
  }

  componentDidCatch(error, info) {
    // Log to console for developer visibility — do NOT suppress
    console.error('[ErrorBoundary] Caught render error:', error);
    console.error('[ErrorBoundary] Component stack:', info?.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, errorMessage: '', errorStack: '' });
    if (typeof this.props.onReset === 'function') {
      this.props.onReset();
    }
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div style={{ maxWidth: '680px', margin: '40px auto' }}>
        <div
          className="card-institutional"
          style={{
            padding: '40px 32px',
            borderLeft: '4px solid var(--status-fail-text)',
            textAlign: 'center'
          }}
        >
          {/* Error Icon */}
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--status-fail-bg)',
            border: '1px solid var(--status-fail-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            color: 'var(--status-fail-text)'
          }}>
            <AlertTriangle size={32} />
          </div>

          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '800',
            color: 'var(--text-primary)',
            marginBottom: '8px'
          }}>
            Unexpected Error in Inspection Step
          </h3>

          <p style={{
            fontSize: '0.9rem',
            color: 'var(--text-muted)',
            marginBottom: '16px',
            lineHeight: 1.6
          }}>
            An error was encountered while rendering this inspection step. Your inspection data
            has been preserved — no new record was created by this error.
          </p>

          {/* Error Detail Box */}
          <div style={{
            backgroundColor: 'var(--status-fail-bg)',
            border: '1px solid var(--status-fail-border)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            marginBottom: '28px',
            textAlign: 'left'
          }}>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              color: 'var(--status-fail-text)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '6px'
            }}>
              Error Detail
            </div>
            <code style={{
              fontSize: '0.82rem',
              color: 'var(--text-primary)',
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap',
              fontFamily: 'var(--font-mono, monospace)'
            }}>
              {this.state.errorMessage}
            </code>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button
              onClick={this.handleReset}
              className="btn-primary"
              style={{ padding: '10px 20px' }}
            >
              <RefreshCw size={16} />
              <span>Return to Inspection Start</span>
            </button>
          </div>

          <p style={{
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            marginTop: '20px',
            lineHeight: 1.5
          }}>
            If this error persists, open the browser Developer Console (F12) for the full stack
            trace and contact support with the error detail above.
          </p>
        </div>
      </div>
    );
  }
}

