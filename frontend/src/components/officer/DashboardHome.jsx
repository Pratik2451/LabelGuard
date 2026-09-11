import React, { useEffect, useState } from 'react';
import {
  FileText, CheckCircle2, AlertTriangle, AlertOctagon, PlusCircle, History,
  BookOpen, ArrowRight, Clock, ShieldCheck, Loader2, TrendingUp, PieChart, BarChart2
} from 'lucide-react';
import axios from 'axios';
import EmptyState from '../common/EmptyState';
import StatusBadge from '../common/StatusBadge';

export default function DashboardHome({
  token,
  user,
  onNavigate,
  onSelectInspection
}) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get('/api/v1/products/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data.data);
    } catch (err) {
      console.error('Failed to load dashboard statistics:', err);
      setError('Unable to retrieve dashboard data from inspection service.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 16px', color: 'var(--primary)' }} />
        <p style={{ fontSize: '0.92rem' }}>Retrieving officer inspection ledger from database...</p>
      </div>
    );
  }

  const total = stats?.totalInspections || 0;
  const completed = stats?.completedCount || 0;
  const pendingReview = stats?.pendingReviewCount || 0;
  const potentialNonCompliance = stats?.potentialNonComplianceCount || 0;
  const recentInspections = stats?.recentInspections || [];
  const categoryStats = stats?.categoryStats || [];
  const timelineStats = stats?.timelineStats || [];
  const violationStats = stats?.violationStats || [];
  const statusDistribution = stats?.statusDistribution || [];

  // Max value for scaling SVG timeline line chart
  const maxTimelineCount = Math.max(1, ...timelineStats.map(t => t.count));
  // Max value for scaling bar chart
  const maxViolationCount = Math.max(1, ...violationStats.map(v => v.count));

  return (
    <div style={{ padding: '32px' }}>
      {/* Welcome Banner */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px 28px',
        marginBottom: '28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <ShieldCheck size={20} color="var(--primary)" />
            <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-primary)' }}>
              Legal Metrology Officer Workstation
            </h2>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Logged in as <strong>{user?.fullName || user?.username}</strong> • {user?.department || 'Legal Metrology Inspection Division'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => onNavigate('new_inspection')} className="btn-primary">
            <PlusCircle size={16} /> New Inspection
          </button>
        </div>
      </div>

      {/* Real Statistics 4-Card Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        {/* Total Inspections */}
        <div className="card-institutional" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Total Inspections
            </span>
            <FileText size={18} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
            {total}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Real records in database
          </div>
        </div>

        {/* Completed Inspections */}
        <div className="card-institutional" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--status-pass-text)', textTransform: 'uppercase' }}>
              Completed / Verified
            </span>
            <CheckCircle2 size={18} color="var(--status-pass-text)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--status-pass-text)', fontFamily: 'var(--font-mono)' }}>
            {completed}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Officer verified records
          </div>
        </div>

        {/* Needs Review */}
        <div className="card-institutional" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--status-review-text)', textTransform: 'uppercase' }}>
              Needs Review
            </span>
            <AlertTriangle size={18} color="var(--status-review-text)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--status-review-text)', fontFamily: 'var(--font-mono)' }}>
            {pendingReview}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Pending officer action
          </div>
        </div>

        {/* Potential Non-Compliances */}
        <div className="card-institutional" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--status-fail-text)', textTransform: 'uppercase' }}>
              Potential Non-Compliance
            </span>
            <AlertOctagon size={18} color="var(--status-fail-text)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--status-fail-text)', fontFamily: 'var(--font-mono)' }}>
            {potentialNonCompliance}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Flagged rule violations
          </div>
        </div>
      </div>

      {/* REAL-DATA ANALYTICS SECTION */}
      {total > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', marginBottom: '32px' }}>
          {/* Chart 1: Inspections Over Time (Real SVG Line / Points Chart) */}
          <div className="card-institutional" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <TrendingUp size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                Inspections Activity Timeline
              </h3>
            </div>

            {timelineStats.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No historical timeline recorded yet.</p>
            ) : (
              <div>
                <div style={{ height: '160px', width: '100%', position: 'relative', display: 'flex', alignItems: 'flex-end', gap: '14px', paddingTop: '20px' }}>
                  {timelineStats.map((item, idx) => {
                    const heightPercent = Math.max(15, (item.count / maxTimelineCount) * 100);
                    return (
                      <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>
                          {item.count}
                        </span>
                        <div style={{
                          width: '100%',
                          maxWidth: '36px',
                          height: `${heightPercent}%`,
                          backgroundColor: 'var(--primary)',
                          borderRadius: '4px 4px 0 0',
                          opacity: 0.85
                        }} />
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '6px', whiteSpace: 'nowrap' }}>
                          {item._id.substring(5)}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '8px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  <span>Aggregated by date from inspection database</span>
                  <span>Max: {maxTimelineCount} scans / day</span>
                </div>
              </div>
            )}
          </div>

          {/* Chart 2: Compliance Status Distribution (Real Donut / Progress Distribution) */}
          <div className="card-institutional" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <PieChart size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                Compliance Status Distribution
              </h3>
            </div>

            {statusDistribution.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No distribution data available.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {statusDistribution.map((s, idx) => {
                  const pct = Math.round((s.count / total) * 100);
                  return (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                        <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{s.label}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                          {s.count} ({pct}%)
                        </span>
                      </div>
                      <div style={{ height: '8px', backgroundColor: 'var(--bg-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${pct}%`,
                          backgroundColor: s.color,
                          borderRadius: '4px'
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Grid: Recent Inspections & Rule Findings Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.1fr', gap: '28px' }}>
        {/* Recent Inspections Table */}
        <div className="card-institutional" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Recent Inspections
            </h3>
            {recentInspections.length > 0 && (
              <button
                onClick={() => onNavigate('history')}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                View All <ArrowRight size={14} />
              </button>
            )}
          </div>

          {recentInspections.length === 0 ? (
            <EmptyState
              title="No inspections recorded yet"
              description="Start a new inspection to begin building the official Legal Metrology inspection record."
              actionLabel="Start New Inspection"
              onAction={() => onNavigate('new_inspection')}
            />
          ) : (
            <table className="table-institutional">
              <thead>
                <tr>
                  <th>Inspection ID</th>
                  <th>Commodity / Product</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentInspections.map((item) => {
                  const pName = item.structuredData?.productName?.value || item.context?.category || 'Unspecified Commodity';
                  return (
                    <tr key={item._id}>
                      <td className="text-mono" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--primary)' }}>
                        {item.inspectionId}
                      </td>
                      <td style={{ fontWeight: '600' }}>
                        {pName}
                      </td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <StatusBadge status={item.status} size="small" />
                      </td>
                      <td>
                        <button
                          onClick={() => onSelectInspection(item)}
                          className="btn-secondary"
                          style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Real Rule Violations Breakdown / Categories */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Rule Violation Breakdown */}
          <div className="card-institutional" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <BarChart2 size={18} color="var(--status-fail-text)" />
              <h3 style={{ fontSize: '1.02rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                Frequent Statutory Findings
              </h3>
            </div>

            {violationStats.length === 0 ? (
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                No statutory non-compliances flagged in current database records.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {violationStats.map((v, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '3px' }}>
                      <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>
                        {v._id} ({v.ruleName?.substring(0, 26)}...)
                      </span>
                      <span style={{ fontWeight: '700', color: 'var(--status-fail-text)' }}>{v.count}</span>
                    </div>
                    <div style={{ height: '6px', backgroundColor: 'var(--bg-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${Math.round((v.count / maxViolationCount) * 100)}%`,
                        backgroundColor: 'var(--status-fail-text)',
                        borderRadius: '3px'
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions Panel */}
          <div className="card-institutional" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.02rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '14px' }}>
              Quick Actions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => onNavigate('new_inspection')}
                className="btn-primary"
                style={{ justifyContent: 'flex-start', padding: '10px 14px', fontSize: '0.85rem' }}
              >
                <PlusCircle size={15} />
                <span>Start New Inspection</span>
              </button>

              <button
                onClick={() => onNavigate('ecommerce')}
                className="btn-secondary"
                style={{ justifyContent: 'flex-start', padding: '10px 14px', fontSize: '0.85rem' }}
              >
                <FileText size={15} />
                <span>E-Commerce Listing Audit</span>
              </button>

              <button
                onClick={() => onNavigate('history')}
                className="btn-secondary"
                style={{ justifyContent: 'flex-start', padding: '10px 14px', fontSize: '0.85rem' }}
              >
                <History size={15} />
                <span>Browse Inspection Ledger</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
