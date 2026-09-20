import { SYNC_QUEUE_STORAGE_KEY } from "./domain.js";

function readQueue() {
  try {
    return JSON.parse(window.localStorage.getItem(SYNC_QUEUE_STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeQueue(queue) {
  window.localStorage.setItem(SYNC_QUEUE_STORAGE_KEY, JSON.stringify(queue));
}

export function queueSync(payload, entity = "playroom-state") {
  if (typeof window === "undefined") return;
  const queue = readQueue();
  queue.push({ id: `SYNC-${Date.now()}`, entity, payload, queuedAt: Date.now() });
  writeQueue(queue.slice(-50));
}

export function getPendingSyncCount() {
  if (typeof window === "undefined") return 0;
  return readQueue().length;
}

export async function flushSyncQueue() {
  if (typeof window === "undefined" || !navigator.onLine) return { synced: 0, pending: 0 };

  const queue = readQueue();
  if (!queue.length) return { synced: 0, pending: 0 };

  // The endpoint is intentionally kept as a contract until cloud sync is enabled.
  // A future server procedure can replace this no-op without changing the UI.
  const remaining = queue.slice();
  writeQueue(remaining);
  return { synced: 0, pending: remaining.length };
}
