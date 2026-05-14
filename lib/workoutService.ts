/**
 * Workout data loader — three-layer fallback:
 *   1. Supabase (fresh data, written to cache on success)
 *   2. AsyncStorage cache (used when network is unavailable)
 *   3. Bundled WORKOUTS constant (last resort, always available)
 */

import { Platform } from 'react-native';
import { supabase } from './supabase';
import { WORKOUTS, type Exercise, type Workout } from './workouts';

const CACHE_KEY = '@dadlift:workouts_cache';

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

// ── Public API ────────────────────────────────────────────────

/**
 * Load workouts with automatic fallback.
 * On a successful network fetch the result is written to the local
 * cache so subsequent offline launches still have fresh content.
 */
export async function loadWorkouts(): Promise<Workout[]> {
  // ── Layer 1: Supabase ───────────────────────────────────────
  try {
    const { data, error } = await supabase
      .from('workouts')
      .select('id, name, type, equipment, description, warmup, modifications, exercises')
      .order('sort_order');

    if (!error && data && data.length > 0) {
      const workouts = data.map(rowToWorkout);
      // Fire-and-forget cache write — don't block the return
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
      if (workouts.length > 0) return workouts;
    }
  } catch {
    // Corrupt cache — fall through
  }

  // ── Layer 3: Bundled fallback ───────────────────────────────
  return WORKOUTS;
}

/**
 * Wipe the local workouts cache.
 * Useful in tests or a dev settings screen to verify fallback behaviour.
 */
export async function clearWorkoutsCache(): Promise<void> {
  await setItem(CACHE_KEY, JSON.stringify([]));
}
