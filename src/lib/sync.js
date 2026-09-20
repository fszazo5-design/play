import { SYNC_QUEUE_STORAGE_KEY } from "./domain.js";

const API_BASE = (import.meta.env?.VITE_PLAYROOM_API_URL || "/api").replace(/\/$/, "");
const SYNC_TOKEN = import.meta.env?.VITE_PLAYROOM_SYNC_TOKEN || "";

function readQueue() {
    try {
        return JSON.parse(window.localStorage.getItem(SYNC_QUEUE_STORAGE_KEY) || "[]");
    }
    catch {
        return [];
    }
}
function writeQueue(queue) {
    window.localStorage.setItem(SYNC_QUEUE_STORAGE_KEY, JSON.stringify(queue));
}
export function queueSync(payload, entity = "playroom-state") {
    if (typeof window === "undefined")
        return;
    const queue = readQueue();
    queue.push({ id: `SYNC-${Date.now()}`, entity, payload, queuedAt: Date.now() });
    writeQueue(queue.slice(-50));
}
export function getPendingSyncCount() {
    if (typeof window === "undefined")
        return 0;
    return readQueue().length;
}

async function sendSnapshot(item) {
    const headers = { "Content-Type": "application/json" };
    if (SYNC_TOKEN)
        headers["X-Playroom-Sync-Token"] = SYNC_TOKEN;
    const response = await fetch(`${API_BASE}/snapshots`, {
        method: "POST",
        headers,
        body: JSON.stringify({
            branchId: item.payload?.state?.systemConfig?.branchId || "PLAYROOM-RYD-01",
            schemaVersion: item.payload?.state?.systemConfig?.schemaVersion || 1,
            capturedAt: item.payload?.savedAt || item.queuedAt,
            source: "web-offline-queue",
            state: item.payload?.state,
        }),
    });
    if (!response.ok)
        throw new Error(`Snapshot API returned ${response.status}`);
    return response.json();
}

export async function flushSyncQueue() {
    if (typeof window === "undefined" || !navigator.onLine)
        return { synced: 0, pending: getPendingSyncCount() };
    const queue = readQueue();
    if (!queue.length)
        return { synced: 0, pending: 0 };
    let synced = 0;
    const remaining = [];
    for (const item of queue) {
        try {
            await sendSnapshot(item);
            synced += 1;
        }
        catch {
            remaining.push(item);
        }
    }
    writeQueue(remaining);
    return { synced, pending: remaining.length };
}
