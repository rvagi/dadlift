import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  loadProfile, saveProfile,
  loadWeekPlan, saveWeekPlan as dbSaveWeekPlan,
  loadWorkoutLogs, appendWorkoutLog, deleteAllWorkoutLogs,
  loadCustomWorkouts, saveCustomWorkout, deleteCustomWorkout,
  type WeekPlan, type WorkoutLog, type CustomWorkout, type Profile,
} from '@/lib/db';
import { WORKOUTS, type Workout } from '@/lib/workouts';

type PlanSlot = { day: string; type: string } | null;
type BrowseFilter = { type: string | null; equip: string | null };

type AppContextValue = {
  isReady: boolean;
  onboarded: boolean;
  equipment: string[];
  weekPlan: WeekPlan;
  workoutLogs: Record<string, WorkoutLog[]>;
  customWorkouts: CustomWorkout[];
  monthLabel: string;
  planSlot: PlanSlot;
  browseFilter: BrowseFilter;
  allWorkouts: Workout[];
  // Actions
  completeOnboarding: (equipment: string[]) => Promise<void>;
  setEquipment: (eq: string[]) => Promise<void>;
  setWeekPlan: (plan: WeekPlan) => Promise<void>;
  setMonthLabel: (label: string) => Promise<void>;
  logWorkout: (log: WorkoutLog) => Promise<void>;
  clearWorkoutHistory: () => Promise<void>;
  addCustomWorkout: (w: CustomWorkout) => Promise<void>;
  removeCustomWorkout: (id: string) => Promise<void>;
  setPlanSlot: (slot: PlanSlot) => void;
  setBrowseFilter: (f: BrowseFilter) => void;
  getLastLog: (workoutId: string) => WorkoutLog | null;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [equipment, setEquipmentState] = useState<string[]>([]);
  const [weekPlan, setWeekPlanState] = useState<WeekPlan>({});
  const [workoutLogs, setWorkoutLogsState] = useState<Record<string, WorkoutLog[]>>({});
  const [customWorkouts, setCustomWorkoutsState] = useState<CustomWorkout[]>([]);
  const [monthLabel, setMonthLabelState] = useState('');
  const [planSlot, setPlanSlot] = useState<PlanSlot>(null);
  const [browseFilter, setBrowseFilter] = useState<BrowseFilter>({ type: null, equip: null });

  useEffect(() => {
    (async () => {
      try {
        const [profile, plan, logs, customs] = await Promise.all([
          loadProfile(),
          loadWeekPlan(),
          loadWorkoutLogs(),
          loadCustomWorkouts(),
        ]);
        setOnboarded(profile.onboarded);
        setEquipmentState(profile.equipment);
        setMonthLabelState(profile.month_label);
        setWeekPlanState(plan);
        setWorkoutLogsState(logs);
        setCustomWorkoutsState(customs);
      } catch (e) {
        console.error('App init error:', e);
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

  const completeOnboarding = useCallback(async (eq: string[]) => {
    setEquipmentState(eq);
    setOnboarded(true);
    await saveProfile({ equipment: eq, onboarded: true });
  }, []);

  const setEquipment = useCallback(async (eq: string[]) => {
    setEquipmentState(eq);
    await saveProfile({ equipment: eq });
  }, []);

  const setWeekPlan = useCallback(async (plan: WeekPlan) => {
    setWeekPlanState(plan);
    await dbSaveWeekPlan(plan);
  }, []);

  const setMonthLabel = useCallback(async (label: string) => {
    setMonthLabelState(label);
    await saveProfile({ month_label: label });
  }, []);

  const logWorkout = useCallback(async (log: WorkoutLog) => {
    setWorkoutLogsState(prev => {
      const next = { ...prev };
      if (!next[log.workout_id]) next[log.workout_id] = [];
      next[log.workout_id] = [...next[log.workout_id], log];
      return next;
    });
    await appendWorkoutLog(log);
  }, []);

  const clearWorkoutHistory = useCallback(async () => {
    setWorkoutLogsState({});
    await deleteAllWorkoutLogs();
  }, []);

  const addCustomWorkout = useCallback(async (w: CustomWorkout) => {
    setCustomWorkoutsState(prev => [...prev, w]);
    await saveCustomWorkout(w);
  }, []);

  const removeCustomWorkout = useCallback(async (id: string) => {
    setCustomWorkoutsState(prev => prev.filter(w => w.id !== id));
    await deleteCustomWorkout(id);
  }, []);

  const getLastLog = useCallback((workoutId: string): WorkoutLog | null => {
    const logs = workoutLogs[workoutId];
    if (!logs || logs.length === 0) return null;
    return logs[logs.length - 1];
  }, [workoutLogs]);

  const allWorkouts = [...WORKOUTS, ...customWorkouts] as Workout[];

  return (
    <AppContext.Provider value={{
      isReady, onboarded, equipment, weekPlan, workoutLogs,
      customWorkouts, monthLabel, planSlot, browseFilter, allWorkouts,
      completeOnboarding, setEquipment, setWeekPlan, setMonthLabel,
      logWorkout, clearWorkoutHistory, addCustomWorkout, removeCustomWorkout,
      setPlanSlot, setBrowseFilter, getLastLog,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
