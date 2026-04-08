/**
 * Data layer — mirrors the prototype's save/load helpers but uses Supabase.
 * All functions assume the user is already signed in (anonymous or otherwise).
 */

import { supabase } from './supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

export type WeekPlan = Record<string, string>; // { Monday: 'se-bw-1', Tuesday: 'rest', ... }

export type SetLog = { reps?: string; weight?: string };
export type ExerciseLog = Record<string, SetLog[]>; // { e1: [{reps:'10'}, ...], ... }
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

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function signInAnonymously(): Promise<string> {
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  return data.user!.id;
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export async function loadProfile(): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .select('equipment, month_label, onboarded')
    .single();
  if (error || !data) return { equipment: [], month_label: '', onboarded: false };
  return {
    equipment: data.equipment ?? [],
    month_label: data.month_label ?? '',
    onboarded: data.onboarded ?? false,
  };
}

export async function saveProfile(updates: Partial<Profile>): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const payload: Record<string, unknown> = { id: user.id, updated_at: new Date().toISOString() };
  if (updates.equipment !== undefined) payload.equipment = updates.equipment;
  if (updates.month_label !== undefined) payload.month_label = updates.month_label;
  if (updates.onboarded !== undefined) payload.onboarded = updates.onboarded;

  await supabase.from('profiles').upsert(payload);
}

// ─── Week Plan ────────────────────────────────────────────────────────────────

export async function loadWeekPlan(): Promise<WeekPlan> {
  const { data, error } = await supabase.from('week_plans').select('day, workout_id');
  if (error || !data) return {};
  return Object.fromEntries(data.map((r) => [r.day, r.workout_id]));
}

export async function saveWeekPlan(plan: WeekPlan): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Delete all existing rows then insert fresh (simplest approach for a small dataset)
  await supabase.from('week_plans').delete().eq('user_id', user.id);

  const rows = Object.entries(plan).map(([day, workout_id]) => ({
    user_id: user.id,
    day,
    workout_id,
    updated_at: new Date().toISOString(),
  }));

  if (rows.length > 0) {
    await supabase.from('week_plans').insert(rows);
  }
}

// ─── Workout Logs ─────────────────────────────────────────────────────────────

export async function loadWorkoutLogs(): Promise<Record<string, WorkoutLog[]>> {
  const { data, error } = await supabase
    .from('workout_logs')
    .select('id, workout_id, logged_at, data')
    .order('logged_at', { ascending: true });

  if (error || !data) return {};

  const result: Record<string, WorkoutLog[]> = {};
  for (const row of data) {
    if (!result[row.workout_id]) result[row.workout_id] = [];
    result[row.workout_id].push({
      id: row.id,
      workout_id: row.workout_id,
      logged_at: row.logged_at,
      data: row.data,
    });
  }
  return result;
}

export async function appendWorkoutLog(log: WorkoutLog): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from('workout_logs').insert({
    user_id: user.id,
    workout_id: log.workout_id,
    logged_at: log.logged_at,
    data: log.data,
  });
}

export async function deleteAllWorkoutLogs(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from('workout_logs').delete().eq('user_id', user.id);
}

// ─── Custom Workouts ──────────────────────────────────────────────────────────

export async function loadCustomWorkouts(): Promise<CustomWorkout[]> {
  const { data, error } = await supabase
    .from('custom_workouts')
    .select('data')
    .order('created_at', { ascending: true });
  if (error || !data) return [];
  return data.map((r) => r.data as CustomWorkout);
}

export async function saveCustomWorkout(workout: CustomWorkout): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from('custom_workouts').upsert({
    user_id: user.id,
    workout_id: workout.id,
    data: workout,
  });
}

export async function deleteCustomWorkout(workoutId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from('custom_workouts').delete()
    .eq('user_id', user.id)
    .eq('workout_id', workoutId);
}
