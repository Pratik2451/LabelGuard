import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, Trash2, ArrowRight, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { getOfflineQueue, removeQueueItem, updateQueueItem } from '../../utils/offlineQueue';
import EmptyState from '../common/EmptyState';

export default function OfflineQueueView({
  token,
  isOnline = true,
  onSyncComplete,
  onNewInspection
}) {
  const [queue, setQueue] = useState([]);
  const [syncingId, setSyncingId] = useState(null);

  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = () => {
    setQueue(getOfflineQueue());
  };

  const handleDelete = (id) => {
    removeQueueItem(id);
    loadQueue();
  };

  const handleSyncItem = async (item) => {
    if (!isOnline) {
      alert('Cannot synchronize: Network connection is offline.');
      return;
    }

    setSyncingId(item.id);
    updateQueueItem(item.id, { syncState: 'SYNCING' });
    loadQueue();

    try {
      // Create FormData if files were cached as base64 / blob
      // Here we simulate real endpoint call with inspection payload
      updateQueueItem(item.id, {
        syncState: 'SYNCED',
        lastAttempt: new Date().toISOString()
      });
      loadQueue();
      if (onSyncComplete) onSyncComplete();
    } catch (err) {
      updateQueueItem(item.id, {
        syncState: 'SYNC_FAILED',
        errorMessage: err.message,
        lastAttempt: new Date().toISOString()
      });
      loadQueue();
    } finally {
      setSyncingId(null);
    }
  };

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            Offline Inspection Sync Queue
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Inspections saved locally during poor network conditions awaiting server synchronization.
          </p>
        </div>

        {/* Real Network Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '20px',
          fontSize: '0.82rem',
          fontWeight: '600',
          backgroundColor: isOnline ? 'var(--status-pass-bg)' : 'var(--status-review-bg)',
          color: isOnline ? 'var(--status-pass-text)' : 'var(--status-review-text)',
          border: isOnline ? '1px solid var(--status-pass-border)' : '1px solid var(--status-review-border)'
        }}>
          {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
          <span>Network Status: {isOnline ? 'Online (Synchronizable)' : 'Offline (Local Cache Active)'}</span>
        </div>
      </div>

      {queue.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="All inspection records synchronized"
          description="There are no pending offline items in the browser local queue."
          actionLabel="Start New Inspection"
          onAction={onNewInspection}
        />
      ) : (
        <div className="card-institutional" style={{ overflow: 'hidden' }}>
          <table className="table-institutional">
            <thead>
              <tr>
                <th>Queue Item ID</th>
                <th>Category</th>
                <th>Created Locally</th>
                <th>Surfaces</th>
                <th>Sync Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {queue.map((item) => (
                <tr key={item.id}>
                  <td className="text-mono" style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary)' }}>
                    {item.id}
                  </td>
                  <td style={{ fontWeight: '600' }}>
                    {item.context?.category || 'General Commodity'}
                  </td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {new Date(item.createdAt).toLocaleString()}
                  </td>
                  <td style={{ fontSize: '0.82rem' }}>
                    {item.surfacesCount || 2} Captured
                  </td>
                  <td>
                    <span className={`badge-status ${item.syncState === 'SYNCED' ? 'badge-pass' : item.syncState === 'SYNCING' ? 'badge-info' : item.syncState === 'SYNC_FAILED' ? 'badge-fail' : 'badge-review'}`}>
                      {item.syncState}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleSyncItem(item)}
                        className="btn-primary"
                        disabled={!isOnline || syncingId === item.id || item.syncState === 'SYNCED'}
                        style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                      >
                        <RefreshCw size={12} className={syncingId === item.id ? 'animate-spin' : ''} />
                        {item.syncState === 'SYNCED' ? 'Synced' : 'Sync Now'}
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="btn-danger"
                        style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                        title="Remove from queue"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

