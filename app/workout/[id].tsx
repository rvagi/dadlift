import { useState } from 'react';
import {
  ScrollView, View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, Linking, Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { colors, fonts, workoutTypes, equipmentOptions } from '@/constants/theme';
import type { WorkoutLog } from '@/lib/db';

function Tag({ label, color }: { label: string; color: string }) {
  return (
    <View style={[styles.tag, { backgroundColor: color + '22' }]}>
      <Text style={[styles.tagText, { color }]}>{label.toUpperCase()}</Text>
    </View>
  );
}

type SetData = { reps: string; weight: string };
type ExerciseLogData = Record<string, SetData[]>;

export default function WorkoutScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { allWorkouts, getLastLog, logWorkout } = useApp();
  const router = useRouter();

  const workout = allWorkouts.find(w => w.id === id);

  const isEndurance = workout?.type === 'strength-endurance';
  const isHypertrophy = workout?.type === 'strength-hypertrophy';
  const isCardio = workout?.type?.startsWith('cardio') ?? false;

  // Build initial log state
  const [exerciseLog, setExerciseLog] = useState<ExerciseLogData>(() => {
    if (!workout || isCardio) return {};
    const data: ExerciseLogData = {};
    workout.exercises.forEach(ex => {
      data[ex.id] = Array.from({ length: ex.sets }, () => ({ reps: '', weight: '' }));
    });
    return data;
  });
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');

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
    return { reps: s.reps ?? '', weight: s.weight ?? '' };
  };

  const handleSave = () => {
    const log: WorkoutLog = {
      workout_id: workout.id,
      logged_at: new Date().toISOString(),
      data: isCardio
        ? { duration, notes }
        : { exercises: exerciseLog, notes },
    };
    logWorkout(log).catch(console.error);
    router.replace('/(tabs)');
  };

  const confirmBack = () => {
    Alert.alert('Quit Workout?', 'Your progress won\'t be saved.', [
      { text: 'Keep Going', style: 'cancel' },
      { text: 'Quit', style: 'destructive', onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Back */}
        <TouchableOpacity onPress={confirmBack} style={styles.backRow}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>

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
            <Text style={[styles.p, { marginBottom: 6 }]}>Each exercise has 3 sets. Do each set to max reps, then rest 60-90 seconds.</Text>
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
            <Text style={[styles.p, { marginBottom: 12 }]}>{ex.notes}</Text>

            {/* Set rows */}
            {(exerciseLog[ex.id] ?? []).map((setData, si) => {
              const lastSet = getLastSet(ex.id, si);
              return (
                <View key={si} style={{ marginBottom: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={styles.setLabel}>Set {si + 1}</Text>
                    {isHypertrophy && (
                      <TextInput
                        style={styles.setInput}
                        placeholder="lbs"
                        placeholderTextColor={colors.textDim}
                        keyboardType="decimal-pad"
                        value={setData.weight}
                        onChangeText={v => updateSet(ex.id, si, 'weight', v)}
                      />
                    )}
                    <TextInput
                      style={styles.setInput}
                      placeholder="reps"
                      placeholderTextColor={colors.textDim}
                      keyboardType="number-pad"
                      value={setData.reps}
                      onChangeText={v => updateSet(ex.id, si, 'reps', v)}
                    />
                    <Text style={styles.setUnit}>
                      {isHypertrophy ? 'lbs × reps' : 'reps'}
                    </Text>
                  </View>
                  {lastSet && (
                    <Text style={styles.lastTime}>
                      Last time: {isHypertrophy
                        ? `${lastSet.weight || '?'} lbs × ${lastSet.reps || '?'} reps`
                        : `${lastSet.reps || '?'} reps`}
                    </Text>
                  )}
                </View>
              );
            })}
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
          />
        </View>

        <TouchableOpacity style={styles.btn} onPress={handleSave}>
          <Text style={styles.btnText}>✓ Log Workout</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 20, paddingBottom: 32 },
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
  setLabel: { fontFamily: fonts.semibold, fontSize: 13, color: colors.textDim, width: 52 },
  setInput: {
    width: 80, backgroundColor: colors.cardAlt, borderWidth: 1, borderColor: colors.border,
    borderRadius: 10, padding: 10, color: colors.text, fontFamily: fonts.regular,
    fontSize: 15, textAlign: 'center',
  },
  setUnit: { fontFamily: fonts.regular, fontSize: 12, color: colors.textDim },
  lastTime: { fontFamily: fonts.regular, fontSize: 12, color: colors.textDim, marginTop: 4, marginLeft: 60 },
  fieldLabel: { fontFamily: fonts.semibold, fontSize: 13, color: colors.textMuted, marginBottom: 6 },
  btn: { backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  btnText: { fontFamily: fonts.bold, fontSize: 16, color: '#fff' },
});
