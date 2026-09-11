import React, { useEffect, useState } from 'react';
import { FileCheck, Download, Search, Calendar, FileText, Loader2, ArrowRight } from 'lucide-react';
import axios from 'axios';
import EmptyState from './common/EmptyState';
import StatusBadge from './common/StatusBadge';

export default function ReportsView({ token, onSelectInspection, onNewInspection }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/v1/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async (e, item) => {
    e.stopPropagation();
    setDownloadingId(item._id);

    try {
      const res = await axios.get(`/api/v1/products/${item._id}/report`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        responseType: 'blob'
      });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `LabelGuard_Report_${item.inspectionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download report:', err);
      alert('Unable to generate PDF report from server.');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            Compliance Inspection Reports
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Formal Legal Metrology inspection certificates ready for PDF streaming and download.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 12px', color: 'var(--primary)' }} />
          <p style={{ fontSize: '0.88rem' }}>Loading inspection reports...</p>
        </div>
      ) : reports.length === 0 ? (
        <EmptyState
          icon={FileCheck}
          title="No inspection reports generated yet"
          description="Complete a packaged commodity inspection to generate official compliance reports."
          actionLabel="Start New Inspection"
          onAction={onNewInspection}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {reports.map((item) => {
            const productName = item.structuredData?.productName?.value || item.context?.category || 'Unspecified Commodity';

            return (
              <div
                key={item._id}
                className="card-institutional card-institutional-hover"
                style={{
                  padding: '20px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => onSelectInspection(item)}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <span className="text-mono" style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--primary)' }}>
                      {item.inspectionId}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Date: {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    <StatusBadge status={item.status} size="small" />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {productName}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {item.context?.location ? `Location: ${item.context.location} • ` : ''}
                    Surfaces: {item.surfaces?.length || item.originalImages?.length || 0}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }} onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={(e) => handleDownloadPdf(e, item)}
                    className="btn-primary"
                    disabled={downloadingId === item._id}
                    style={{ fontSize: '0.82rem', padding: '8px 14px' }}
                  >
                    {downloadingId === item._id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Download size={14} />
                    )}
                    <span>Download PDF</span>
                  </button>

                  <button
                    onClick={() => onSelectInspection(item)}
                    className="btn-secondary"
                    style={{ fontSize: '0.82rem', padding: '8px 14px' }}
                  >
                    View Record
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
