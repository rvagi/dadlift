-- ============================================================
-- DadLift Workouts — Audit Edits
-- Run in Supabase SQL Editor.
--
-- IDEMPOTENCY:
--   Rename/replace operations (A, B, C, D, E) match on the OLD
--   name in the WHERE clause. Once renamed, the old name is gone,
--   so re-runs are no-ops.
--   Append operations (F, G) use a POSITION guard to skip the
--   append if the text is already present.
--
-- NOTE: The exercise text field inside the JSONB is "notes"
--   (not "description") — that is the correct field name in this
--   schema. Both terms refer to the same field throughout.
-- ============================================================

BEGIN;

-- ── SECTION A: Cut and Replace ───────────────────────────────

-- A1. Park Bench Pro: "Bench Inverted Rows" → "Picnic Table Rows"
UPDATE workouts
SET exercises = (
  SELECT jsonb_agg(
    CASE WHEN ex->>'name' = 'Bench Inverted Rows' THEN
      ex || jsonb_build_object(
        'name',  'Picnic Table Rows',
        'notes', 'Lie on your back beneath the edge of a picnic table. Reach up and grip the edge of the tabletop with both hands. Pull your chest up toward the table edge. If no picnic table is available, find a sturdy low bar at waist-to-chest height (stair handrail, low playground rail).'
      )
    ELSE ex END
    ORDER BY ordinality
  )
  FROM jsonb_array_elements(exercises) WITH ORDINALITY AS t(ex, ordinality)
)
WHERE id = 'se-bw-5'
  AND exercises @> '[{"name": "Bench Inverted Rows"}]';

-- A2a. Garage Gains: "Bucket Carry Plank" → "Bucket Suitcase Carry"
UPDATE workouts
SET exercises = (
  SELECT jsonb_agg(
    CASE WHEN ex->>'name' = 'Bucket Carry Plank' THEN
      ex || jsonb_build_object(
        'name',  'Bucket Suitcase Carry',
        'notes', 'Hold a weighted bucket in one hand, opposite hand free. Walk forward 20–40 feet maintaining upright posture — fight the urge to lean toward the loaded side. Switch hands for next set. Hits core via anti-lateral flexion.'
      )
    ELSE ex END
    ORDER BY ordinality
  )
  FROM jsonb_array_elements(exercises) WITH ORDINALITY AS t(ex, ordinality)
)
WHERE id = 'sh-diy-1'
  AND exercises @> '[{"name": "Bucket Carry Plank"}]';

-- A2b. Heavy Carry Day: "Bucket Carry Plank" → "Bucket Suitcase Carry"
UPDATE workouts
SET exercises = (
  SELECT jsonb_agg(
    CASE WHEN ex->>'name' = 'Bucket Carry Plank' THEN
      ex || jsonb_build_object(
        'name',  'Bucket Suitcase Carry',
        'notes', 'Hold a weighted bucket in one hand, opposite hand free. Walk forward 20–40 feet maintaining upright posture — fight the urge to lean toward the loaded side. Switch hands for next set. Hits core via anti-lateral flexion.'
      )
    ELSE ex END
    ORDER BY ordinality
  )
  FROM jsonb_array_elements(exercises) WITH ORDINALITY AS t(ex, ordinality)
)
WHERE id = 'sh-diy-2'
  AND exercises @> '[{"name": "Bucket Carry Plank"}]';

-- A3. Basement Builder: "Dumbbell Incline Press (floor)" → "Dumbbell Floor Press"
UPDATE workouts
SET exercises = (
  SELECT jsonb_agg(
    CASE WHEN ex->>'name' = 'Dumbbell Incline Press (floor)' THEN
      ex || jsonb_build_object(
        'name',  'Dumbbell Floor Press',
        'notes', 'Lie flat on floor with DBs at chest. Press up, control down until upper arms touch floor. Floor stops your elbows, reducing shoulder strain.'
      )
    ELSE ex END
    ORDER BY ordinality
  )
  FROM jsonb_array_elements(exercises) WITH ORDINALITY AS t(ex, ordinality)
)
WHERE id = 'sh-db-3'
  AND exercises @> '[{"name": "Dumbbell Incline Press (floor)"}]';

-- A4. Toddler Tornado: "Kid-on-Back Rows" → "Sandbag Bent-Over Row"
UPDATE workouts
SET exercises = (
  SELECT jsonb_agg(
    CASE WHEN ex->>'name' = 'Kid-on-Back Rows' THEN
      ex || jsonb_build_object(
        'name',  'Sandbag Bent-Over Row',
        'notes', 'Hinge at the hips with a sandbag held in both hands. Pull the sandbag to your lower chest, squeezing shoulder blades together. Lower with control.'
      )
    ELSE ex END
    ORDER BY ordinality
  )
  FROM jsonb_array_elements(exercises) WITH ORDINALITY AS t(ex, ordinality)
)
WHERE id = 'se-diy-2'
  AND exercises @> '[{"name": "Kid-on-Back Rows"}]';

-- ── SECTION B: Recategorize to "hinge" ───────────────────────
-- Applied across all workouts containing each exercise.

-- B1. "Kettlebell Swing": pull → hinge
UPDATE workouts
SET exercises = (
  SELECT jsonb_agg(
    CASE WHEN ex->>'name' = 'Kettlebell Swing' THEN
      ex || jsonb_build_object('category', 'hinge')
    ELSE ex END
    ORDER BY ordinality
  )
  FROM jsonb_array_elements(exercises) WITH ORDINALITY AS t(ex, ordinality)
)
WHERE exercises @> '[{"name": "Kettlebell Swing"}]';

-- B2. "Barbell Romanian Deadlift": legs → hinge
UPDATE workouts
SET exercises = (
  SELECT jsonb_agg(
    CASE WHEN ex->>'name' = 'Barbell Romanian Deadlift' THEN
      ex || jsonb_build_object('category', 'hinge')
    ELSE ex END
    ORDER BY ordinality
  )
  FROM jsonb_array_elements(exercises) WITH ORDINALITY AS t(ex, ordinality)
)
WHERE exercises @> '[{"name": "Barbell Romanian Deadlift"}]';

-- B3. "Dumbbell Romanian Deadlift": legs → hinge
UPDATE workouts
SET exercises = (
  SELECT jsonb_agg(
    CASE WHEN ex->>'name' = 'Dumbbell Romanian Deadlift' THEN
      ex || jsonb_build_object('category', 'hinge')
    ELSE ex END
    ORDER BY ordinality
  )
  FROM jsonb_array_elements(exercises) WITH ORDINALITY AS t(ex, ordinality)
)
WHERE exercises @> '[{"name": "Dumbbell Romanian Deadlift"}]';

-- B4. "Cable Pull-Through": legs → hinge
UPDATE workouts
SET exercises = (
  SELECT jsonb_agg(
    CASE WHEN ex->>'name' = 'Cable Pull-Through' THEN
      ex || jsonb_build_object('category', 'hinge')
    ELSE ex END
    ORDER BY ordinality
  )
  FROM jsonb_array_elements(exercises) WITH ORDINALITY AS t(ex, ordinality)
)
WHERE exercises @> '[{"name": "Cable Pull-Through"}]';

-- B5. "Sandbag Over-Shoulder Toss": pull → hinge
UPDATE workouts
SET exercises = (
  SELECT jsonb_agg(
    CASE WHEN ex->>'name' = 'Sandbag Over-Shoulder Toss' THEN
      ex || jsonb_build_object('category', 'hinge')
    ELSE ex END
    ORDER BY ordinality
  )
  FROM jsonb_array_elements(exercises) WITH ORDINALITY AS t(ex, ordinality)
)
WHERE exercises @> '[{"name": "Sandbag Over-Shoulder Toss"}]';

-- B6. "Superman Holds": pull → hinge
UPDATE workouts
SET exercises = (
  SELECT jsonb_agg(
    CASE WHEN ex->>'name' = 'Superman Holds' THEN
      ex || jsonb_build_object('category', 'hinge')
    ELSE ex END
    ORDER BY ordinality
  )
  FROM jsonb_array_elements(exercises) WITH ORDINALITY AS t(ex, ordinality)
)
WHERE exercises @> '[{"name": "Superman Holds"}]';

-- ── SECTION C: Consolidate Duplicates ────────────────────────

-- C1. "Kettlebell Goblet Squats" (plural) → "Kettlebell Goblet Squat" (singular)
UPDATE workouts
SET exercises = (
  SELECT jsonb_agg(
    CASE WHEN ex->>'name' = 'Kettlebell Goblet Squats' THEN
      ex || jsonb_build_object('name', 'Kettlebell Goblet Squat')
    ELSE ex END
    ORDER BY ordinality
  )
  FROM jsonb_array_elements(exercises) WITH ORDINALITY AS t(ex, ordinality)
)
WHERE exercises @> '[{"name": "Kettlebell Goblet Squats"}]';

-- C2. "Australian Pull-Ups (low bar)" → "Inverted Row" + canonical notes
UPDATE workouts
SET exercises = (
  SELECT jsonb_agg(
    CASE WHEN ex->>'name' = 'Australian Pull-Ups (low bar)' THEN
      ex || jsonb_build_object(
        'name',  'Inverted Row',
        'notes', 'Find a sturdy bar at waist-to-chest height (~3–4 ft) — stair handrails, low playground rails, a squat rack bar set low. Lie underneath, grip the bar with arms extended, pull your chest up to the bar.'
      )
    ELSE ex END
    ORDER BY ordinality
  )
  FROM jsonb_array_elements(exercises) WITH ORDINALITY AS t(ex, ordinality)
)
WHERE exercises @> '[{"name": "Australian Pull-Ups (low bar)"}]';

-- C3. "Dumbbell Shoulder Press" → "Dumbbell Overhead Press" (keep notes)
UPDATE workouts
SET exercises = (
  SELECT jsonb_agg(
    CASE WHEN ex->>'name' = 'Dumbbell Shoulder Press' THEN
      ex || jsonb_build_object('name', 'Dumbbell Overhead Press')
    ELSE ex END
    ORDER BY ordinality
  )
  FROM jsonb_array_elements(exercises) WITH ORDINALITY AS t(ex, ordinality)
)
WHERE exercises @> '[{"name": "Dumbbell Shoulder Press"}]';

-- C4a. "Pull-Ups (or assisted)" → "Pull-Ups" + canonical notes
UPDATE workouts
SET exercises = (
  SELECT jsonb_agg(
    CASE WHEN ex->>'name' = 'Pull-Ups (or assisted)' THEN
      ex || jsonb_build_object(
        'name',  'Pull-Ups',
        'notes', 'Hang from a sturdy overhead bar with palms facing away. Pull until chin clears the bar, lower with control. Use band, box-assisted, or assisted pull-up machine if needed.'
      )
    ELSE ex END
    ORDER BY ordinality
  )
  FROM jsonb_array_elements(exercises) WITH ORDINALITY AS t(ex, ordinality)
)
WHERE exercises @> '[{"name": "Pull-Ups (or assisted)"}]';

-- C4b. "Pull-Ups (assisted if needed)" → "Pull-Ups" + canonical notes
UPDATE workouts
SET exercises = (
  SELECT jsonb_agg(
    CASE WHEN ex->>'name' = 'Pull-Ups (assisted if needed)' THEN
      ex || jsonb_build_object(
        'name',  'Pull-Ups',
        'notes', 'Hang from a sturdy overhead bar with palms facing away. Pull until chin clears the bar, lower with control. Use band, box-assisted, or assisted pull-up machine if needed.'
      )
    ELSE ex END
    ORDER BY ordinality
  )
  FROM jsonb_array_elements(exercises) WITH ORDINALITY AS t(ex, ordinality)
)
WHERE exercises @> '[{"name": "Pull-Ups (assisted if needed)"}]';

-- ── SECTION D: Rename + Clarify ──────────────────────────────

-- D1. "Doorframe Rows" → "Doorway Rows" + new notes
UPDATE workouts
SET exercises = (
  SELECT jsonb_agg(
    CASE WHEN ex->>'name' = 'Doorframe Rows' THEN
      ex || jsonb_build_object(
        'name',  'Doorway Rows',
        'notes', 'Stand in a doorway, grip both sides of the frame at chest height, lean back with feet planted, pull yourself upright. No equipment needed beyond a sturdy doorway.'
      )
    ELSE ex END
    ORDER BY ordinality
  )
  FROM jsonb_array_elements(exercises) WITH ORDINALITY AS t(ex, ordinality)
)
WHERE exercises @> '[{"name": "Doorframe Rows"}]';

-- D2. "Backpack Rows" — keep name, replace notes
UPDATE workouts
SET exercises = (
  SELECT jsonb_agg(
    CASE WHEN ex->>'name' = 'Backpack Rows' THEN
      ex || jsonb_build_object(
        'notes', 'Load a backpack with books or other weight. Hold by both shoulder straps, hinge at hips into bent-over position, row to lower chest.'
      )
    ELSE ex END
    ORDER BY ordinality
  )
  FROM jsonb_array_elements(exercises) WITH ORDINALITY AS t(ex, ordinality)
)
WHERE exercises @> '[{"name": "Backpack Rows"}]';

-- D3. "Towel Rows" → "Door-Anchored Towel Rows" + new notes
UPDATE workouts
SET exercises = (
  SELECT jsonb_agg(
    CASE WHEN ex->>'name' = 'Towel Rows' THEN
      ex || jsonb_build_object(
        'name',  'Door-Anchored Towel Rows',
        'notes', 'Loop a towel through the top of a closed, sturdy door. Hold both ends, lean back with feet planted, pull yourself upright.'
      )
    ELSE ex END
    ORDER BY ordinality
  )
  FROM jsonb_array_elements(exercises) WITH ORDINALITY AS t(ex, ordinality)
)
WHERE exercises @> '[{"name": "Towel Rows"}]';

-- D4. "Dumbbell Seal Row" — keep name, replace notes
UPDATE workouts
SET exercises = (
  SELECT jsonb_agg(
    CASE WHEN ex->>'name' = 'Dumbbell Seal Row' THEN
      ex || jsonb_build_object(
        'notes', 'Lie face-down on an elevated bench (~18+ inches) with DBs hanging fully extended below you. Row both DBs to your chest, keeping body flat against the bench.'
      )
    ELSE ex END
    ORDER BY ordinality
  )
  FROM jsonb_array_elements(exercises) WITH ORDINALITY AS t(ex, ordinality)
)
WHERE exercises @> '[{"name": "Dumbbell Seal Row"}]';

-- D5. "Bulgarian Split Squat (bodyweight)" → "Bulgarian Split Squat" + new notes
UPDATE workouts
SET exercises = (
  SELECT jsonb_agg(
    CASE WHEN ex->>'name' = 'Bulgarian Split Squat (bodyweight)' THEN
      ex || jsonb_build_object(
        'name',  'Bulgarian Split Squat',
        'notes', 'Back foot elevated on a bench, step, or low wall. Front foot 2–3 feet forward. Lower until back knee nearly touches the ground, drive through front heel to stand.'
      )
    ELSE ex END
    ORDER BY ordinality
  )
  FROM jsonb_array_elements(exercises) WITH ORDINALITY AS t(ex, ordinality)
)
WHERE exercises @> '[{"name": "Bulgarian Split Squat (bodyweight)"}]';

-- D6. "Inverted Rows (table or sturdy bar)" → "Inverted Row" + canonical notes
--     Merges with the renamed "Australian Pull-Ups" from C2 into one canonical entry.
UPDATE workouts
SET exercises = (
  SELECT jsonb_agg(
    CASE WHEN ex->>'name' = 'Inverted Rows (table or sturdy bar)' THEN
      ex || jsonb_build_object(
        'name',  'Inverted Row',
        'notes', 'Find a sturdy bar at waist-to-chest height (~3–4 ft) — stair handrails, low playground rails, a squat rack bar set low. Lie underneath, grip the bar with arms extended, pull your chest up to the bar.'
      )
    ELSE ex END
    ORDER BY ordinality
  )
  FROM jsonb_array_elements(exercises) WITH ORDINALITY AS t(ex, ordinality)
)
WHERE exercises @> '[{"name": "Inverted Rows (table or sturdy bar)"}]';

-- D7. "Sandbag Front-Loaded Carry Squats" → "Sandbag Front-Loaded Squats" + new notes
UPDATE workouts
SET exercises = (
  SELECT jsonb_agg(
    CASE WHEN ex->>'name' = 'Sandbag Front-Loaded Carry Squats' THEN
      ex || jsonb_build_object(
        'name',  'Sandbag Front-Loaded Squats',
        'notes', 'Hold the sandbag bear-hug style against your chest. Squat for reps. The front-loaded position challenges core stability and upper-back posture.'
      )
    ELSE ex END
    ORDER BY ordinality
  )
  FROM jsonb_array_elements(exercises) WITH ORDINALITY AS t(ex, ordinality)
)
WHERE exercises @> '[{"name": "Sandbag Front-Loaded Carry Squats"}]';

-- ── SECTION E: Replace for Safety ────────────────────────────

-- E1. Dumbbell Grinder: "Dumbbell Upright Row" → "Dumbbell High Pull"
UPDATE workouts
SET exercises = (
  SELECT jsonb_agg(
    CASE WHEN ex->>'name' = 'Dumbbell Upright Row' THEN
      ex || jsonb_build_object(
        'name',  'Dumbbell High Pull',
        'notes', 'Hold DBs at hips. Pull straight up to chest height by leading with elbows, keeping DBs close to body. Stop at chest — don''t go higher (shoulder impingement risk).'
      )
    ELSE ex END
    ORDER BY ordinality
  )
  FROM jsonb_array_elements(exercises) WITH ORDINALITY AS t(ex, ordinality)
)
WHERE id = 'se-db-3'
  AND exercises @> '[{"name": "Dumbbell Upright Row"}]';

-- E2. Sled & Iron: "Barbell Hack Squat" → "Barbell Front Squat (heavy)"
UPDATE workouts
SET exercises = (
  SELECT jsonb_agg(
    CASE WHEN ex->>'name' = 'Barbell Hack Squat' THEN
      ex || jsonb_build_object(
        'name',  'Barbell Front Squat (heavy)',
        'notes', 'Bar racked across the front of your shoulders, elbows high. Squat with upright torso. Use a heavier load than your standard Front Squat day.'
      )
    ELSE ex END
    ORDER BY ordinality
  )
  FROM jsonb_array_elements(exercises) WITH ORDINALITY AS t(ex, ordinality)
)
WHERE id = 'sh-gym-4'
  AND exercises @> '[{"name": "Barbell Hack Squat"}]';

-- ── SECTION F: Append Safety Notes ───────────────────────────
-- POSITION guard prevents double-appending on re-run.

-- F1. "Kid Overhead Press" — append safety note
UPDATE workouts
SET exercises = (
  SELECT jsonb_agg(
    CASE WHEN ex->>'name' = 'Kid Overhead Press'
          AND position('Best for kids 20' IN (ex->>'notes')) = 0 THEN
      ex || jsonb_build_object(
        'notes', (ex->>'notes') || ' Best for kids 20–50 lbs. Use a soft surface (carpet, mat, grass) underneath. Don''t press if your child is too heavy to control safely overhead.'
      )
    ELSE ex END
    ORDER BY ordinality
  )
  FROM jsonb_array_elements(exercises) WITH ORDINALITY AS t(ex, ordinality)
)
WHERE exercises @> '[{"name": "Kid Overhead Press"}]';

-- F2. "Kid Squat & Toss" — append safety note
UPDATE workouts
SET exercises = (
  SELECT jsonb_agg(
    CASE WHEN ex->>'name' = 'Kid Squat & Toss'
          AND position('Toss only to a height' IN (ex->>'notes')) = 0 THEN
      ex || jsonb_build_object(
        'notes', (ex->>'notes') || ' Best for kids 20–50 lbs. Toss only to a height you can reliably catch. Soft surface underneath. Stop immediately if your child seems uncomfortable.'
      )
    ELSE ex END
    ORDER BY ordinality
  )
  FROM jsonb_array_elements(exercises) WITH ORDINALITY AS t(ex, ordinality)
)
WHERE exercises @> '[{"name": "Kid Squat & Toss"}]';

-- F3. "Sandbag Over-Shoulder Toss" — append safety note
--     (category already updated to 'hinge' in B5 above)
UPDATE workouts
SET exercises = (
  SELECT jsonb_agg(
    CASE WHEN ex->>'name' = 'Sandbag Over-Shoulder Toss'
          AND position('Use a proper sandbag' IN (ex->>'notes')) = 0 THEN
      ex || jsonb_build_object(
        'notes', (ex->>'notes') || ' Use a proper sandbag (not loose weights). Start with a lighter bag to learn the explosive hinge pattern. Land on grass, mat, or other soft surface — not pavement.'
      )
    ELSE ex END
    ORDER BY ordinality
  )
  FROM jsonb_array_elements(exercises) WITH ORDINALITY AS t(ex, ordinality)
)
WHERE exercises @> '[{"name": "Sandbag Over-Shoulder Toss"}]';

-- ── SECTION G: Append Equipment Notes ────────────────────────
-- POSITION guard prevents double-appending on re-run.

-- G1. "Steady Cycling" — append equipment note
UPDATE workouts
SET exercises = (
  SELECT jsonb_agg(
    CASE WHEN ex->>'name' = 'Steady Cycling'
          AND position('Requires a bike' IN (ex->>'notes')) = 0 THEN
      ex || jsonb_build_object(
        'notes', (ex->>'notes') || ' Requires a bike — stationary or outdoor.'
      )
    ELSE ex END
    ORDER BY ordinality
  )
  FROM jsonb_array_elements(exercises) WITH ORDINALITY AS t(ex, ordinality)
)
WHERE exercises @> '[{"name": "Steady Cycling"}]';

-- G2. "Steady Swimming" — append equipment note
UPDATE workouts
SET exercises = (
  SELECT jsonb_agg(
    CASE WHEN ex->>'name' = 'Steady Swimming'
          AND position('Requires access to a pool' IN (ex->>'notes')) = 0 THEN
      ex || jsonb_build_object(
        'notes', (ex->>'notes') || ' Requires access to a pool or open water.'
      )
    ELSE ex END
    ORDER BY ordinality
  )
  FROM jsonb_array_elements(exercises) WITH ORDINALITY AS t(ex, ordinality)
)
WHERE exercises @> '[{"name": "Steady Swimming"}]';

-- G3. "Wall Sit" — append equipment note
UPDATE workouts
SET exercises = (
  SELECT jsonb_agg(
    CASE WHEN ex->>'name' = 'Wall Sit'
          AND position('needs a wall' IN (ex->>'notes')) = 0 THEN
      ex || jsonb_build_object(
        'notes', (ex->>'notes') || ' Bodyweight only — needs a wall. Lean against the wall with knees bent at 90 degrees, hold for time.'
      )
    ELSE ex END
    ORDER BY ordinality
  )
  FROM jsonb_array_elements(exercises) WITH ORDINALITY AS t(ex, ordinality)
)
WHERE exercises @> '[{"name": "Wall Sit"}]';

COMMIT;

-- ── Verification ──────────────────────────────────────────────
-- Returns every distinct (exercise_name, category) pair and
-- the number of workouts it appears in, sorted A–Z.
--
-- What to check:
--   • Old names (e.g. "Bench Inverted Rows", "Bucket Carry Plank",
--     "Australian Pull-Ups (low bar)", "Dumbbell Upright Row") should
--     NOT appear.
--   • New names (e.g. "Picnic Table Rows", "Bucket Suitcase Carry",
--     "Inverted Row", "Dumbbell High Pull") SHOULD appear.
--   • Six exercises should show category = 'hinge':
--     Barbell Romanian Deadlift, Cable Pull-Through,
--     Dumbbell Romanian Deadlift, Kettlebell Swing,
--     Sandbag Over-Shoulder Toss, Superman Holds.
--   • "Pull-Ups (or assisted)" and "Pull-Ups (assisted if needed)"
--     should NOT appear — only "Pull-Ups" should remain.

SELECT
  ex->>'name'     AS exercise_name,
  ex->>'category' AS category,
  COUNT(*)::int   AS workout_count
FROM workouts,
     jsonb_array_elements(exercises) AS ex
GROUP BY ex->>'name', ex->>'category'
ORDER BY ex->>'name', ex->>'category';
