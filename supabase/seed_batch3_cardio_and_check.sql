-- ============================================================
-- BATCH 3 — Cardio L2 + Cardio VO2 Max + Sanity Check
-- Run after Batch 2. 16 workouts, sort_order 38–53.
-- Uses ON CONFLICT upsert — safe to re-run.
-- ============================================================

-- ── Cardio L2 ─────────────────────────────────────────────────

INSERT INTO workouts (id, name, type, equipment, description, warmup, modifications, exercises, sort_order)
VALUES (
  'cl2-1', 'The Long Walk', 'cardio-l2', 'bodyweight',
  'The simplest workout there is. Walk with purpose for 45-60 minutes.',
  'Start the first 5 minutes of your session at an easy pace — slower than your target pace. Let your body warm up gradually. Do a few gentle stretches if anything feels tight, but don''t force it. Your pace will naturally increase as your body warms up.',
  'If walking doesn''t get your heart rate up enough, walk faster, add hills, wear a weighted backpack, or switch to an easy jog or bike ride. If you have bad knees, cycling or swimming are great low-impact alternatives. If you can only do 20 minutes to start, that''s fine — build up by adding 5 minutes each week.',
  '[
    {"id":"e1","name":"Brisk Walk or Easy Jog","category":"cardio","sets":1,"notes":"Walk or jog for 45-60 minutes at a pace where you could hold a conversation without gasping. That''s the test — if you can''t talk comfortably, slow down. If it feels too easy, walk faster, find a hill, or start jogging."}
  ]'::jsonb,
  38
) ON CONFLICT (id) DO UPDATE SET
  name=EXCLUDED.name, type=EXCLUDED.type, equipment=EXCLUDED.equipment,
  description=EXCLUDED.description, warmup=EXCLUDED.warmup,
  modifications=EXCLUDED.modifications, exercises=EXCLUDED.exercises,
  sort_order=EXCLUDED.sort_order;

INSERT INTO workouts (id, name, type, equipment, description, warmup, modifications, exercises, sort_order)
VALUES (
  'cl2-2', 'Trail Day', 'cardio-l2', 'bodyweight',
  'Get outside. Take the long trail. Get your heart rate up while enjoying the scenery.',
  'Start the first 5 minutes of your session at an easy pace — slower than your target pace. Let your body warm up gradually. Do a few gentle stretches if anything feels tight, but don''t force it. Your pace will naturally increase as your body warms up.',
  'If walking doesn''t get your heart rate up enough, walk faster, add hills, wear a weighted backpack, or switch to an easy jog or bike ride. If you have bad knees, cycling or swimming are great low-impact alternatives. If you can only do 20 minutes to start, that''s fine — build up by adding 5 minutes each week.',
  '[
    {"id":"e1","name":"Trail Run/Hike","category":"cardio","sets":1,"notes":"45-90 minutes on trails. Keep a steady, sustainable pace — you should be able to talk throughout. Walk the steep hills if you need to, that''s smart pacing, not weakness."}
  ]'::jsonb,
  39
) ON CONFLICT (id) DO UPDATE SET
  name=EXCLUDED.name, type=EXCLUDED.type, equipment=EXCLUDED.equipment,
  description=EXCLUDED.description, warmup=EXCLUDED.warmup,
  modifications=EXCLUDED.modifications, exercises=EXCLUDED.exercises,
  sort_order=EXCLUDED.sort_order;

INSERT INTO workouts (id, name, type, equipment, description, warmup, modifications, exercises, sort_order)
VALUES (
  'cl2-3', 'Saddle Up', 'cardio-l2', 'bodyweight',
  'Get on a bike — real or stationary — and just pedal for a while.',
  'Start the first 5 minutes of your session at an easy pace — slower than your target pace. Let your body warm up gradually. Do a few gentle stretches if anything feels tight, but don''t force it. Your pace will naturally increase as your body warms up.',
  'If walking doesn''t get your heart rate up enough, walk faster, add hills, wear a weighted backpack, or switch to an easy jog or bike ride. If you have bad knees, cycling or swimming are great low-impact alternatives. If you can only do 20 minutes to start, that''s fine — build up by adding 5 minutes each week.',
  '[
    {"id":"e1","name":"Steady Cycling","category":"cardio","sets":1,"notes":"45-60 minutes of cycling at moderate effort. You should feel like you could keep going for another hour. If a regular ride feels too easy, add hills, increase resistance, or ride farther."}
  ]'::jsonb,
  40
) ON CONFLICT (id) DO UPDATE SET
  name=EXCLUDED.name, type=EXCLUDED.type, equipment=EXCLUDED.equipment,
  description=EXCLUDED.description, warmup=EXCLUDED.warmup,
  modifications=EXCLUDED.modifications, exercises=EXCLUDED.exercises,
  sort_order=EXCLUDED.sort_order;

INSERT INTO workouts (id, name, type, equipment, description, warmup, modifications, exercises, sort_order)
VALUES (
  'cl2-4', 'Neighborhood Patrol', 'cardio-l2', 'bodyweight',
  'Walk the neighborhood like you own it. Wave to the neighbors.',
  'Start the first 5 minutes of your session at an easy pace — slower than your target pace. Let your body warm up gradually. Do a few gentle stretches if anything feels tight, but don''t force it. Your pace will naturally increase as your body warms up.',
  'If walking doesn''t get your heart rate up enough, walk faster, add hills, wear a weighted backpack, or switch to an easy jog or bike ride. If you have bad knees, cycling or swimming are great low-impact alternatives. If you can only do 20 minutes to start, that''s fine — build up by adding 5 minutes each week.',
  '[
    {"id":"e1","name":"Power Walk","category":"cardio","sets":1,"notes":"45-60 minutes of purposeful walking — arms swinging, good pace. If regular walking doesn''t feel challenging enough, wear a backpack with some weight in it, choose a hilly route, or pick up the pace."}
  ]'::jsonb,
  41
) ON CONFLICT (id) DO UPDATE SET
  name=EXCLUDED.name, type=EXCLUDED.type, equipment=EXCLUDED.equipment,
  description=EXCLUDED.description, warmup=EXCLUDED.warmup,
  modifications=EXCLUDED.modifications, exercises=EXCLUDED.exercises,
  sort_order=EXCLUDED.sort_order;

INSERT INTO workouts (id, name, type, equipment, description, warmup, modifications, exercises, sort_order)
VALUES (
  'cl2-5', 'The Family Walk', 'cardio-l2', 'bodyweight',
  'Bring the whole family. Walk and talk. Model healthy habits for your kids.',
  'Start the first 5 minutes of your session at an easy pace — slower than your target pace. Let your body warm up gradually. Do a few gentle stretches if anything feels tight, but don''t force it. Your pace will naturally increase as your body warms up.',
  'If walking doesn''t get your heart rate up enough, walk faster, add hills, wear a weighted backpack, or switch to an easy jog or bike ride. If you have bad knees, cycling or swimming are great low-impact alternatives. If you can only do 20 minutes to start, that''s fine — build up by adding 5 minutes each week.',
  '[
    {"id":"e1","name":"Family Walk","category":"cardio","sets":1,"notes":"Walk with your family for 45-60 minutes. Match the pace of your slowest member — this is about consistency and time on your feet, not speed. If you need more challenge, carry a child on your shoulders or wear a loaded backpack."}
  ]'::jsonb,
  42
) ON CONFLICT (id) DO UPDATE SET
  name=EXCLUDED.name, type=EXCLUDED.type, equipment=EXCLUDED.equipment,
  description=EXCLUDED.description, warmup=EXCLUDED.warmup,
  modifications=EXCLUDED.modifications, exercises=EXCLUDED.exercises,
  sort_order=EXCLUDED.sort_order;

INSERT INTO workouts (id, name, type, equipment, description, warmup, modifications, exercises, sort_order)
VALUES (
  'cl2-6', 'Swim Day', 'cardio-l2', 'bodyweight',
  'If you have access to a pool or lake, swimming is one of the best low-impact cardio options.',
  'Start the first 5 minutes of your session at an easy pace — slower than your target pace. Let your body warm up gradually. Do a few gentle stretches if anything feels tight, but don''t force it. Your pace will naturally increase as your body warms up.',
  'If walking doesn''t get your heart rate up enough, walk faster, add hills, wear a weighted backpack, or switch to an easy jog or bike ride. If you have bad knees, cycling or swimming are great low-impact alternatives. If you can only do 20 minutes to start, that''s fine — build up by adding 5 minutes each week.',
  '[
    {"id":"e1","name":"Steady Swimming","category":"cardio","sets":1,"notes":"Swim at an easy, continuous pace for 30-45 minutes. Any stroke works. If you can''t swim that long continuously, swim a lap, rest at the wall for 15-20 seconds, then go again."}
  ]'::jsonb,
  43
) ON CONFLICT (id) DO UPDATE SET
  name=EXCLUDED.name, type=EXCLUDED.type, equipment=EXCLUDED.equipment,
  description=EXCLUDED.description, warmup=EXCLUDED.warmup,
  modifications=EXCLUDED.modifications, exercises=EXCLUDED.exercises,
  sort_order=EXCLUDED.sort_order;

INSERT INTO workouts (id, name, type, equipment, description, warmup, modifications, exercises, sort_order)
VALUES (
  'cl2-7', 'Row Steady', 'cardio-l2', 'full-gym',
  'The rowing machine is a hidden gem. Full body, low impact, great cardio.',
  'Start the first 5 minutes of your session at an easy pace — slower than your target pace. Let your body warm up gradually. Do a few gentle stretches if anything feels tight, but don''t force it. Your pace will naturally increase as your body warms up.',
  'If walking doesn''t get your heart rate up enough, walk faster, add hills, wear a weighted backpack, or switch to an easy jog or bike ride. If you have bad knees, cycling or swimming are great low-impact alternatives. If you can only do 20 minutes to start, that''s fine — build up by adding 5 minutes each week.',
  '[
    {"id":"e1","name":"Steady State Rowing","category":"cardio","sets":1,"notes":"Row at a comfortable, steady pace for 30-45 minutes. Keep your stroke rate around 20-24 strokes per minute. Focus on smooth, full strokes — push with your legs first, then lean back slightly, then pull arms."}
  ]'::jsonb,
  44
) ON CONFLICT (id) DO UPDATE SET
  name=EXCLUDED.name, type=EXCLUDED.type, equipment=EXCLUDED.equipment,
  description=EXCLUDED.description, warmup=EXCLUDED.warmup,
  modifications=EXCLUDED.modifications, exercises=EXCLUDED.exercises,
  sort_order=EXCLUDED.sort_order;

-- ── Cardio VO2 Max ────────────────────────────────────────────

INSERT INTO workouts (id, name, type, equipment, description, warmup, modifications, exercises, sort_order)
VALUES (
  'cvo2-1', 'Hill Repeats', 'cardio-vo2max', 'bodyweight',
  'Find a hill. Run up it. Walk down. Repeat. Simple and brutally effective.',
  'This is the one workout where warming up is critical — don''t skip it. Do 5 minutes of easy movement (walk, light jog, easy pedal). Then do 2-3 short pickups at about 70% effort for 10-15 seconds each. This preps your heart and muscles for the intense intervals ahead.',
  'If the prescribed intervals are too intense, reduce the work time (20 seconds instead of 30) or increase the rest time (2 minutes instead of 90 seconds). If running hurts your joints, substitute cycling, rowing, or burpees. If you''re brand new to high-intensity work, start with just 4-5 rounds instead of 8-10 and build up.',
  '[
    {"id":"e1","name":"Hill Sprints","category":"cardio","sets":1,"notes":"Find a steep hill that takes 30-60 seconds to sprint up. Run up as hard as you can, then walk back down to recover. That''s one repeat. Do 6-12 repeats. When you get to the top, you should be breathing so hard that talking is impossible."}
  ]'::jsonb,
  45
) ON CONFLICT (id) DO UPDATE SET
  name=EXCLUDED.name, type=EXCLUDED.type, equipment=EXCLUDED.equipment,
  description=EXCLUDED.description, warmup=EXCLUDED.warmup,
  modifications=EXCLUDED.modifications, exercises=EXCLUDED.exercises,
  sort_order=EXCLUDED.sort_order;

INSERT INTO workouts (id, name, type, equipment, description, warmup, modifications, exercises, sort_order)
VALUES (
  'cvo2-2', 'The Interval Mile', 'cardio-vo2max', 'bodyweight',
  'Short sprints. Full recovery. Maximum effort. 20-25 minutes total.',
  'This is the one workout where warming up is critical — don''t skip it. Do 5 minutes of easy movement (walk, light jog, easy pedal). Then do 2-3 short pickups at about 70% effort for 10-15 seconds each. This preps your heart and muscles for the intense intervals ahead.',
  'If the prescribed intervals are too intense, reduce the work time (20 seconds instead of 30) or increase the rest time (2 minutes instead of 90 seconds). If running hurts your joints, substitute cycling, rowing, or burpees. If you''re brand new to high-intensity work, start with just 4-5 rounds instead of 8-10 and build up.',
  '[
    {"id":"e1","name":"Running Intervals","category":"cardio","sets":1,"notes":"After a 5-minute easy warmup: sprint as fast as you can for 30 seconds, then walk or jog very easy for 90 seconds. That''s one round. Do 8-10 rounds. The sprints should feel like an 8-9 out of 10 effort."}
  ]'::jsonb,
  46
) ON CONFLICT (id) DO UPDATE SET
  name=EXCLUDED.name, type=EXCLUDED.type, equipment=EXCLUDED.equipment,
  description=EXCLUDED.description, warmup=EXCLUDED.warmup,
  modifications=EXCLUDED.modifications, exercises=EXCLUDED.exercises,
  sort_order=EXCLUDED.sort_order;

INSERT INTO workouts (id, name, type, equipment, description, warmup, modifications, exercises, sort_order)
VALUES (
  'cvo2-3', 'Burpee Blitz', 'cardio-vo2max', 'bodyweight',
  'No running required. No equipment. Just burpees and willpower.',
  'This is the one workout where warming up is critical — don''t skip it. Do 5 minutes of easy movement (walk, light jog, easy pedal). Then do 2-3 short pickups at about 70% effort for 10-15 seconds each. This preps your heart and muscles for the intense intervals ahead.',
  'If the prescribed intervals are too intense, reduce the work time (20 seconds instead of 30) or increase the rest time (2 minutes instead of 90 seconds). If running hurts your joints, substitute cycling, rowing, or burpees. If you''re brand new to high-intensity work, start with just 4-5 rounds instead of 8-10 and build up.',
  '[
    {"id":"e1","name":"Burpee Intervals","category":"cardio","sets":1,"notes":"A burpee: squat down, place your hands on the floor, jump your feet back to a push-up position, lower your chest to the floor, push up, jump your feet forward, and jump up with hands overhead. Do 30 seconds of burpees, rest 30 seconds. Repeat for 10-15 rounds."}
  ]'::jsonb,
  47
) ON CONFLICT (id) DO UPDATE SET
  name=EXCLUDED.name, type=EXCLUDED.type, equipment=EXCLUDED.equipment,
  description=EXCLUDED.description, warmup=EXCLUDED.warmup,
  modifications=EXCLUDED.modifications, exercises=EXCLUDED.exercises,
  sort_order=EXCLUDED.sort_order;

INSERT INTO workouts (id, name, type, equipment, description, warmup, modifications, exercises, sort_order)
VALUES (
  'cvo2-4', 'The Bike Sprint', 'cardio-vo2max', 'bodyweight',
  'On a bike — real or stationary. Short, all-out efforts. Great if running is hard on your joints.',
  'This is the one workout where warming up is critical — don''t skip it. Do 5 minutes of easy movement (walk, light jog, easy pedal). Then do 2-3 short pickups at about 70% effort for 10-15 seconds each. This preps your heart and muscles for the intense intervals ahead.',
  'If the prescribed intervals are too intense, reduce the work time (20 seconds instead of 30) or increase the rest time (2 minutes instead of 90 seconds). If running hurts your joints, substitute cycling, rowing, or burpees. If you''re brand new to high-intensity work, start with just 4-5 rounds instead of 8-10 and build up.',
  '[
    {"id":"e1","name":"Cycling Intervals","category":"cardio","sets":1,"notes":"After a 5-minute easy warmup: pedal as absolutely hard as you can for 20 seconds, then pedal very easy for 40 seconds. That''s one round. Do 8-12 rounds. Those 20 seconds should feel like you''re being chased."}
  ]'::jsonb,
  48
) ON CONFLICT (id) DO UPDATE SET
  name=EXCLUDED.name, type=EXCLUDED.type, equipment=EXCLUDED.equipment,
  description=EXCLUDED.description, warmup=EXCLUDED.warmup,
  modifications=EXCLUDED.modifications, exercises=EXCLUDED.exercises,
  sort_order=EXCLUDED.sort_order;

INSERT INTO workouts (id, name, type, equipment, description, warmup, modifications, exercises, sort_order)
VALUES (
  'cvo2-5', 'Stair Climber', 'cardio-vo2max', 'bodyweight',
  'Find stairs. Any stairs. Stadium bleachers, a parking ramp, your office stairwell.',
  'This is the one workout where warming up is critical — don''t skip it. Do 5 minutes of easy movement (walk, light jog, easy pedal). Then do 2-3 short pickups at about 70% effort for 10-15 seconds each. This preps your heart and muscles for the intense intervals ahead.',
  'If the prescribed intervals are too intense, reduce the work time (20 seconds instead of 30) or increase the rest time (2 minutes instead of 90 seconds). If running hurts your joints, substitute cycling, rowing, or burpees. If you''re brand new to high-intensity work, start with just 4-5 rounds instead of 8-10 and build up.',
  '[
    {"id":"e1","name":"Stair Sprints","category":"cardio","sets":1,"notes":"Sprint up the stairs as fast as you can, then walk back down. That''s one repeat. Do 8-12 repeats. Like hill repeats, you should be gasping at the top. Walk down slowly to recover."}
  ]'::jsonb,
  49
) ON CONFLICT (id) DO UPDATE SET
  name=EXCLUDED.name, type=EXCLUDED.type, equipment=EXCLUDED.equipment,
  description=EXCLUDED.description, warmup=EXCLUDED.warmup,
  modifications=EXCLUDED.modifications, exercises=EXCLUDED.exercises,
  sort_order=EXCLUDED.sort_order;

INSERT INTO workouts (id, name, type, equipment, description, warmup, modifications, exercises, sort_order)
VALUES (
  'cvo2-6', 'Jump Rope Lightning', 'cardio-vo2max', 'bodyweight',
  'A jump rope costs $10 and delivers world-class cardio. No excuses.',
  'This is the one workout where warming up is critical — don''t skip it. Do 5 minutes of easy movement (walk, light jog, easy pedal). Then do 2-3 short pickups at about 70% effort for 10-15 seconds each. This preps your heart and muscles for the intense intervals ahead.',
  'If the prescribed intervals are too intense, reduce the work time (20 seconds instead of 30) or increase the rest time (2 minutes instead of 90 seconds). If running hurts your joints, substitute cycling, rowing, or burpees. If you''re brand new to high-intensity work, start with just 4-5 rounds instead of 8-10 and build up.',
  '[
    {"id":"e1","name":"Jump Rope Intervals","category":"cardio","sets":1,"notes":"Jump rope as fast as you can for 30 seconds, rest 30 seconds. Do 10-15 rounds. If you trip up, just restart — tripping is normal. If you don''t have a rope, do imaginary jump rope (same motion, no rope)."}
  ]'::jsonb,
  50
) ON CONFLICT (id) DO UPDATE SET
  name=EXCLUDED.name, type=EXCLUDED.type, equipment=EXCLUDED.equipment,
  description=EXCLUDED.description, warmup=EXCLUDED.warmup,
  modifications=EXCLUDED.modifications, exercises=EXCLUDED.exercises,
  sort_order=EXCLUDED.sort_order;

INSERT INTO workouts (id, name, type, equipment, description, warmup, modifications, exercises, sort_order)
VALUES (
  'cvo2-7', 'The Backyard Blitz', 'cardio-vo2max', 'bodyweight',
  'No equipment, no gym, no distance needed. Just your backyard and effort.',
  'This is the one workout where warming up is critical — don''t skip it. Do 5 minutes of easy movement (walk, light jog, easy pedal). Then do 2-3 short pickups at about 70% effort for 10-15 seconds each. This preps your heart and muscles for the intense intervals ahead.',
  'If the prescribed intervals are too intense, reduce the work time (20 seconds instead of 30) or increase the rest time (2 minutes instead of 90 seconds). If running hurts your joints, substitute cycling, rowing, or burpees. If you''re brand new to high-intensity work, start with just 4-5 rounds instead of 8-10 and build up.',
  '[
    {"id":"e1","name":"Bodyweight HIIT Circuit","category":"cardio","sets":1,"notes":"Do each move for 30 seconds with 15 seconds rest between: high knees, squat jumps, mountain climbers, lateral shuffles. That''s one round. Do 4-6 rounds with 60 seconds rest between rounds. You should be drenched by round 3."}
  ]'::jsonb,
  51
) ON CONFLICT (id) DO UPDATE SET
  name=EXCLUDED.name, type=EXCLUDED.type, equipment=EXCLUDED.equipment,
  description=EXCLUDED.description, warmup=EXCLUDED.warmup,
  modifications=EXCLUDED.modifications, exercises=EXCLUDED.exercises,
  sort_order=EXCLUDED.sort_order;

INSERT INTO workouts (id, name, type, equipment, description, warmup, modifications, exercises, sort_order)
VALUES (
  'cvo2-8', 'The Rowing Rocket', 'cardio-vo2max', 'full-gym',
  'Rowing intervals. All the intensity, none of the impact on your joints.',
  'This is the one workout where warming up is critical — don''t skip it. Do 5 minutes of easy movement (walk, light jog, easy pedal). Then do 2-3 short pickups at about 70% effort for 10-15 seconds each. This preps your heart and muscles for the intense intervals ahead.',
  'If the prescribed intervals are too intense, reduce the work time (20 seconds instead of 30) or increase the rest time (2 minutes instead of 90 seconds). If running hurts your joints, substitute cycling, rowing, or burpees. If you''re brand new to high-intensity work, start with just 4-5 rounds instead of 8-10 and build up.',
  '[
    {"id":"e1","name":"Rowing Intervals","category":"cardio","sets":1,"notes":"After a 3-minute easy warmup: row as hard and fast as you can for 30 seconds, then row easy for 60 seconds. Do 8-10 rounds. Watch the watts or calories per hour — try to hit a higher number each interval."}
  ]'::jsonb,
  52
) ON CONFLICT (id) DO UPDATE SET
  name=EXCLUDED.name, type=EXCLUDED.type, equipment=EXCLUDED.equipment,
  description=EXCLUDED.description, warmup=EXCLUDED.warmup,
  modifications=EXCLUDED.modifications, exercises=EXCLUDED.exercises,
  sort_order=EXCLUDED.sort_order;

INSERT INTO workouts (id, name, type, equipment, description, warmup, modifications, exercises, sort_order)
VALUES (
  'cvo2-9', 'Kettlebell Cardio Blast', 'cardio-vo2max', 'kettlebell',
  'Kettlebell swings are cardio disguised as strength training. This will empty the tank.',
  'This is the one workout where warming up is critical — don''t skip it. Do 5 minutes of easy movement (walk, light jog, easy pedal). Then do 2-3 short pickups at about 70% effort for 10-15 seconds each. This preps your heart and muscles for the intense intervals ahead.',
  'If the prescribed intervals are too intense, reduce the work time (20 seconds instead of 30) or increase the rest time (2 minutes instead of 90 seconds). If running hurts your joints, substitute cycling, rowing, or burpees. If you''re brand new to high-intensity work, start with just 4-5 rounds instead of 8-10 and build up.',
  '[
    {"id":"e1","name":"Kettlebell Swing Intervals","category":"cardio","sets":1,"notes":"Do 20 kettlebell swings (hip hinge, snap hips forward, bell swings to chest height), then rest 30 seconds. Repeat for 10-12 rounds. By round 5, you''ll understand why this counts as cardio."}
  ]'::jsonb,
  53
) ON CONFLICT (id) DO UPDATE SET
  name=EXCLUDED.name, type=EXCLUDED.type, equipment=EXCLUDED.equipment,
  description=EXCLUDED.description, warmup=EXCLUDED.warmup,
  modifications=EXCLUDED.modifications, exercises=EXCLUDED.exercises,
  sort_order=EXCLUDED.sort_order;

-- ============================================================
-- SANITY CHECK — Run after all three batches
-- Expected results:
--   total_workouts  = 54
--   se_count        = 22  (strength-endurance)
--   sh_count        = 16  (strength-hypertrophy)
--   l2_count        =  7  (cardio-l2)
--   vo2_count       =  9  (cardio-vo2max)
--   sort_order_min  =  0
--   sort_order_max  = 53
--   missing_exercises = 0  (no workout has an empty exercises array)
-- ============================================================
SELECT
  COUNT(*)                                                    AS total_workouts,
  COUNT(*) FILTER (WHERE type = 'strength-endurance')         AS se_count,
  COUNT(*) FILTER (WHERE type = 'strength-hypertrophy')       AS sh_count,
  COUNT(*) FILTER (WHERE type = 'cardio-l2')                  AS l2_count,
  COUNT(*) FILTER (WHERE type = 'cardio-vo2max')              AS vo2_count,
  MIN(sort_order)                                             AS sort_order_min,
  MAX(sort_order)                                             AS sort_order_max,
  COUNT(*) FILTER (WHERE jsonb_array_length(exercises) = 0)   AS missing_exercises
FROM workouts;
