import React, { useEffect, useState } from 'react';
import { Search, Filter, Calendar, ArrowRight, Loader2, FileText, PlusCircle } from 'lucide-react';
import axios from 'axios';
import EmptyState from '../common/EmptyState';
import StatusBadge from '../common/StatusBadge';

export default function InspectionsList({
  token,
  onSelectInspection,
  onNewInspection,
  filterStatus = 'ALL'
}) {
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(filterStatus);
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  useEffect(() => {
    fetchInspections();
  }, [statusFilter, categoryFilter]);

  const fetchInspections = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'ALL') params.status = statusFilter;
      if (categoryFilter !== 'ALL') params.category = categoryFilter;

      const res = await axios.get('/api/v1/products', {
        headers: { Authorization: `Bearer ${token}` },
        params
      });
      setInspections(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load inspections:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = inspections.filter((item) => {
    const term = search.toLowerCase();
    const id = item.inspectionId || '';
    const pName = item.structuredData?.productName?.value || '';
    const location = item.context?.location || '';
    return id.toLowerCase().includes(term) || pName.toLowerCase().includes(term) || location.toLowerCase().includes(term);
  });

  return (
    <div style={{ padding: '32px' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            {statusFilter === 'IN_PROGRESS' ? 'Active / Incomplete Inspections' : 'Inspection Audit History'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Search and review real packaged commodity inspections stored in the database.
          </p>
        </div>

        <button onClick={onNewInspection} className="btn-primary">
          <PlusCircle size={16} /> New Inspection
        </button>
      </div>

      {/* Filter and Search Toolbar */}
      <div style={{ display: 'flex', gap: '14px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="input-institutional"
            style={{ paddingLeft: '38px', fontSize: '0.86rem' }}
            placeholder="Search by Inspection ID, Product Name, or Location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <select
          className="input-institutional"
          style={{ width: '180px', fontSize: '0.86rem' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Statuses</option>
          <option value="VERIFIED">Verified / Completed</option>
          <option value="PENDING_VERIFICATION">Pending Verification</option>
          <option value="IN_PROGRESS">Incomplete / Active</option>
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 12px', color: 'var(--primary)' }} />
          <p style={{ fontSize: '0.88rem' }}>Loading records from database...</p>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No inspection records found"
          description={search ? "No records matched your search query." : "No inspections recorded yet. Start a new inspection to begin building the audit ledger."}
          actionLabel="Start New Inspection"
          onAction={onNewInspection}
        />
      ) : (
        <div className="card-institutional" style={{ overflow: 'hidden' }}>
          <table className="table-institutional">
            <thead>
              <tr>
                <th>Inspection ID</th>
                <th>Commodity Name</th>
                <th>Category</th>
                <th>Location</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const pName = item.structuredData?.productName?.value || 'Unspecified Commodity';
                const cat = item.context?.category || 'General';
                const loc = item.context?.location || 'Unspecified';

                return (
                  <tr key={item._id}>
                    <td className="text-mono" style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary)' }}>
                      {item.inspectionId}
                    </td>
                    <td style={{ fontWeight: '600' }}>
                      {pName}
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {cat}
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {loc}
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <StatusBadge status={item.status} size="small" />
                    </td>
                    <td>
                      <button
                        onClick={() => onSelectInspection(item)}
                        className="btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                      >
                        View Record <ArrowRight size={12} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

