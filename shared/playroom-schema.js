/**
 * Runtime-oriented schema notes for the offline-first playroom state.
 * Frontend state is persisted as one document so a device can recover quickly.
 */
export const PLAYROOM_SCHEMA_VERSION = 1;

export const STATION_STATUSES = ["IDLE", "ACTIVE", "RESERVED", "MAINTENANCE"];
export const SESSION_MODES = ["OPEN", "FIXED"];
export const PAYMENT_METHODS = ["CASH", "CARD"];
export const INVENTORY_CATEGORIES = ["DRINK", "SNACK", "ACCESSORY"];

export function createSnapshotEnvelope({ branchId, state, reason = "interval" }) {
  return {
    schemaVersion: PLAYROOM_SCHEMA_VERSION,
    snapshotId: `SNAP-${Date.now()}`,
    branchId,
    capturedAt: Date.now(),
    reason,
    state,
  };
}

export function isValidSnapshotEnvelope(value) {
  return Boolean(
    value &&
    value.schemaVersion === PLAYROOM_SCHEMA_VERSION &&
    typeof value.snapshotId === "string" &&
    typeof value.branchId === "string" &&
    typeof value.capturedAt === "number" &&
    value.state &&
    Array.isArray(value.state.stations),
  );
}
