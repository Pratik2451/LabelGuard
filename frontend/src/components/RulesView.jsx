import React from 'react';
import { BookOpen, CheckCircle, Scale, Tag, Calendar, Phone, Globe, Building } from 'lucide-react';

export default function RulesView() {
  const rules = [
    {
      rule: 'Rule 6(1)(a) - Manufacturer / Packer / Importer',
      icon: Building,
      desc: 'Name and complete address of the manufacturer, packer, or importer must be prominently printed on the principal display panel.',
      mandatory: true
    },
    {
      rule: 'Rule 6(1)(b) - Country of Origin',
      icon: Globe,
      desc: 'For imported products, the country of origin must be clearly stated on the package label.',
      mandatory: true
    },
    {
      rule: 'Rule 6(1)(c) - Common / Generic Name',
      icon: Tag,
      desc: 'The generic or common name of the commodity contained inside the package must be explicitly mentioned.',
      mandatory: true
    },
    {
      rule: 'Rule 6(1)(d) - Net Quantity',
      icon: Scale,
      desc: 'Net weight, volume, or measure of content expressed in standard SI units (g, kg, ml, l). Numbers and units must adhere to size guidelines.',
      mandatory: true
    },
    {
      rule: 'Rule 6(1)(e) - Maximum Retail Price (MRP)',
      icon: Tag,
      desc: 'MRP in Indian Rupees inclusive of all taxes must be declared in the standard format (e.g. "MRP ₹ xx.xx (incl. of all taxes)").',
      mandatory: true
    },
    {
      rule: 'Rule 6(1)(f) - Month & Year of Mfg / Packing',
      icon: Calendar,
      desc: 'Month and year of manufacture, packing, or import must be printed on the label (e.g. MM/YYYY or DD/MM/YYYY).',
      mandatory: true
    },
    {
      rule: 'Rule 6(1)(h) - Consumer Care Details',
      icon: Phone,
      desc: 'Name, address, telephone number, or email address of the person or office to be contacted in case of consumer complaints.',
      mandatory: true
    }
  ];

  return (
    <div style={{ maxWidth: '1100px', margin: '36px auto', padding: '0 24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <BookOpen size={24} color="var(--accent-purple-light)" />
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff' }}>
            Indian Legal Metrology Compliance Rules
          </h2>
        </div>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
          Reference guide for Legal Metrology (Packaged Commodities) Rules, 2011 (LMPC Rules).
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {rules.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="panel-outlined panel-outlined-hover" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-purple-light)' }}>
                  <Icon size={20} />
                  <span className="badge-futuristic badge-purple">Standard Rule</span>
                </div>
                <span className="badge-futuristic badge-pass">Mandatory</span>
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '8px', color: '#fff' }}>
                {item.rule}
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
