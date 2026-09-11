import React, { useState } from 'react';
import {
  ShieldCheck, CheckCircle2, AlertTriangle, AlertOctagon, XCircle, ArrowRight,
  ArrowLeft, HelpCircle, Save, Loader2
} from 'lucide-react';
import axios from 'axios';
import StatusBadge from '../../common/StatusBadge';

export default function Step5Verification({
  token,
  inspection,
  onVerificationSaved,
  onBack
}) {
  const complianceResults = inspection?.complianceResults || {};
  const rules = complianceResults.results || [];

  // Initialize verification state for each rule
  const [decisions, setDecisions] = useState(() => {
    const init = {};
    rules.forEach((r) => {
      init[r.id] = {
        ruleId: r.ruleId,
        field: r.ruleName,
        decision: r.status === 'COMPLIANT_CANDIDATE' ? 'CONFIRMED' : 'PENDING',
        remarks: ''
      };
    });
    return init;
  });

  const [generalRemarks, setGeneralRemarks] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleDecisionChange = (id, decision) => {
    setDecisions(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        decision
      }
    }));
  };

  const handleRemarksChange = (id, remarks) => {
    setDecisions(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        remarks
      }
    }));
  };

  const handleSaveVerification = async () => {
    setSaving(true);
    try {
      const verificationsPayload = Object.values(decisions).map(d => ({
        ruleId: d.ruleId,
        field: d.field,
        officerDecision: d.decision,
        remarks: d.remarks
      }));

      const res = await axios.patch(
        `/api/v1/products/${inspection._id}/verify`,
        {
          verifications: verificationsPayload,
          remarks: generalRemarks,
          status: 'VERIFIED'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSaveSuccess(true);
      if (onVerificationSaved) {
        onVerificationSaved(res.data.data);
      }
    } catch (err) {
      console.error('Failed to save officer verification:', err);
      alert('Failed to save officer verification to server. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
            Step 4: Officer Human-in-the-Loop Verification
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Review AI declaration findings and applicable LMPC 2011 requirements. Confirm, dismiss, or request recapture for statutory records.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Rule Version:</span>
          <span style={{ fontSize: '0.85rem', fontWeight: '700', fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
            {inspection?.ruleVersion?.version || 'LMPC-2011.A2024'}
          </span>
        </div>
      </div>

      {/* Rules Findings Ledger */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
        {rules.map((rule) => {
          const currentDecision = decisions[rule.id]?.decision || 'PENDING';
          const isIssue = rule.status === 'POTENTIAL_NON_COMPLIANCE' || rule.status === 'CONFLICTING_DECLARATION' || rule.status === 'NEEDS_OFFICER_VERIFICATION';

          return (
            <div
              key={rule.id}
              className="card-institutional"
              style={{
                padding: '24px',
                borderLeft: isIssue ? '4px solid var(--status-review-text)' : '4px solid var(--status-pass-text)'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
                      {rule.ruleId}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>• {rule.applicability}</span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '2px' }}>
                    {rule.ruleName}
                  </h3>
                </div>

                <StatusBadge status={rule.status} label={rule.statusLabel} />
              </div>

              {/* Observed vs Statutory Expectation */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr',
                gap: '16px',
                backgroundColor: 'var(--bg-subtle)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '14px',
                fontSize: '0.86rem'
              }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600', display: 'block' }}>
                    Extracted Declaration / Observed Evidence:
                  </span>
                  <strong style={{ color: 'var(--text-primary)', fontSize: '0.92rem' }}>
                    {rule.extractedValue}
                  </strong>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {rule.explanation}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600', display: 'block' }}>
                    Statutory Expectation:
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {rule.requirement}
                  </span>
                </div>
              </div>

              {/* Officer Verification Action Panel */}
              <div style={{
                paddingTop: '12px',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                {/* Streamlined Context-Aware Officer Action Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
                    Action:
                  </span>

                  {/* Context-aware primary button */}
                  {rule.status === 'COMPLIANT_CANDIDATE' ? (
                    <button
                      onClick={() => handleDecisionChange(rule.id, 'CONFIRMED')}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.78rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        border: currentDecision === 'CONFIRMED' ? '1px solid var(--status-pass-border)' : '1px solid var(--border-subtle)',
                        backgroundColor: currentDecision === 'CONFIRMED' ? 'var(--status-pass-bg)' : '#ffffff',
                        color: 'var(--status-pass-text)'
                      }}
                    >
                      {currentDecision === 'CONFIRMED' ? '✓ ' : ''}Accept Assessment
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDecisionChange(rule.id, 'CONFIRMED')}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.78rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        border: currentDecision === 'CONFIRMED' ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                        backgroundColor: currentDecision === 'CONFIRMED' ? 'var(--primary-subtle)' : '#ffffff',
                        color: 'var(--primary)'
                      }}
                    >
                      {currentDecision === 'CONFIRMED' ? '✓ ' : ''}Confirm Finding
                    </button>
                  )}

                  {/* Secondary Dismiss Button */}
                  <button
                    onClick={() => handleDecisionChange(rule.id, 'DISMISSED')}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.78rem',
                      fontWeight: currentDecision === 'DISMISSED' ? '700' : '500',
                      cursor: 'pointer',
                      border: currentDecision === 'DISMISSED' ? '1px solid var(--border-medium)' : '1px solid var(--border-subtle)',
                      backgroundColor: currentDecision === 'DISMISSED' ? 'var(--bg-subtle)' : '#ffffff',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {currentDecision === 'DISMISSED' ? '✓ ' : ''}Dismiss (False Positive)
                  </button>

                  {/* More Actions Dropdown Select */}
                  <select
                    value={['REQUEST_RECAPTURE', 'NOT_ASSESSABLE'].includes(currentDecision) ? currentDecision : ''}
                    onChange={(e) => e.target.value && handleDecisionChange(rule.id, e.target.value)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.78rem',
                      fontWeight: '500',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: ['REQUEST_RECAPTURE', 'NOT_ASSESSABLE'].includes(currentDecision) ? 'var(--primary-subtle)' : '#ffffff',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">More Actions ▾</option>
                    <option value="REQUEST_RECAPTURE">Request Recapture</option>
                    <option value="NOT_ASSESSABLE">Mark Not Assessable</option>
                  </select>
                </div>


                {/* Optional Field Remarks */}
                <input
                  type="text"
                  placeholder="Officer remarks / legal justification..."
                  className="input-institutional"
                  style={{ maxWidth: '300px', fontSize: '0.8rem', padding: '6px 10px' }}
                  value={decisions[rule.id]?.remarks || ''}
                  onChange={(e) => handleRemarksChange(rule.id, e.target.value)}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* General Officer Notes */}
      <div className="card-institutional" style={{ padding: '20px', marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
          Overall Officer Finding & Inspection Remarks
        </label>
        <textarea
          rows={2}
          className="input-institutional"
          placeholder="Enter formal inspection conclusion, seizure recommendations, or dealer notice remarks..."
          value={generalRemarks}
          onChange={(e) => setGeneralRemarks(e.target.value)}
        />
      </div>

      {/* Navigation & Save Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
        <button onClick={onBack} className="btn-secondary">
          <ArrowLeft size={16} /> Back to Evidence Map
        </button>

        <button
          onClick={handleSaveVerification}
          className="btn-primary"
          disabled={saving}
          style={{ padding: '10px 24px' }}
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          <span>Save Verification & Generate Report</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

