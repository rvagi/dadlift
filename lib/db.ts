/**
 * Data layer — local storage only. No auth required.
 * Uses AsyncStorage on native, localStorage on web.
 * Supabase/accounts can be layered on top later.
 */

import { Platform } from 'react-native';

// ─── Types ────────────────────────────────────────────────────────────────────

export type WeekPlan = Record<string, string>;

export type SetLog = {
  reps?: string;   // bilateral value (reps, seconds, or distance per tracking_type)
  weight?: string; // load, when the exercise is weighted
  left?: string;   // unilateral value for the left side
  right?: string;  // unilateral value for the right side
};
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
    // silently fail in environments without native storage (e.g. Expo Go)
  }
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

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

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
  current[log.workout_id].push({ ...log, id: log.id ?? generateId() });
  await setItem(KEYS.logs, JSON.stringify(current));
}

export async function saveAllLogs(logs: Record<string, WorkoutLog[]>): Promise<void> {
  await setItem(KEYS.logs, JSON.stringify(logs));
}

export async function deleteAllWorkoutLogs(): Promise<void> {
  await setItem(KEYS.logs, JSON.stringify({}));
}

export async function updateWorkoutLog(workoutId: string, logId: string, updates: Partial<WorkoutLog>): Promise<void> {
  const current = await loadWorkoutLogs();
  if (!current[workoutId]) return;
  current[workoutId] = current[workoutId].map(l => l.id === logId ? { ...l, ...updates } : l);
  await setItem(KEYS.logs, JSON.stringify(current));
}

// ─── In-progress workout draft ────────────────────────────────────────────────

const DRAFT_PREFIX = '@dadlift:draft:';

export type WorkoutDraft = {
  exerciseLog: ExerciseLog;
  duration: string;
  notes: string;
};

export async function saveDraft(workoutId: string, draft: WorkoutDraft): Promise<void> {
  await setItem(DRAFT_PREFIX + workoutId, JSON.stringify(draft));
}

export async function loadDraft(workoutId: string): Promise<WorkoutDraft | null> {
  try {
    const raw = await getItem(DRAFT_PREFIX + workoutId);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function clearDraft(workoutId: string): Promise<void> {
  await setItem(DRAFT_PREFIX + workoutId, '');
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
