import { neon } from "@neondatabase/serverless";

let sqlClient;

export function getSql() {
  const connectionString = process.env.NEON_DATABASE_URL;
  if (!connectionString) {
    const error = new Error("NEON_DATABASE_URL is not configured");
    error.code = "DATABASE_NOT_CONFIGURED";
    throw error;
  }
  sqlClient ||= neon(connectionString);
  return sqlClient;
}

export function setCors(res) {
  const origin = process.env.PLAYROOM_ALLOWED_ORIGIN || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Playroom-Sync-Token");
  res.setHeader("Cache-Control", "no-store");
}

export function isAuthorized(req) {
  const expected = process.env.PLAYROOM_SYNC_TOKEN;
  if (!expected) return process.env.NODE_ENV !== "production";
  return req.headers["x-playroom-sync-token"] === expected;
}

export function sendError(res, status, code, message) {
  res.status(status).json({ ok: false, error: { code, message } });
}

export function parseJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body);
  return {};
}
