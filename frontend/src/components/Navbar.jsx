import React from 'react';
import { ShieldCheck, LayoutDashboard, PlusCircle, History, BookOpen, FileCheck, LogOut, User as UserIcon } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, user, onLogout, onAuthClick }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inspection', label: 'New Inspection', icon: PlusCircle },
    { id: 'history', label: 'History', icon: History },
    { id: 'rules', label: 'Rules', icon: BookOpen },
    { id: 'reports', label: 'Reports', icon: FileCheck }
  ];

  return (
    <nav style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(4, 6, 10, 0.85)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '14px 28px'
    }}>
      <div style={{
        maxWidth: '1380px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }} onClick={() => setActiveTab('dashboard')}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-purple-dark))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 25px rgba(139, 92, 246, 0.5)',
            border: '1px solid rgba(168, 85, 247, 0.4)'
          }}>
            <ShieldCheck size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '-0.5px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              LabelGuard <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-purple-light)', border: '1px solid var(--border-purple)' }}>..</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(13, 17, 28, 0.7)',
          padding: '5px',
          borderRadius: '14px',
          border: '1px solid var(--border-subtle)'
        }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (!user && (item.id === 'inspection' || item.id === 'history' || item.id === 'reports')) {
                    onAuthClick();
                  } else {
                    setActiveTab(item.id);
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  background: isActive ? 'linear-gradient(135deg, var(--accent-purple), var(--accent-purple-dark))' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  fontWeight: isActive ? '700' : '500',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 0 15px rgba(139, 92, 246, 0.4)' : 'none'
                }}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* User Auth */}
        <div>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(139, 92, 246, 0.2)',
                  border: '1px solid var(--border-purple)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-purple-light)'
                }}>
                  <UserIcon size={16} />
                </div>
                <span style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-main)' }}>{user.username}</span>
              </div>
              <button
                onClick={onLogout}
                className="btn-secondary"
                style={{ padding: '8px 12px', fontSize: '0.82rem' }}
                title="Logout"
              >
                <LogOut size={15} />
                Logout
              </button>
            </div>
          ) : (
            <button onClick={onAuthClick} className="btn-primary">
              <UserIcon size={16} />
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
