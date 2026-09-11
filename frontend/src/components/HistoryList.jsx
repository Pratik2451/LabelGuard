import React, { useEffect, useState } from 'react';
import { History, Search, ArrowRight, ShieldAlert, Calendar, Tag } from 'lucide-react';
import axios from 'axios';

export default function HistoryList({ token, onSelectInspection, onNewScan }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/v1/products', { headers: { Authorization: `Bearer ${token}` }});

      setHistory(res.data.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to load inspection history');
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter((item) => {
    const term = search.toLowerCase();
    const productName = item.structuredData?.productName?.value || '';
    const inspectionId = item.inspectionId || '';
    return inspectionId.toLowerCase().includes(term) || productName.toLowerCase().includes(term);
  });

  return (
    <div style={{ maxWidth: '1000px', margin: '32px auto', padding: '0 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <History size={24} color="var(--primary-cyan)" />
            Inspection Audit History
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Review past product label OCR extractions and compliance reports
          </p>
        </div>

        <button onClick={onNewScan} className="glass-button">
          + New Inspection
        </button>
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative', marginBottom: '24px' }}>
        <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
        <input
          type="text"
          className="glass-input"
          style={{ paddingLeft: '46px' }}
          placeholder="Search by Inspection ID or Product Name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* History Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          Loading inspection records...
        </div>
      ) : error ? (
        <div style={{ padding: '20px', background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: '12px', color: 'var(--accent-rose)' }}>
          {error}
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <ShieldAlert size={48} color="var(--text-subtle)" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '6px' }}>No Inspection Records Found</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Upload label images to generate your first compliance report.
          </p>
          <button onClick={onNewScan} className="glass-button">
            Start First Inspection
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {filteredHistory.map((item) => {
            const productName = item.structuredData?.productName?.value || 'Unspecified Product';
            const mrp = item.structuredData?.mrp?.value;
            const netQty = item.structuredData?.netQuantity;

            return (
              <div
                key={item._id}
                className="glass-panel glass-panel-hover"
                style={{ padding: '20px', cursor: 'pointer' }}
                onClick={() => onSelectInspection(item)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span className="badge badge-info">{item.inspectionId}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '8px', color: '#fff' }}>
                  {productName}
                </h3>

                <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  {mrp && <span>MRP: <strong>₹{mrp}</strong></span>}
                  {netQty && <span>Qty: <strong>{netQty.value} {netQty.unit || ''}</strong></span>}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--primary-cyan)', fontWeight: '600' }}>
                    {item.originalImages?.length || 0} Images Attached
                  </span>
                  <div style={{ color: 'var(--primary-indigo)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: '600' }}>
                    View Details <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
