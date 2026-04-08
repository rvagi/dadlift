/**
 * Data layer — local storage only. No auth required.
 * Uses AsyncStorage on native, localStorage on web.
 * Supabase/accounts can be layered on top later.
 */

import { Platform } from 'react-native';

// ─── Types ────────────────────────────────────────────────────────────────────

export type WeekPlan = Record<string, string>;

export type SetLog = { reps?: string; weight?: string };
export type ExerciseLog = Record<string, SetLog[]>;
export type WorkoutLog = {
  id?: string;
  workout_id: string;
  logged_at: string;
  data: {
    exercises?: ExerciseLog;
    duration?: string;
    notes?: string;
  };
};

export type CustomWorkout = {
  id: string;
  name: string;
  description: string;
  type: string;
  equipment: string;
  custom: true;
  exercises: {
    id: string;
    name: string;
    category: string;
    sets: number;
    notes: string;
    videoUrl?: string;
  }[];
};

export type Profile = {
  equipment: string[];
  month_label: string;
  onboarded: boolean;
};

// ─── Storage primitives ───────────────────────────────────────────────────────

const KEYS = {
  profile: '@dadlift:profile',
  weekPlan: '@dadlift:weekplan',
  logs: '@dadlift:logs',
  custom: '@dadlift:custom',
};

async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(key);
  }
  const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
  return AsyncStorage.getItem(key);
}

async function setItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, value);
    return;
  }
  const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
  await AsyncStorage.setItem(key, value);
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export async function loadProfile(): Promise<Profile> {
  try {
    const raw = await getItem(KEYS.profile);
    if (!raw) return { equipment: [], month_label: '', onboarded: false };
    return JSON.parse(raw);
  } catch {
    return { equipment: [], month_label: '', onboarded: false };
  }
}

export async function saveProfile(updates: Partial<Profile>): Promise<void> {
  const current = await loadProfile();
  const next = { ...current, ...updates };
  await setItem(KEYS.profile, JSON.stringify(next));
}

// ─── Week Plan ────────────────────────────────────────────────────────────────

export async function loadWeekPlan(): Promise<WeekPlan> {
  try {
    const raw = await getItem(KEYS.weekPlan);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export async function saveWeekPlan(plan: WeekPlan): Promise<void> {
  await setItem(KEYS.weekPlan, JSON.stringify(plan));
}

// ─── Workout Logs ─────────────────────────────────────────────────────────────

export async function loadWorkoutLogs(): Promise<Record<string, WorkoutLog[]>> {
  try {
    const raw = await getItem(KEYS.logs);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export async function appendWorkoutLog(log: WorkoutLog): Promise<void> {
  const current = await loadWorkoutLogs();
  if (!current[log.workout_id]) current[log.workout_id] = [];
  current[log.workout_id].push({ ...log, id: log.id ?? Date.now().toString() });
  await setItem(KEYS.logs, JSON.stringify(current));
}

export async function deleteAllWorkoutLogs(): Promise<void> {
  await setItem(KEYS.logs, JSON.stringify({}));
}

// ─── Custom Workouts ──────────────────────────────────────────────────────────

export async function loadCustomWorkouts(): Promise<CustomWorkout[]> {
  try {
    const raw = await getItem(KEYS.custom);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function saveCustomWorkout(workout: CustomWorkout): Promise<void> {
  const current = await loadCustomWorkouts();
  const idx = current.findIndex(w => w.id === workout.id);
  if (idx >= 0) current[idx] = workout;
  else current.push(workout);
  await setItem(KEYS.custom, JSON.stringify(current));
}

export async function deleteCustomWorkout(workoutId: string): Promise<void> {
  const current = await loadCustomWorkouts();
  await setItem(KEYS.custom, JSON.stringify(current.filter(w => w.id !== workoutId)));
}
