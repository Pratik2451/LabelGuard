import React from 'react';
import {
  LayoutDashboard, PlusCircle, Clock, History, Package, AlertTriangle,
  BookOpen, FileCheck, Shield, WifiOff, LogOut, User as UserIcon, Globe2, ShoppingBag
} from 'lucide-react';
import LabelGuardLogo from '../common/LabelGuardLogo';
import { getPendingQueueCount } from '../../utils/offlineQueue';

export default function OfficerSidebar({
  activeView,
  onNavigate,
  user,
  onLogout,
  onGoToPublicSite,
  pendingCount = 0
}) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'new_inspection', label: 'New Inspection', icon: PlusCircle, highlight: true },
    { id: 'ecommerce', label: 'E-Commerce Audit', icon: ShoppingBag },
    { id: 'active_inspections', label: 'Active Inspections', icon: Clock },
    { id: 'history', label: 'Inspection History', icon: History },
    { id: 'product_history', label: 'Product History', icon: Package },
    { id: 'findings', label: 'Compliance Findings', icon: AlertTriangle },
    { id: 'rules_versions', label: 'Rules & Versions', icon: BookOpen },
    { id: 'reports', label: 'Reports', icon: FileCheck },
    { id: 'evidence', label: 'Evidence Records', icon: Shield },
    { id: 'offline_queue', label: 'Offline Queue', icon: WifiOff, badge: pendingCount > 0 ? pendingCount : null }
  ];

  return (
    <aside style={{
      width: '260px',
      backgroundColor: 'var(--bg-navy)',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      minHeight: '100vh',
      borderRight: '1px solid var(--border-dark)'
    }}>
      {/* Brand Header */}
      <div style={{
        padding: '20px 20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center'
      }}>
        <LabelGuardLogo size={34} color="var(--primary)" textColor="#ffffff" showText={true} />
      </div>


      {/* Menu List */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: isActive
                  ? 'rgba(255, 255, 255, 0.12)'
                  : item.highlight && activeView !== item.id
                    ? 'rgba(37, 99, 235, 0.15)'
                    : 'transparent',
                color: isActive
                  ? '#ffffff'
                  : item.highlight
                    ? '#93c5fd'
                    : '#cbd5e1',
                fontSize: '0.86rem',
                fontWeight: isActive || item.highlight ? '600' : '500',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon size={17} color={isActive ? '#ffffff' : item.highlight ? '#93c5fd' : '#94a3b8'} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span style={{
                  fontSize: '0.7rem',
                  backgroundColor: 'var(--status-review-text)',
                  color: '#ffffff',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  fontWeight: '700'
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Officer Profile & Logout */}
      <div style={{
        padding: '16px 14px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        backgroundColor: 'rgba(0, 0, 0, 0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#93c5fd'
          }}>
            <UserIcon size={16} />
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user?.fullName || user?.username || 'Officer'}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user?.department || 'Legal Metrology Officer'}
            </div>
          </div>
        </div>

        {/* Public Website Link */}
        {onGoToPublicSite && (
          <button
            onClick={onGoToPublicSite}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'transparent',
              color: '#94a3b8',
              fontSize: '0.78rem',
              cursor: 'pointer',
              marginBottom: '6px',
              transition: 'background-color 0.15s ease'
            }}
          >
            <Globe2 size={13} /> Public Site
          </button>
        )}

        <button
          onClick={onLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '8px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            background: 'transparent',
            color: '#cbd5e1',
            fontSize: '0.8rem',
            cursor: 'pointer',
            transition: 'background-color 0.15s ease'
          }}
        >
          <LogOut size={14} /> Log Out
        </button>
      </div>
    </aside>
  );
}

