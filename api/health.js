import { getSql, isAuthorized, sendError, setCors } from "./_lib/neon.js";

export default async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return sendError(res, 405, "METHOD_NOT_ALLOWED", "Use GET");
  if (!isAuthorized(req)) return sendError(res, 401, "UNAUTHORIZED", "A valid sync token is required");
  try {
    const sql = getSql();
    const rows = await sql`SELECT 1 AS connected`;
    return res.status(200).json({ ok: true, database: rows[0]?.connected === 1 ? "connected" : "unknown", service: "playroom-api" });
  } catch (error) {
    if (error?.code === "DATABASE_NOT_CONFIGURED") return sendError(res, 503, error.code, error.message);
    return sendError(res, 503, "DATABASE_UNAVAILABLE", "Neon is not reachable");
  }
}
