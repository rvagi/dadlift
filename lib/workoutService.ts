/**
 * Workout data loader — three-layer fallback:
 *   1. Supabase (fresh data, written to cache on success)
 *   2. AsyncStorage cache (used when network is unavailable)
 *   3. Bundled WORKOUTS constant (last resort, always available)
 */

import { Platform } from 'react-native';
import { supabase } from './supabase';
import { WORKOUTS, type Exercise, type Workout } from './workouts';
import { enrichExercise } from './exerciseTags';

// Bumped to _v2 to one-time-invalidate caches written before exercise tags
// (is_weighted / is_unilateral / tracking_type) existed. The old key is never
// read again; LEGACY_CACHE_KEYS are purged once on first load below.
const CACHE_KEY = '@dadlift:workouts_cache_v2';
const LEGACY_CACHE_KEYS = ['@dadlift:workouts_cache'];

// ── Storage helpers (same pattern as lib/db.ts) ───────────────

async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(key);
  }
  try {
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    return await AsyncStorage.getItem(key);
  } catch {
    return null;
  }
}

async function setItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, value);
    return;
  }
  try {
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    await AsyncStorage.setItem(key, value);
  } catch {
    // silently fail — cache write failure is non-fatal
  }
}

async function removeItem(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(key);
    return;
  }
  try {
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    await AsyncStorage.removeItem(key);
  } catch {
    // silently fail — cleanup failure is non-fatal
  }
}

// Purge superseded cache keys exactly once per app process.
let legacyPurged = false;
async function purgeLegacyCaches(): Promise<void> {
  if (legacyPurged) return;
  legacyPurged = true;
  await Promise.all(LEGACY_CACHE_KEYS.map(removeItem));
}

// ── Row → Workout mapper ──────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToWorkout(row: any): Workout {
  return {
    id: row.id,
    name: row.name,
    type: row.type as Workout['type'],
    equipment: row.equipment as Workout['equipment'],
    description: row.description,
    warmup: row.warmup ?? undefined,
    modifications: row.modifications ?? undefined,
    exercises: row.exercises as Exercise[],
  };
}

/**
 * Single normalizer every load path returns through. Backfills
 * is_weighted / is_unilateral / tracking_type on every exercise so a source
 * that lacks them (live rows predating the DB migration, or a stale cache blob
 * written before the tag columns existed) can never strip the logging tags.
 * enrichExercise is idempotent, so the already-tagged bundle is a cheap no-op.
 */
function normalize(workouts: Workout[]): Workout[] {
  return workouts.map(w => ({ ...w, exercises: w.exercises.map(enrichExercise) }));
}

// ── Public API ────────────────────────────────────────────────

/**
 * Load workouts with automatic fallback.
 * On a successful network fetch the result is written to the local
 * cache so subsequent offline launches still have fresh content.
 */
export async function loadWorkouts(): Promise<Workout[]> {
  // One-time cleanup of pre-tag cache blobs (key bump already bypasses them).
  await purgeLegacyCaches();

  // ── Layer 1: Supabase ───────────────────────────────────────
  try {
    const { data, error } = await supabase
      .from('workouts')
      .select('id, name, type, equipment, description, warmup, modifications, exercises')
      .order('sort_order');

    if (!error && data && data.length > 0) {
      const workouts = normalize(data.map(rowToWorkout));
      // Fire-and-forget cache write — store the enriched shape
      setItem(CACHE_KEY, JSON.stringify(workouts));
      return workouts;
    }
  } catch {
    // Network error or Supabase unavailable — fall through
  }

  // ── Layer 2: AsyncStorage cache ─────────────────────────────
  try {
    const cached = await getItem(CACHE_KEY);
    if (cached) {
      const workouts = JSON.parse(cached) as Workout[];
      // Enrich on read so a stale, tagless cache blob can't strip the tags.
      if (workouts.length > 0) return normalize(workouts);
    }
  } catch {
    // Corrupt cache — fall through
  }

  // ── Layer 3: Bundled fallback ───────────────────────────────
  return normalize(WORKOUTS);
}

/**
 * Wipe the local workouts cache.
 * Useful in tests or a dev settings screen to verify fallback behaviour.
 */
export async function clearWorkoutsCache(): Promise<void> {
  await setItem(CACHE_KEY, JSON.stringify([]));
}
