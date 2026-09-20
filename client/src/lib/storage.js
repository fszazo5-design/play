import { createDefaultState, SNAPSHOT_STORAGE_KEY, STATE_STORAGE_KEY } from "./domain.js";

function isBrowser() {
  return typeof window !== "undefined";
}

function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function loadState() {
  if (!isBrowser()) return createDefaultState();
  const stored = safeParse(window.localStorage.getItem(STATE_STORAGE_KEY), null);
  if (!stored) return createDefaultState();

  const defaults = createDefaultState();
  return {
    ...defaults,
    ...stored,
    systemConfig: { ...defaults.systemConfig, ...stored.systemConfig },
    stations: Array.isArray(stored.stations) ? stored.stations : defaults.stations,
    inventory: Array.isArray(stored.inventory) ? stored.inventory : defaults.inventory,
    players: Array.isArray(stored.players) ? stored.players : defaults.players,
    reservations: Array.isArray(stored.reservations) ? stored.reservations : defaults.reservations,
    auditLogs: Array.isArray(stored.auditLogs) ? stored.auditLogs : defaults.auditLogs,
  };
}

export function persistState(state) {
  if (!isBrowser()) return;
  window.localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(state));
}

export function captureSnapshot(state, reason = "interval") {
  if (!isBrowser()) return null;
  const snapshot = {
    snapshotId: `SNAP-${Date.now()}`,
    capturedAt: Date.now(),
    reason,
    data: state,
  };
  window.localStorage.setItem(SNAPSHOT_STORAGE_KEY, JSON.stringify(snapshot));
  return snapshot;
}

export function loadLatestSnapshot() {
  if (!isBrowser()) return null;
  return safeParse(window.localStorage.getItem(SNAPSHOT_STORAGE_KEY), null);
}

export function clearLocalData() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(STATE_STORAGE_KEY);
  window.localStorage.removeItem(SNAPSHOT_STORAGE_KEY);
}
