import React, { useEffect, useState } from 'react';
import { History, Search, ArrowRight, Calendar, ShieldCheck, FileText } from 'lucide-react';
import axios from 'axios';

export default function HistoryView({ token, onSelectInspection, onNewScan }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/v1/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(res.data.data || []);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = history.filter((item) => {
    const term = search.toLowerCase();
    const name = item.structuredData?.productName?.value || '';
    const id = item.inspectionId || '';
    return id.toLowerCase().includes(term) || name.toLowerCase().includes(term);
  });

  return (
    <div style={{ maxWidth: '1100px', margin: '36px auto', padding: '0 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <History size={24} color="var(--accent-purple-light)" /> Inspection Audit History
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Past product label OCR scans and compliance inspection certificates
          </p>
        </div>

        <button onClick={onNewScan} className="btn-primary">
          + New Inspection
        </button>
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative', marginBottom: '24px' }}>
        <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
        <input
          type="text"
          className="input-futuristic"
          style={{ paddingLeft: '46px' }}
          placeholder="Search by Inspection ID or Product Name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* History Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>Loading inspection audit records...</div>
      ) : filtered.length === 0 ? (
        <div className="panel-outlined" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <FileText size={40} color="var(--text-subtle)" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '6px', color: '#fff' }}>No Inspection Logs Found</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '20px' }}>Start a new scan to inspect packaged commodities.</p>
          <button onClick={onNewScan} className="btn-primary">Start First Inspection</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filtered.map((item) => {
            const productName = item.structuredData?.productName?.value || 'Unspecified Product';
            const mrp = item.structuredData?.mrp?.value;
            const netQty = item.structuredData?.netQuantity;

            return (
              <div
                key={item._id}
                className="panel-outlined panel-outlined-hover"
                style={{ padding: '20px', cursor: 'pointer' }}
                onClick={() => onSelectInspection(item)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span className="badge-futuristic badge-purple">{item.inspectionId}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} /> {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '8px', color: '#fff' }}>
                  {productName}
                </h3>

                <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  {mrp && <span>MRP: <strong style={{ color: 'var(--accent-emerald)' }}>₹{mrp}</strong></span>}
                  {netQty && <span>Qty: <strong style={{ color: 'var(--accent-amber)' }}>{netQty.value} {netQty.unit || ''}</strong></span>}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--accent-purple-light)', fontWeight: '600' }}>
                    {item.originalImages?.length || 0} Surfaces Scanned
                  </span>
                  <div style={{ color: 'var(--accent-purple-light)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: '600' }}>
                    View Report <ArrowRight size={14} />
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
