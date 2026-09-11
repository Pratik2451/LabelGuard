import React, { useState } from 'react';
import { BookOpen, Search, ShieldCheck, Tag, ExternalLink } from 'lucide-react';
import { CURRENT_RULE_VERSION } from '../../utils/complianceEngine';

export default function RulesPublicPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const rulesCatalog = [
    {
      ruleId: 'Rule 6(1)(a)',
      title: 'Manufacturer / Packer / Importer Details',
      category: 'Identity',
      requirement: 'Name and complete address of the manufacturer, packer, or importer must be clearly declared.',
      applicability: 'All Packaged Commodities',
      source: 'LMPC Rules 2011',
      version: CURRENT_RULE_VERSION.version,
      status: 'Active Law',
      notes: 'Information panel or back panel declaration permissible if PDP has space constraints.'
    },
    {
      ruleId: 'Rule 6(1)(b)',
      title: 'Country of Origin',
      category: 'Origin',
      requirement: 'For imported goods, the name of the country of origin must be prominently stated. For domestic goods, domestic origin is determined by address and state/PIN.',
      applicability: 'Mandatory for Imported Products; Domestic Identified via Address',
      source: 'LMPC Rules 2011 & 2017 Amendment',
      version: CURRENT_RULE_VERSION.version,
      status: 'Active Law',
      notes: 'Must not use ambiguous wording such as "Made Globally".'
    },
    {
      ruleId: 'Rule 6(1)(c)',
      title: 'Common or Generic Commodity Name',
      category: 'Identification',
      requirement: 'Generic or common name of the packaged commodity must be declared on the Principal Display Panel.',
      applicability: 'Principal Display Panel (PDP) of all packages',
      source: 'LMPC Rules 2011',
      version: CURRENT_RULE_VERSION.version,
      status: 'Active Law',
      notes: 'Must not be superseded by brand trademarks in a way that obscures commodity nature.'
    },
    {
      ruleId: 'Rule 6(1)(d)',
      title: 'Net Quantity Declaration',
      category: 'Quantity',
      requirement: 'Net weight, volume, or measure of content declared in standard SI units (g, kg, ml, l, or count N).',
      applicability: 'Principal Display Panel (PDP)',
      source: 'LMPC Rules 2011 & Second Schedule',
      version: CURRENT_RULE_VERSION.version,
      status: 'Active Law',
      notes: 'Non-standard symbols (e.g. gms, kgs, ltr) are non-compliant; standard SI symbols required.'
    },
    {
      ruleId: 'Rule 6(1)(e)',
      title: 'Maximum Retail Price (MRP)',
      category: 'Pricing',
      requirement: 'Maximum retail sale price inclusive of all taxes must be declared (e.g. "MRP ₹ xx.xx (incl. of all taxes)"). Dual-pricing across retail formats prohibited.',
      applicability: 'All Retail Packaged Commodities',
      source: 'LMPC Rules 2011',
      version: CURRENT_RULE_VERSION.version,
      status: 'Active Law',
      notes: 'Discrepant MRP values across package surfaces trigger potential non-compliance.'
    },
    {
      ruleId: 'Rule 6(1)(f)',
      title: 'Date of Manufacture / Packing',
      category: 'Dates',
      requirement: 'Month and year of manufacture or packing must be declared (MM/YYYY or DD/MM/YYYY).',
      applicability: 'All Packaged Commodities',
      source: 'LMPC Rules 2011',
      version: CURRENT_RULE_VERSION.version,
      status: 'Active Law',
      notes: 'May be printed on information panel or stamped/debossed in batch coding area.'
    },
    {
      ruleId: 'Rule 6(1)(h)',
      title: 'Consumer Care Contact Details',
      category: 'Consumer Rights',
      requirement: 'Name, address, telephone number, or email address of the person/office to be contacted for consumer grievances.',
      applicability: 'All Packaged Commodities',
      source: 'LMPC Rules 2011',
      version: CURRENT_RULE_VERSION.version,
      status: 'Active Law',
      notes: 'Both telephone helpline and email address are recommended for full compliance.'
    },
    {
      ruleId: 'Rule 9 / Table 1',
      title: 'Numeral and Letter Height Standards',
      category: 'Readability',
      requirement: 'Minimum font height of numerals and letters based on Principal Display Panel area and net quantity.',
      applicability: 'Principal Display Panel Declarations',
      source: 'LMPC First Schedule (Table 1)',
      version: CURRENT_RULE_VERSION.version,
      status: 'Active Law',
      notes: 'Cannot be determined accurately from ordinary optical photography without calibrated millimeter reference.'
    }
  ];

  const filtered = rulesCatalog.filter((r) => {
    const term = search.toLowerCase();
    const matchSearch = r.ruleId.toLowerCase().includes(term) ||
                        r.title.toLowerCase().includes(term) ||
                        r.requirement.toLowerCase().includes(term);
    const matchCat = categoryFilter === 'ALL' || r.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div style={{ backgroundColor: '#ffffff' }}>
      {/* Banner */}
      <div style={{
        backgroundColor: 'var(--bg-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '54px 24px 48px'
      }}>
        <div className="container-max">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Statutory Reference Framework
              </span>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '8px', marginBottom: '12px' }}>
                Legal Metrology Rules Repository
              </h1>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '720px', lineHeight: 1.6 }}>
                Legal Metrology (Packaged Commodities) Rules, 2011 as structured for automated assistive inspection.
              </p>
            </div>

            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 18px',
              textAlign: 'right'
            }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Active Rule Set</div>
              <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>{CURRENT_RULE_VERSION.version}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Effective: {CURRENT_RULE_VERSION.effectiveDate}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-max" style={{ padding: '48px 24px 80px' }}>
        {/* Filter & Search Bar */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="input-institutional"
              style={{ paddingLeft: '42px' }}
              placeholder="Search rule ID, title, or requirement text..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {['ALL', 'Identity', 'Origin', 'Quantity', 'Pricing', 'Dates', 'Consumer Rights'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.82rem',
                  fontWeight: categoryFilter === cat ? '600' : '500',
                  cursor: 'pointer',
                  border: categoryFilter === cat ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                  backgroundColor: categoryFilter === cat ? 'var(--primary-subtle)' : '#ffffff',
                  color: categoryFilter === cat ? 'var(--primary)' : 'var(--text-secondary)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Rules Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filtered.map((rule) => (
            <div key={rule.ruleId} className="card-institutional" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <span style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                    {rule.ruleId}
                  </span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '2px' }}>
                    {rule.title}
                  </h3>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span className="badge-status badge-info" style={{ fontSize: '0.7rem' }}>
                    {rule.category}
                  </span>
                  <span className="badge-status badge-pass" style={{ fontSize: '0.7rem' }}>
                    {rule.status}
                  </span>
                </div>
              </div>

              <div style={{
                backgroundColor: 'var(--bg-subtle)',
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem',
                color: 'var(--text-primary)',
                marginBottom: '14px',
                lineHeight: 1.6
              }}>
                <strong style={{ color: 'var(--text-secondary)' }}>Statutory Requirement: </strong>
                {rule.requirement}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <div>
                  <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Applicability: </span>
                  {rule.applicability}
                </div>
                <div>
                  <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Source Reference: </span>
                  {rule.source}
                </div>
                <div>
                  <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Inspection Note: </span>
                  {rule.notes}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

