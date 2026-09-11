import React, { useEffect, useState } from 'react';
import { AlertTriangle, AlertOctagon, ArrowRight, Loader2, FileText, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import EmptyState from '../common/EmptyState';
import StatusBadge from '../common/StatusBadge';

export default function FindingsSummary({
  token,
  onSelectInspection,
  onNewInspection
}) {
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFindings();
  }, []);

  const fetchFindings = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/v1/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInspections(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load findings:', err);
    } finally {
      setLoading(false);
    }
  };

  // Extract all findings with issues across all inspections
  const allFindings = [];
  inspections.forEach((insp) => {
    const results = insp.complianceResults?.results || [];
    results.forEach((r) => {
      if (r.status === 'POTENTIAL_NON_COMPLIANCE' || r.status === 'CONFLICTING_DECLARATION' || r.status === 'NEEDS_OFFICER_VERIFICATION') {
        allFindings.push({
          ...r,
          inspection: insp
        });
      }
    });

    // Also include cross-view conflicts
    const conflicts = insp.crossViewConflicts || [];
    conflicts.forEach((c) => {
      allFindings.push({
        id: c.id,
        ruleId: 'Cross-Surface',
        ruleName: c.field,
        status: 'CONFLICTING_DECLARATION',
        statusLabel: 'Conflicting Declaration',
        extractedValue: `${c.surface1} vs ${c.surface2}`,
        explanation: c.description,
        inspection: insp
      });
    });
  });

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)' }}>
          Compliance Findings Audit
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Aggregated list of potential statutory non-compliances and declarations requiring officer verification.
        </p>
      </div>

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 12px', color: 'var(--primary)' }} />
          <p style={{ fontSize: '0.88rem' }}>Loading findings from database...</p>
        </div>
      ) : allFindings.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="No compliance findings recorded"
          description="There are currently no flagged potential non-compliances across your inspection records."
          actionLabel="Start New Inspection"
          onAction={onNewInspection}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {allFindings.map((finding, idx) => (
            <div
              key={idx}
              className="card-institutional"
              style={{
                padding: '20px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderLeft: finding.status === 'CONFLICTING_DECLARATION' ? '4px solid var(--status-fail-text)' : '4px solid var(--status-review-text)'
              }}
            >
              <div style={{ flex: 1, paddingRight: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <span className="text-mono" style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--primary)' }}>
                    {finding.ruleId}
                  </span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>• Inspection ID: <strong>{finding.inspection.inspectionId}</strong></span>
                  <StatusBadge status={finding.status} label={finding.statusLabel} size="small" />
                </div>

                <h4 style={{ fontSize: '0.98rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {finding.ruleName}
                </h4>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {finding.explanation}
                </p>
              </div>

              <div>
                <button
                  onClick={() => onSelectInspection(finding.inspection)}
                  className="btn-secondary"
                  style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                >
                  Review Record <ArrowRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

