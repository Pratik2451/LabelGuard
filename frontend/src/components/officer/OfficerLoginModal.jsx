import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, User as UserIcon, LogIn, UserPlus, X, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function OfficerLoginModal({ onAuthSuccess, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('Legal Metrology Division');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const res = await axios.post('/api/v1/user/login', {
          email: email.trim(),
          username: username.trim(),
          password
        });
        const { accessToken, user } = res.data.data;
        onAuthSuccess(user, accessToken);
      } else {
        await axios.post('/api/v1/user/register', {
          username: username.trim(),
          email: email.trim(),
          password
        });
        // Auto sign-in after registration
        const loginRes = await axios.post('/api/v1/user/login', {
          email: email.trim(),
          username: username.trim(),
          password
        });
        const { accessToken, user } = loginRes.data.data;
        onAuthSuccess(user, accessToken);
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        width: '100%',
        maxWidth: '460px',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden'
      }}>
        {/* Modal Header Bar */}
        <div style={{
          backgroundColor: 'var(--bg-navy)',
          color: '#ffffff',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldCheck size={18} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', letterSpacing: '-0.3px' }}>
                Secure Officer Access
              </h3>
              <p style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                Legal Metrology Enforcement System
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div style={{ padding: '28px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
              {isLogin ? 'Officer Sign In' : 'Create Officer Account'}
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {isLogin ? 'Enter your authorized credentials to access the inspection workstation.' : 'Register official inspector credentials.'}
            </p>
          </div>

          {error && (
            <div style={{
              backgroundColor: 'var(--status-fail-bg)',
              border: '1px solid var(--status-fail-border)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              color: 'var(--status-fail-text)',
              fontSize: '0.82rem',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                Officer ID / Username *
              </label>
              <div style={{ position: 'relative' }}>
                <UserIcon size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  required
                  className="input-institutional"
                  style={{ paddingLeft: '36px' }}
                  placeholder="e.g. officer_sharma"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                Official Email Address *
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  required
                  className="input-institutional"
                  style={{ paddingLeft: '36px' }}
                  placeholder="officer@department.gov.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                Password *
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  required
                  className="input-institutional"
                  style={{ paddingLeft: '36px' }}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', marginTop: '6px', padding: '12px' }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : isLogin ? (
                <>
                  <LogIn size={16} />
                  <span>Sign In to Officer Portal</span>
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  <span>Register Inspector Account</span>
                </>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {isLogin ? "Need to register a new inspector account?" : "Already registered as an officer?"}{' '}
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
            >
              {isLogin ? 'Register now' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

