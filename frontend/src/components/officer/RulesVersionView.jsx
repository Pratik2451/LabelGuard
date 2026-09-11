import React, { useEffect, useState } from 'react';
import { BookOpen, Calendar, ShieldCheck, Tag, Loader2 } from 'lucide-react';
import axios from 'axios';
import { CURRENT_RULE_VERSION } from '../../utils/complianceEngine';

export default function RulesVersionView({ token }) {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/v1/products/rules/catalog');
      setRules(res.data?.data?.rules || []);
    } catch (err) {
      console.error('Failed to load rules catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            Rules & Versioned Statutory Sets
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Legal Metrology (Packaged Commodities) Rules, 2011 version repository configured for compliance evaluation.
          </p>
        </div>

        {/* Version Badge */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 18px',
          textAlign: 'right'
        }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Active Rule Version</div>
          <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
            {CURRENT_RULE_VERSION.version}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Effective: {CURRENT_RULE_VERSION.effectiveDate}</div>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 12px', color: 'var(--primary)' }} />
          <p style={{ fontSize: '0.88rem' }}>Loading statutory rule sets...</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {rules.map((rule) => (
            <div key={rule.ruleId} className="card-institutional" style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <span className="text-mono" style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--primary)' }}>
                    {rule.ruleId}
                  </span>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '2px' }}>
                    {rule.title}
                  </h3>
                </div>
                <span className="badge-status badge-pass" style={{ fontSize: '0.7rem' }}>
                  {rule.status}
                </span>
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '12px' }}>
                {rule.requirement}
              </p>

              <div style={{ display: 'flex', gap: '20px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <span>Applicability: <strong style={{ color: 'var(--text-secondary)' }}>{rule.applicability}</strong></span>
                <span>Source: <strong style={{ color: 'var(--text-secondary)' }}>{rule.source}</strong></span>
                <span>Version: <strong className="text-mono" style={{ color: 'var(--primary)' }}>{rule.version}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

