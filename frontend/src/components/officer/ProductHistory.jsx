import React, { useEffect, useState } from 'react';
import { Package, Search, ArrowRight, History, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import axios from 'axios';
import EmptyState from '../common/EmptyState';
import StatusBadge from '../common/StatusBadge';

export default function ProductHistory({
  token,
  onSelectInspection,
  onNewInspection
}) {
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchInspections();
  }, []);

  const fetchInspections = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/v1/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInspections(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load inspections for product history:', err);
    } finally {
      setLoading(false);
    }
  };

  // Group inspections by normalized product name + manufacturer
  const productGroups = {};
  inspections.forEach((insp) => {
    const rawName = insp.structuredData?.productName?.value;
    const rawMfg = Array.isArray(insp.structuredData?.manufacturer)
      ? insp.structuredData.manufacturer[0]?.value
      : insp.structuredData?.manufacturer?.value || insp.structuredData?.manufacturer;

    const groupKey = (rawName && String(rawName).trim().length > 0)
      ? String(rawName).trim().toLowerCase()
      : `Unidentified Product (${insp.context?.category || 'General'})`;

    if (!productGroups[groupKey]) {
      productGroups[groupKey] = {
        name: rawName || insp.context?.category || 'Unspecified Commodity',
        manufacturer: rawMfg || 'Manufacturer unverified',
        inspections: []
      };
    }
    productGroups[groupKey].inspections.push(insp);
  });

  const groupList = Object.values(productGroups).filter((g) => {
    const term = search.toLowerCase();
    return g.name.toLowerCase().includes(term) || g.manufacturer.toLowerCase().includes(term);
  });

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            Product Identity History
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Inspections grouped by established brand and product identity to track repeat compliance trends.
          </p>
        </div>
      </div>

      {/* Search Filter */}
      <div style={{ position: 'relative', marginBottom: '24px', maxWidth: '480px' }}>
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          type="text"
          className="input-institutional"
          style={{ paddingLeft: '38px', fontSize: '0.86rem' }}
          placeholder="Filter by product name or manufacturer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 12px', color: 'var(--primary)' }} />
          <p style={{ fontSize: '0.88rem' }}>Aggregating product history records...</p>
        </div>
      ) : groupList.length === 0 ? (
        <EmptyState
          title="No product history available"
          description="Start an inspection to begin establishing historical product identity records."
          actionLabel="Start New Inspection"
          onAction={onNewInspection}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {groupList.map((grp, idx) => (
            <div key={idx} className="card-institutional" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <Package size={18} color="var(--primary)" />
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {grp.name}
                    </h3>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Manufacturer / Packer: <strong>{grp.manufacturer}</strong>
                  </div>
                </div>

                <span className="badge-status badge-info" style={{ fontSize: '0.72rem' }}>
                  {grp.inspections.length} Total Audit{grp.inspections.length > 1 ? 's' : ''}
                </span>
              </div>

              {/* Sub-table of historical inspections for this product */}
              <table className="table-institutional">
                <thead>
                  <tr>
                    <th>Inspection ID</th>
                    <th>Date</th>
                    <th>Observed Net Qty</th>
                    <th>Observed MRP</th>
                    <th>Assessed Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {grp.inspections.map((insp) => (
                    <tr key={insp._id}>
                      <td className="text-mono" style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--primary)' }}>
                        {insp.inspectionId}
                      </td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {new Date(insp.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ fontSize: '0.82rem' }}>
                        {insp.structuredData?.netQuantity?.value ? `${insp.structuredData.netQuantity.value} ${insp.structuredData.netQuantity.unit || ''}` : 'N/A'}
                      </td>
                      <td style={{ fontSize: '0.82rem' }}>
                        {insp.structuredData?.mrp?.value ? `₹ ${insp.structuredData.mrp.value}` : 'N/A'}
                      </td>
                      <td>
                        <StatusBadge status={insp.status} size="small" />
                      </td>
                      <td>
                        <button
                          onClick={() => onSelectInspection(insp)}
                          className="btn-secondary"
                          style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                        >
                          View Record
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

