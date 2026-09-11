import React from 'react';
import { ArrowRight, Tag, MapPin, Globe, Calendar, FileText } from 'lucide-react';

export default function Step1Context({ contextData, setContextData, onNext }) {
  const categories = [
    'Packaged Food & Snacks',
    'Beverages & Juices',
    'Cosmetics & Personal Care',
    'Pharmaceuticals & OTC',
    'Electronics & IT Hardware',
    'Cleaning & Household Goods',
    'General Merchandise'
  ];

  const inspectionTypes = [
    'Retail Market Surveillance',
    'Distributor / Warehouse Audit',
    'Port / Import Clearance',
    'Routine Statutory Inspection',
    'Consumer Grievance Investigation'
  ];

  const origins = ['Domestic', 'Imported'];

  const isValid = contextData.category && contextData.inspectionType && contextData.location;

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
          Step 1: Inspection Context
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Specify statutory inspection parameters. Context dictates applicable Legal Metrology rules and mandatory declaration requirements.
        </p>
      </div>

      <div className="card-institutional" style={{ padding: '28px', maxWidth: '800px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          {/* Category */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Commodity Category *
            </label>
            <select
              className="input-institutional"
              value={contextData.category}
              onChange={(e) => setContextData({ ...contextData, category: e.target.value })}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Inspection Type */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Inspection Type *
            </label>
            <select
              className="input-institutional"
              value={contextData.inspectionType}
              onChange={(e) => setContextData({ ...contextData, inspectionType: e.target.value })}
            >
              {inspectionTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          {/* Origin */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Manufacture / Origin *
            </label>
            <select
              className="input-institutional"
              value={contextData.originType}
              onChange={(e) => setContextData({ ...contextData, originType: e.target.value })}
            >
              {origins.map((o) => (
                <option key={o} value={o}>{o} Commodity</option>
              ))}
            </select>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
              {contextData.originType === 'Imported'
                ? 'Mandatory: Importer address & Country of Origin declaration required.'
                : 'Domestic: Presumes domestic origin based on Indian manufacturing address.'}
            </span>
          </div>

          {/* Location */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Inspection Location / Retailer / Jurisdiction *
            </label>
            <input
              type="text"
              required
              className="input-institutional"
              placeholder="e.g. Metro Mart, Sector 18, Noida"
              value={contextData.location}
              onChange={(e) => setContextData({ ...contextData, location: e.target.value })}
            />
          </div>
        </div>

        {/* Notes */}
        <div style={{ marginBottom: '28px' }}>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            Officer Inspection Notes (Optional)
          </label>
          <textarea
            rows={2}
            className="input-institutional"
            placeholder="Special circumstances, dealer license number, initial physical observations..."
            value={contextData.notes}
            onChange={(e) => setContextData({ ...contextData, notes: e.target.value })}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onNext}
            className="btn-primary"
            disabled={!isValid}
            style={{ padding: '10px 24px' }}
          >
            <span>Proceed to Surface Capture</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

