-- ============================================================
-- DadLift — Add advanced_modification Field to All Exercises
-- Initializes advanced_modification as an empty string on every
-- exercise object across every workout.
--
-- This prepares the data shape for advanced variations to be
-- populated later via Supabase without a new app build.
--
-- IDEMPOTENCY: A CASE guard skips exercises that already have
-- the field, so re-running will never overwrite populated values.
-- ============================================================

BEGIN;

UPDATE workouts
SET exercises = (
  SELECT jsonb_agg(
    CASE WHEN ex ? 'advanced_modification' THEN ex
         ELSE ex || jsonb_build_object('advanced_modification', '')
    END
    ORDER BY ordinality
  )
  FROM jsonb_array_elements(exercises) WITH ORDINALITY AS t(ex, ordinality)
);

COMMIT;

-- ── Verification ──────────────────────────────────────────────
-- Every exercise across every workout should now have
-- advanced_modification present. Both counts below should match.

-- 1. Total exercise count across all workouts.
SELECT COUNT(*)::int AS total_exercises
FROM workouts,
     jsonb_array_elements(exercises) AS ex;

-- 2. Count of exercises that have the advanced_modification key.
--    Should equal total_exercises above.
SELECT COUNT(*)::int AS exercises_with_field
FROM workouts,
     jsonb_array_elements(exercises) AS ex
WHERE ex ? 'advanced_modification';

-- 3. Spot-check: show all distinct values of advanced_modification.
--    Should be a single row: empty string ''.
SELECT DISTINCT ex->>'advanced_modification' AS advanced_modification
FROM workouts,
     jsonb_array_elements(exercises) AS ex
WHERE ex ? 'advanced_modification';
