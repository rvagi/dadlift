-- ============================================================
-- DadLift — Endurance Set Standardization
-- Sets every exercise in strength-endurance workouts to 4 sets.
-- Hypertrophy, cardio, and all other workout types are untouched.
--
-- IDEMPOTENCY: Re-running is safe — overwriting 4 with 4 is a no-op
-- in effect. The UPDATE will touch rows again but produce no change.
-- ============================================================

BEGIN;

UPDATE workouts
SET exercises = (
  SELECT jsonb_agg(
    ex || jsonb_build_object('sets', 4)
    ORDER BY ordinality
  )
  FROM jsonb_array_elements(exercises) WITH ORDINALITY AS t(ex, ordinality)
)
WHERE type = 'strength-endurance';

COMMIT;

-- ── Verification ──────────────────────────────────────────────
-- Confirm every SE exercise has sets = 4.
-- The second query confirms non-SE workouts are untouched.

-- 1. All distinct sets values across SE workouts — should be only 4.
SELECT DISTINCT (ex->>'sets')::int AS sets
FROM workouts,
     jsonb_array_elements(exercises) AS ex
WHERE type = 'strength-endurance'
ORDER BY sets;

-- 2. Sets distribution across non-SE workouts — should be unchanged.
SELECT type, (ex->>'sets')::int AS sets, COUNT(*)::int AS exercise_count
FROM workouts,
     jsonb_array_elements(exercises) AS ex
WHERE type != 'strength-endurance'
GROUP BY type, (ex->>'sets')::int
ORDER BY type, sets;
