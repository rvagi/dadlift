-- ============================================================
-- BATCH 1 — Schema
-- Run this first. Creates the workouts table, updated_at
-- trigger, and RLS policy. Safe to re-run (idempotent).
-- ============================================================

CREATE TABLE IF NOT EXISTS workouts (
  id            text        PRIMARY KEY,
  name          text        NOT NULL,
  type          text        NOT NULL,  -- 'strength-endurance' | 'strength-hypertrophy' | 'cardio-l2' | 'cardio-vo2max'
  equipment     text        NOT NULL,  -- 'bodyweight' | 'household' | 'kettlebell' | 'dumbbell' | 'full-gym'
  description   text        NOT NULL,
  warmup        text,
  modifications text,
  exercises     jsonb       NOT NULL DEFAULT '[]'::jsonb,
  sort_order    int         NOT NULL DEFAULT 0,
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Auto-update updated_at whenever a row is changed
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS workouts_set_updated_at ON workouts;
CREATE TRIGGER workouts_set_updated_at
  BEFORE UPDATE ON workouts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Row-level security: anon can SELECT, no client-side writes
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read workouts" ON workouts;
CREATE POLICY "Public read workouts" ON workouts
  FOR SELECT TO anon USING (true);

-- Sanity check: confirm table exists with right columns
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'workouts'
ORDER BY ordinal_position;
