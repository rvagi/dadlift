/**
 * Exercise tagging — single source of truth for how a movement is logged.
 *
 * The bundled WORKOUTS already carry explicit is_weighted / is_unilateral /
 * tracking_type values. Live Supabase rows may predate those columns, so
 * `computeTags` reproduces the Phase-1 tagging rules to backfill any exercise
 * that arrives without them (see enrichExercise in workoutService).
 */

import type { Exercise } from './workouts';

export type TrackingType = 'reps' | 'time' | 'distance';

// Genuine bodyweight movements (everything else uses external load).
const BODYWEIGHT = new Set<string>([
  'Push-Ups', 'Inverted Row', 'Bodyweight Squats', 'Dead Bug', 'Decline Push-Ups (feet on bench)',
  'Walking Lunges', 'Plank Hold', 'Diamond Push-Ups', 'Superman Holds', 'Jump Squats', 'Bird Dog',
  'Pike Push-Ups', 'Doorway Rows', 'Bulgarian Split Squat', 'Flutter Kicks', 'Incline Push-Ups (hands on bench)',
  'Picnic Table Rows', 'Step-Ups (on bench)', 'Pull-Ups', 'Bodyweight Lunges', 'Chair Dips',
  'Door-Anchored Towel Rows', 'Wall Sit', 'Tempo Push-Ups (3 sec down)', 'Tempo Inverted Rows (3 sec up)',
  'Pistol Squat Progressions', 'Mountain Climbers (slow)', 'Archer Push-Ups', 'Skater Squats',
  'Hanging Knee Raise', 'Ab Wheel Rollout',
]);

// Performed one side at a time → logged per-side.
const UNILATERAL = new Set<string>([
  'Kettlebell Push Press', 'Kettlebell Single-Arm Row', 'Kettlebell Floor Press', 'Kettlebell Overhead Press',
  'KB Turkish Get-Up (half)', 'KB Windmill', 'KB Gorilla Row', 'KB Bottoms-Up Press', 'KB Renegade Row',
  'Cable Pallof Press', 'Cable Press (low to high)', 'Cable Woodchop', 'Landmine Press', 'Dumbbell Row',
  'Dumbbell Bulgarian Split Squat', 'Dumbbell Woodchop', 'Dumbbell Suitcase Carry', 'Bucket Suitcase Carry',
  'Pistol Squat Progressions', 'Skater Squats', 'Bulgarian Split Squat', 'Kid-on-Back Rows',
  // Tier A: alternating single-leg / single-arm — logged reps-per-side within a set.
  'Walking Lunges', 'Bodyweight Lunges', 'Kettlebell Reverse Lunges', 'Step-Ups (on bench)',
  'Dumbbell Step-Ups', 'Dumbbell Walking Lunge (heavy)', 'Bucket Farmer Carry Lunges',
  'Dumbbell Push-Up to Row',
]);

// Held for time.
const TIME = new Set<string>([
  'Plank Hold', 'Superman Holds', 'Wall Sit', 'Dumbbell Renegade Row Plank',
]);

// Loaded carries → distance (with a time fallback).
const DISTANCE = new Set<string>([
  "Dumbbell Farmer's Carry", 'Dumbbell Suitcase Carry', 'Bucket Suitcase Carry',
  'Sled Push', 'Heavy Sled Push', 'Sled Pull (rope)',
]);

export function computeTags(name: string, category: string): {
  is_weighted: boolean; is_unilateral: boolean; tracking_type: TrackingType;
} {
  const cardio = category === 'cardio';
  const is_weighted = !cardio && !BODYWEIGHT.has(name);
  const is_unilateral = UNILATERAL.has(name);
  let tracking_type: TrackingType = 'reps';
  if (cardio || TIME.has(name)) tracking_type = 'time';
  else if (DISTANCE.has(name)) tracking_type = 'distance';
  return { is_weighted, is_unilateral, tracking_type };
}

/** Backfill any missing tag fields on an exercise (idempotent). */
export function enrichExercise(ex: Exercise): Exercise {
  if (ex.is_weighted !== undefined && ex.is_unilateral !== undefined && ex.tracking_type !== undefined) {
    return ex;
  }
  const t = computeTags(ex.name, ex.category);
  return {
    ...ex,
    is_weighted: ex.is_weighted ?? t.is_weighted,
    is_unilateral: ex.is_unilateral ?? t.is_unilateral,
    tracking_type: ex.tracking_type ?? t.tracking_type,
  };
}

export function trackingType(ex: Pick<Exercise, 'tracking_type'>): TrackingType {
  return ex.tracking_type ?? 'reps';
}

/** Short unit label for an exercise's logged value. */
export function valueUnit(ex: Pick<Exercise, 'tracking_type'>): string {
  switch (trackingType(ex)) {
    case 'time': return 'sec';
    case 'distance': return 'yds';
    default: return 'reps';
  }
}

/** Placeholder text for the value input. */
export function valuePlaceholder(ex: Pick<Exercise, 'tracking_type'>): string {
  switch (trackingType(ex)) {
    case 'time': return 'sec';
    case 'distance': return 'yds';
    default: return 'reps';
  }
}
