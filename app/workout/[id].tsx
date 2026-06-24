import { useState, useEffect, useRef } from 'react';
import {
  ScrollView, View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, Linking, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { colors, fonts, workoutTypes, equipmentOptions } from '@/constants/theme';
import { saveDraft, loadDraft, clearDraft, type WorkoutLog } from '@/lib/db';
import { valueUnit, type TrackingType } from '@/lib/exerciseTags';

function Tag({ label, color }: { label: string; color: string }) {
  return (
    <View style={[styles.tag, { backgroundColor: color + '22' }]}>
      <Text style={[styles.tagText, { color }]}>{label.toUpperCase()}</Text>
    </View>
  );
}

type SetData = { reps: string; weight: string; left?: string; right?: string };
type ExerciseLogData = Record<string, SetData[]>;

export default function WorkoutScreen() {
  const { id, logId } = useLocalSearchParams<{ id: string; logId?: string }>();
  const { allWorkouts, getLastLog, logWorkout, workoutLogs, updateLog } = useApp();
  const router = useRouter();

  const workout = allWorkouts.find(w => w.id === id);

  const isEndurance = workout?.type === 'strength-endurance';
  const isHypertrophy = workout?.type === 'strength-hypertrophy';
  const isCardio = workout?.type?.startsWith('cardio') ?? false;

  // Per-exercise logging shape. Untagged (e.g. custom) exercises fall back to
  // the old behaviour: weight only for hypertrophy, bilateral rep counts.
  type ExLike = { is_weighted?: boolean; is_unilateral?: boolean; tracking_type?: TrackingType };
  const exWeighted = (ex: ExLike) => ex.is_weighted ?? isHypertrophy;
  const exUnilateral = (ex: ExLike) => ex.is_unilateral ?? false;
  const exTracking = (ex: ExLike): TrackingType => ex.tracking_type ?? 'reps';

  const lastSummary = (ex: ExLike, s: SetData): string => {
    const unit = valueUnit(ex);
    const w = exWeighted(ex) ? `${s.weight || '?'} lbs × ` : '';
    if (exUnilateral(ex)) return `${w}${s.left || '?'}/${s.right || '?'} ${unit} (L/R)`;
    return `${w}${s.reps || '?'} ${unit}`;
  };

  // Edit mode: find the log being edited
  const editingLog = logId && workout
    ? (workoutLogs[workout.id] ?? []).find(l => l.id === logId) ?? null
    : null;

  // Build initial log state — pre-fill from editingLog if in edit mode
  const [exerciseLog, setExerciseLog] = useState<ExerciseLogData>(() => {
    if (!workout || isCardio) return {};
    if (editingLog?.data?.exercises) {
      return editingLog.data.exercises as ExerciseLogData;
    }
    const data: ExerciseLogData = {};
    workout.exercises.forEach(ex => {
      data[ex.id] = Array.from({ length: ex.sets }, () => ({ reps: '', weight: '' }));
    });
    return data;
  });
  const [duration, setDuration] = useState(editingLog?.data?.duration ?? '');
  const [notes, setNotes] = useState(editingLog?.data?.notes ?? '');

  // Ref to gate draft saves until after the restore attempt completes
  const draftReady = useRef(false);
  const draftTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // Restore draft on mount (new workouts only)
  useEffect(() => {
    if (logId || isCardio || !workout) {
      draftReady.current = true;
      return;
    }
    loadDraft(workout.id).then(draft => {
      if (draft) {
        setExerciseLog(draft.exerciseLog as ExerciseLogData);
        setDuration(draft.duration);
        setNotes(draft.notes);
      }
      draftReady.current = true;
    });
  }, []); // intentionally runs once on mount

  // Debounced draft save whenever state changes (new workouts only)
  useEffect(() => {
    if (!draftReady.current || logId || isCardio || !workout) return;
    if (draftTimer.current) clearTimeout(draftTimer.current);
    draftTimer.current = setTimeout(() => {
      saveDraft(workout.id, { exerciseLog, duration, notes });
    }, 500);
    return () => {
      if (draftTimer.current) clearTimeout(draftTimer.current);
    };
  }, [exerciseLog, duration, notes]);

  if (!workout) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.p}>Workout not found.</Text>
          <TouchableOpacity onPress={() => router.back()}><Text style={styles.backBtn}>← Go Back</Text></TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const typeInfo = workoutTypes[workout.type];
  const lastLog = getLastLog(workout.id);

  const updateSet = (exId: string, setIdx: number, field: keyof SetData, value: string) => {
    setExerciseLog(prev => {
      const next = { ...prev, [exId]: [...prev[exId]] };
      next[exId][setIdx] = { ...next[exId][setIdx], [field]: value };
      return next;
    });
  };

  const getLastSet = (exId: string, setIdx: number): SetData | null => {
    if (!lastLog?.data?.exercises) return null;
    const s = lastLog.data.exercises[exId]?.[setIdx];
    if (!s) return null;
    return { reps: s.reps ?? '', weight: s.weight ?? '', left: s.left ?? '', right: s.right ?? '' };
  };

  const handleSave = () => {
    if (editingLog && logId) {
      // Edit mode: overwrite existing log entry
      const updates: Partial<WorkoutLog> = {
        data: isCardio ? { duration, notes } : { exercises: exerciseLog, notes },
      };
      updateLog(workout.id, logId, updates).catch(console.error);
      router.replace('/(tabs)/history');
    } else {
      // New log
      const log: WorkoutLog = {
        workout_id: workout.id,
        logged_at: new Date().toISOString(),
        data: isCardio ? { duration, notes } : { exercises: exerciseLog, notes },
      };
      logWorkout(log).catch(console.error);
      clearDraft(workout.id);
      router.replace('/(tabs)');
    }
  };

  // Open the interval timer, pre-filled from this workout's prescribed
  // structure when it has one. Available on every workout (built-in or custom);
  // custom/non-interval workouts just get editable defaults.
  const openTimer = () => {
    const t = workout.timer;
    router.push({
      pathname: '/timer',
      params: t
        ? { work: String(t.work), rest: String(t.rest), rounds: String(t.rounds), name: workout.name }
        : {},
    });
  };

  const confirmBack = () => {
    const isEditing = !!editingLog;
    Alert.alert(
      isEditing ? 'Discard Changes?' : 'Quit Workout?',
      isEditing ? "Your edits won't be saved." : "Your progress won't be saved.",
      [
        { text: isEditing ? 'Keep Editing' : 'Keep Going', style: 'cancel' },
        {
          text: isEditing ? 'Discard' : 'Quit',
          style: 'destructive',
          onPress: () => {
            if (!logId) clearDraft(workout.id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Back */}
          <TouchableOpacity onPress={confirmBack} style={styles.backRow}>
            <Text style={styles.backBtn}>← Back</Text>
          </TouchableOpacity>

          {/* Edit mode banner */}
          {editingLog && (
            <View style={styles.editingBanner}>
              <Text style={styles.editingBannerText}>✏️  EDITING PAST WORKOUT</Text>
            </View>
          )}

          {/* Header */}
          <View style={{ flexDirection: 'row', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
            <Tag label={typeInfo.short} color={typeInfo.color} />
            {(() => {
              const eq = equipmentOptions.find(e => e.id === workout.equipment);
              return eq ? <Tag label={`${eq.icon} ${eq.label}`} color="#888" /> : null;
            })()}
          </View>
          <Text style={styles.h1}>{workout.name}</Text>
          <Text style={styles.p}>{workout.description}</Text>

          {/* Universal interval-timer tool — available on any workout */}
          <TouchableOpacity style={styles.timerBtn} onPress={openTimer}>
            <Text style={styles.timerBtnText}>
              ⏱  Interval Timer{workout.timer ? ' — prescribed' : ''}
            </Text>
          </TouchableOpacity>

          {/* Warm-up */}
          {workout.warmup && (
            <View style={[styles.card, { backgroundColor: colors.warningSoft, borderColor: colors.warning }]}>
              <Text style={styles.cardTitle}>Warm-Up First:</Text>
              <Text style={[styles.p, { marginBottom: 0 }]}>{workout.warmup}</Text>
            </View>
          )}

          {/* How-to banner */}
          {isHypertrophy && (
            <View style={[styles.card, { backgroundColor: colors.accentSoft, borderColor: colors.accent }]}>
              <Text style={styles.cardTitle}>How to do this workout:</Text>
              <Text style={[styles.p, { marginBottom: 6 }]}>Each exercise has 4 sets. Aim for 6-10 reps per set. Pick a weight that makes the last 2-3 reps feel hard.</Text>
              <Text style={[styles.p, { marginBottom: 0 }]}><Text style={{ color: colors.text, fontFamily: fonts.semibold }}>Getting stronger:</Text> When you can do 10 reps on every set, increase the weight by 5 lbs for upper body or 10 lbs for legs next time.</Text>
            </View>
          )}
          {isEndurance && (
            <View style={[styles.card, { backgroundColor: colors.successSoft, borderColor: colors.success }]}>
              <Text style={styles.cardTitle}>How to do this workout:</Text>
              <Text style={[styles.p, { marginBottom: 6 }]}>Each exercise has 4 sets. Do each set to max reps, then rest 60-90 seconds. Short on time? Run it as a circuit — one set of each exercise back-to-back, then repeat.</Text>
              <Text style={[styles.p, { marginBottom: 0 }]}>Record how many reps you completed each set. Next time, try to beat those numbers.</Text>
            </View>
          )}
          {isCardio && (
            <View style={[styles.card, { backgroundColor: colors.successSoft, borderColor: colors.success }]}>
              <Text style={styles.cardTitle}>How to do this workout:</Text>
              <Text style={[styles.p, { marginBottom: 0 }]}>Read the instructions below, do the workout, then come back and log how long it took. Consistency matters more than perfection.</Text>
            </View>
          )}

          {/* Modifications */}
          {workout.modifications && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Need to modify?</Text>
              <Text style={[styles.p, { marginBottom: 0 }]}>{workout.modifications}</Text>
            </View>
          )}

          {/* Exercises */}
          {!isCardio && workout.exercises.map(ex => (
            <View key={ex.id} style={[styles.card, { marginBottom: 16 }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.overline, { color: typeInfo.color }]}>{ex.category}</Text>
                  <Text style={styles.h3}>{ex.name}</Text>
                </View>
                {ex.videoUrl && (
                  <TouchableOpacity
                    style={styles.formBtn}
                    onPress={() => Linking.openURL(ex.videoUrl!)}
                  >
                    <Text style={styles.formBtnText}>📹 Form</Text>
                  </TouchableOpacity>
                )}
              </View>
              <Text style={[styles.p, { marginBottom: ex.advanced_modification ? 4 : 12 }]}>{ex.notes}</Text>
              {!!ex.advanced_modification && (
                <Text style={styles.advancedMod}>Advanced: {ex.advanced_modification}</Text>
              )}

              {/* Set rows */}
              {(() => {
                const weighted = exWeighted(ex);
                const unilateral = exUnilateral(ex);
                const unit = valueUnit(ex);
                return (exerciseLog[ex.id] ?? []).map((setData, si) => {
                  const lastSet = getLastSet(ex.id, si);
                  return (
                    <View key={si} style={{ marginBottom: 8 }}>
                      {(() => {
                        const useBtn = lastSet ? (
                          <TouchableOpacity
                            style={styles.useLastBtn}
                            onPress={() => {
                              if (weighted) updateSet(ex.id, si, 'weight', lastSet.weight);
                              if (unilateral) {
                                updateSet(ex.id, si, 'left', lastSet.left ?? '');
                                updateSet(ex.id, si, 'right', lastSet.right ?? '');
                              } else {
                                updateSet(ex.id, si, 'reps', lastSet.reps);
                              }
                            }}
                          >
                            <Text style={styles.useLastBtnText}>↺ Use</Text>
                          </TouchableOpacity>
                        ) : null;

                        const weightInput = weighted ? (
                          <TextInput
                            style={styles.setInput}
                            placeholder="lbs"
                            placeholderTextColor={colors.textDim}
                            keyboardType="decimal-pad"
                            value={setData.weight}
                            onChangeText={v => updateSet(ex.id, si, 'weight', v)}
                          />
                        ) : null;

                        // Unilateral: weight (if any) on its own line, with the
                        // L/R split inputs directly beneath so neither wraps awkwardly.
                        if (unilateral) {
                          return (
                            <>
                              <View style={styles.setRow}>
                                <Text style={styles.setLabel}>Set {si + 1}</Text>
                                {weightInput}
                              </View>
                              <View style={styles.sideRow}>
                                <View style={styles.sideField}>
                                  <Text style={styles.sideLabel}>L</Text>
                                  <TextInput
                                    style={styles.setInputSm}
                                    placeholder={unit}
                                    placeholderTextColor={colors.textDim}
                                    keyboardType="number-pad"
                                    value={setData.left ?? ''}
                                    onChangeText={v => updateSet(ex.id, si, 'left', v)}
                                  />
                                </View>
                                <View style={styles.sideField}>
                                  <Text style={styles.sideLabel}>R</Text>
                                  <TextInput
                                    style={styles.setInputSm}
                                    placeholder={unit}
                                    placeholderTextColor={colors.textDim}
                                    keyboardType="number-pad"
                                    value={setData.right ?? ''}
                                    onChangeText={v => updateSet(ex.id, si, 'right', v)}
                                  />
                                </View>
                                {useBtn}
                              </View>
                            </>
                          );
                        }

                        // Bilateral: label, weight (if any), reps, and Use on one line.
                        return (
                          <View style={styles.setRow}>
                            <Text style={styles.setLabel}>Set {si + 1}</Text>
                            {weightInput}
                            <TextInput
                              style={styles.setInput}
                              placeholder={unit}
                              placeholderTextColor={colors.textDim}
                              keyboardType="number-pad"
                              value={setData.reps}
                              onChangeText={v => updateSet(ex.id, si, 'reps', v)}
                            />
                            {useBtn}
                          </View>
                        );
                      })()}
                      {lastSet && (
                        <Text style={styles.lastTime}>Last time: {lastSummary(ex, lastSet)}</Text>
                      )}
                    </View>
                  );
                });
              })()}
            </View>
          ))}

          {/* Cardio logging */}
          {isCardio && (
            <View style={styles.card}>
              {workout.exercises[0] && (
                <>
                  <Text style={styles.h3}>{workout.exercises[0].name}</Text>
                  <Text style={[styles.p, { marginBottom: 16 }]}>{workout.exercises[0].notes}</Text>
                </>
              )}
              <Text style={styles.fieldLabel}>Duration (minutes)</Text>
              <TextInput
                style={[styles.setInput, { width: '100%', textAlign: 'left', marginBottom: 4 }]}
                placeholder="e.g. 45"
                placeholderTextColor={colors.textDim}
                keyboardType="number-pad"
                value={duration}
                onChangeText={setDuration}
              />
              {lastLog?.data?.duration && (
                <Text style={styles.lastTime}>Last time: {lastLog.data.duration} min</Text>
              )}
            </View>
          )}

          {/* Notes */}
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.fieldLabel}>Notes (optional)</Text>
            <TextInput
              style={[styles.setInput, { width: '100%', textAlign: 'left', minHeight: 72, paddingTop: 10 }]}
              placeholder="How'd it feel? Anything to remember?"
              placeholderTextColor={colors.textDim}
              multiline
              value={notes}
              onChangeText={setNotes}
              onFocus={() => {
                setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 300);
              }}
            />
          </View>

          <TouchableOpacity style={styles.btn} onPress={handleSave}>
            <Text style={styles.btnText}>{editingLog ? '✓ Save Changes' : '✓ Log Workout'}</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 20, paddingBottom: 120 },
  backRow: { marginBottom: 16 },
  backBtn: { fontFamily: fonts.regular, fontSize: 16, color: colors.textMuted },
  h1: { fontFamily: fonts.display, fontSize: 32, letterSpacing: 1, color: colors.text, marginBottom: 6 },
  h3: { fontFamily: fonts.display, fontSize: 20, letterSpacing: 1, color: colors.text, marginBottom: 4 },
  p: { fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted, lineHeight: 22, marginBottom: 8 },
  overline: { fontFamily: fonts.bold, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 },
  cardTitle: { fontFamily: fonts.semibold, fontSize: 14, color: colors.text, marginBottom: 6 },
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  tag: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  tagText: { fontFamily: fonts.bold, fontSize: 10, letterSpacing: 1 },
  formBtn: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 10 },
  formBtnText: { fontFamily: fonts.semibold, fontSize: 12, color: colors.textMuted },
  timerBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.accent, borderRadius: 10,
    paddingVertical: 10, marginBottom: 12, backgroundColor: colors.accentSoft,
  },
  timerBtnText: { fontFamily: fonts.semibold, fontSize: 14, color: colors.accent },
  setLabel: { fontFamily: fonts.semibold, fontSize: 13, color: colors.textDim, width: 52 },
  setRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  sideRow: { flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginTop: 6, marginLeft: 52 },
  setInput: {
    width: 80, backgroundColor: colors.cardAlt, borderWidth: 1, borderColor: colors.border,
    borderRadius: 10, padding: 10, color: colors.text, fontFamily: fonts.regular,
    fontSize: 15, textAlign: 'center',
  },
  setInputSm: {
    width: 60, backgroundColor: colors.cardAlt, borderWidth: 1, borderColor: colors.border,
    borderRadius: 10, padding: 10, color: colors.text, fontFamily: fonts.regular,
    fontSize: 15, textAlign: 'center',
  },
  sideField: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sideLabel: { fontFamily: fonts.bold, fontSize: 12, color: colors.textDim, width: 12, textAlign: 'center' },
  lastTime: { fontFamily: fonts.regular, fontSize: 12, color: colors.textDim, marginTop: 4, marginLeft: 60 },
  fieldLabel: { fontFamily: fonts.semibold, fontSize: 13, color: colors.textMuted, marginBottom: 6 },
  btn: { backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  btnText: { fontFamily: fonts.bold, fontSize: 16, color: '#fff' },
  useLastBtn: { borderWidth: 1, borderColor: colors.border, borderRadius: 6, paddingVertical: 4, paddingHorizontal: 8 },
  useLastBtnText: { fontFamily: fonts.semibold, fontSize: 11, color: colors.textMuted },
  editingBanner: { backgroundColor: colors.warning + '22', borderRadius: 8, padding: 10, marginBottom: 12, borderWidth: 1, borderColor: colors.warning, alignItems: 'center' },
  editingBannerText: { fontFamily: fonts.bold, fontSize: 11, color: colors.warning, letterSpacing: 1 },
  advancedMod: { fontFamily: fonts.light, fontSize: 13, color: colors.textDim, fontStyle: 'italic', marginBottom: 12, marginTop: -2 },
});
