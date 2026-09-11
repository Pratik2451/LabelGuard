/**
 * Offline Inspection Queue Manager
 * Persists pending inspections captured without network connection
 * and handles synchronization when the network returns.
 */

const STORAGE_KEY = 'labelguard_offline_queue';

export function getOfflineQueue() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to read offline queue:', e);
    return [];
  }
}

export function saveOfflineInspection(inspectionItem) {
  const queue = getOfflineQueue();
  const newItem = {
    id: `OFFLINE-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
    syncState: 'PENDING', // PENDING, SYNCING, SYNCED, SYNC_FAILED
    retryCount: 0,
    lastAttempt: null,
    errorMessage: null,
    ...inspectionItem
  };

  queue.unshift(newItem);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  } catch (e) {
    console.error('Failed to save to offline queue (storage quota exceeded?):', e);
  }
  return newItem;
}

export function updateQueueItem(id, updates) {
  const queue = getOfflineQueue();
  const index = queue.findIndex(item => item.id === id);
  if (index !== -1) {
    queue[index] = { ...queue[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  }
}

export function removeQueueItem(id) {
  const queue = getOfflineQueue().filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
}

export function getPendingQueueCount() {
  return getOfflineQueue().filter(item => item.syncState === 'PENDING' || item.syncState === 'SYNC_FAILED').length;
}

