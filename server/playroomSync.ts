import { z } from "zod";

export const snapshotEnvelopeSchema = z.object({
  schemaVersion: z.number().int().positive(),
  snapshotId: z.string().min(1),
  branchId: z.string().min(1),
  capturedAt: z.number().int().positive(),
  reason: z.enum(["interval", "manual", "recovery"]).default("interval"),
  state: z.object({
    systemConfig: z.record(z.string(), z.unknown()),
    stations: z.array(z.record(z.string(), z.unknown())),
    inventory: z.array(z.record(z.string(), z.unknown())),
    players: z.array(z.record(z.string(), z.unknown())),
    reservations: z.array(z.record(z.string(), z.unknown())),
    tournaments: z.array(z.record(z.string(), z.unknown())),
    auditLogs: z.array(z.record(z.string(), z.unknown())),
    shiftReport: z.record(z.string(), z.unknown()),
  }),
});

export type SnapshotEnvelope = z.infer<typeof snapshotEnvelopeSchema>;

/**
 * Keeps conflict resolution deterministic when a device reconnects.
 * The first implementation is last-write-wins; a future version can merge
 * per-entity updates using the audit log and branch revision numbers.
 */
export function pickNewestSnapshot(local: SnapshotEnvelope, remote: SnapshotEnvelope) {
  return remote.capturedAt > local.capturedAt ? remote : local;
}

export function buildSyncStatus({ pending, lastSuccessfulSync }: { pending: number; lastSuccessfulSync: number | null }) {
  return {
    pending,
    lastSuccessfulSync,
    mode: pending > 0 ? "PENDING" : "READY",
  } as const;
}
