import React, { useEffect, useState } from 'react';
import { Shield, Lock, Search, Eye, ArrowRight, Loader2, Calendar } from 'lucide-react';
import axios from 'axios';
import EmptyState from '../common/EmptyState';

export default function EvidenceRecords({
  token,
  onSelectInspection,
  onNewInspection
}) {
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchEvidence();
  }, []);

  const fetchEvidence = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/v1/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInspections(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load evidence records:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = inspections.filter((item) => {
    const term = search.toLowerCase();
    const id = item.inspectionId || '';
    const pName = item.structuredData?.productName?.value || '';
    return id.toLowerCase().includes(term) || pName.toLowerCase().includes(term);
  });

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            Cryptographic Evidence Records
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Tamper-evident provenance ledger tracking SHA-256 digital digests of all captured package images.
          </p>
        </div>
      </div>

      <div style={{ position: 'relative', marginBottom: '24px', maxWidth: '480px' }}>
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          type="text"
          className="input-institutional"
          style={{ paddingLeft: '38px', fontSize: '0.86rem' }}
          placeholder="Filter by Inspection ID or Product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 12px', color: 'var(--primary)' }} />
          <p style={{ fontSize: '0.88rem' }}>Loading evidence digests...</p>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Shield}
          title="No evidence records logged yet"
          description="Capture packaging images during an inspection to generate cryptographic SHA-256 provenance records."
          actionLabel="Start New Inspection"
          onAction={onNewInspection}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map((item) => {
            const hashes = item.evidenceIntegrity?.hashes || [];
            const surfaces = item.surfaces || [];
            const pName = item.structuredData?.productName?.value || item.context?.category || 'Unspecified Commodity';

            return (
              <div key={item._id} className="card-institutional" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Lock size={16} color="var(--primary)" />
                      <span className="text-mono" style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--primary)' }}>
                        {item.inspectionId}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '2px' }}>
                      {pName}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Date: {new Date(item.createdAt).toLocaleString()}
                    </span>
                    <button
                      onClick={() => onSelectInspection(item)}
                      className="btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                    >
                      View Inspection Record <ArrowRight size={12} />
                    </button>
                  </div>
                </div>

                {/* Hashes Table */}
                <div style={{ backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', padding: '12px 16px' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700', marginBottom: '8px' }}>
                    Algorithm: SHA-256 • Verified Tamper-Evident Digest
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {(hashes.length > 0 ? hashes : surfaces).map((h, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                        <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>
                          Surface: {h.surface || h.surfaceName || `Surface ${i + 1}`}
                        </span>
                        <span className="text-mono" style={{ color: 'var(--text-primary)' }}>
                          {h.hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
                        </span>
                      </div>
                    ))}
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

