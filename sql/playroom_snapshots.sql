CREATE TABLE IF NOT EXISTS playroom_snapshots (
  id BIGSERIAL PRIMARY KEY,
  branch_id VARCHAR(120) NOT NULL,
  schema_version INTEGER NOT NULL DEFAULT 1,
  captured_at BIGINT NOT NULL,
  source VARCHAR(32) NOT NULL DEFAULT 'web',
  state JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT playroom_snapshots_branch_captured_unique UNIQUE (branch_id, captured_at)
);

CREATE INDEX IF NOT EXISTS playroom_snapshots_branch_captured_idx
  ON playroom_snapshots (branch_id, captured_at DESC);
