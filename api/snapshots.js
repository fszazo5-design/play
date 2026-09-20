import { getSql, isAuthorized, parseJsonBody, sendError, setCors } from "./_lib/neon.js";

const MAX_STATE_BYTES = 900_000;
const MAX_LIMIT = 50;

function normalizeSnapshot(input) {
  const state = input?.state;
  const branchId = String(input?.branchId || "PLAYROOM-RYD-01").slice(0, 120);
  const schemaVersion = Number(input?.schemaVersion || 1);
  const capturedAt = Number(input?.capturedAt || Date.now());
  const source = String(input?.source || "web").slice(0, 32);
  if (!state || typeof state !== "object" || Array.isArray(state)) throw new Error("state must be a JSON object");
  if (!Number.isInteger(schemaVersion) || schemaVersion < 1) throw new Error("schemaVersion must be a positive integer");
  if (!Number.isFinite(capturedAt) || capturedAt < 0) throw new Error("capturedAt must be a valid timestamp");
  const serialized = JSON.stringify(state);
  if (serialized.length > MAX_STATE_BYTES) throw new Error("state payload is too large");
  return { branchId, schemaVersion, capturedAt, source, state };
}

export default async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (!isAuthorized(req)) return sendError(res, 401, "UNAUTHORIZED", "A valid sync token is required");

  try {
    const sql = getSql();
    if (req.method === "POST") {
      const snapshot = normalizeSnapshot(parseJsonBody(req));
      const rows = await sql`
        INSERT INTO playroom_snapshots (branch_id, schema_version, captured_at, source, state)
        VALUES (${snapshot.branchId}, ${snapshot.schemaVersion}, ${snapshot.capturedAt}, ${snapshot.source}, ${snapshot.state})
        ON CONFLICT (branch_id, captured_at) DO UPDATE SET
          schema_version = EXCLUDED.schema_version,
          source = EXCLUDED.source,
          state = EXCLUDED.state
        RETURNING id, branch_id, schema_version, captured_at, source, created_at
      `;
      return res.status(201).json({ ok: true, snapshot: rows[0] });
    }
    if (req.method === "GET") {
      const branchId = String(req.query?.branchId || "PLAYROOM-RYD-01").slice(0, 120);
      const parsedLimit = Number(req.query?.limit || 10);
      const limit = Math.min(MAX_LIMIT, Math.max(1, Number.isFinite(parsedLimit) ? Math.floor(parsedLimit) : 10));
      const rows = await sql`
        SELECT id, branch_id, schema_version, captured_at, source, state, created_at
        FROM playroom_snapshots
        WHERE branch_id = ${branchId}
        ORDER BY captured_at DESC
        LIMIT ${limit}
      `;
      return res.status(200).json({ ok: true, snapshots: rows });
    }
    res.setHeader("Allow", "GET,POST,OPTIONS");
    return sendError(res, 405, "METHOD_NOT_ALLOWED", "Use GET or POST");
  } catch (error) {
    if (error?.code === "DATABASE_NOT_CONFIGURED") return sendError(res, 503, error.code, error.message);
    if (error instanceof SyntaxError || /must be|payload is too large/.test(error?.message || "")) return sendError(res, 400, "INVALID_SNAPSHOT", error.message);
    console.error("[api/snapshots]", error);
    return sendError(res, 500, "SNAPSHOT_WRITE_FAILED", "Could not access snapshot storage");
  }
}
