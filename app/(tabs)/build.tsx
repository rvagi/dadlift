import { useState } from 'react';
import {
  ScrollView, View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, Alert,
} from 'react-native';
import { useApp } from '@/context/AppContext';
import { colors, fonts, workoutTypes, equipmentOptions } from '@/constants/theme';
import type { CustomWorkout } from '@/lib/db';

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity style={[styles.chip, active && styles.chipActive]} onPress={onPress}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

type DraftExercise = { id: string; name: string; category: string; sets: string; notes: string; videoUrl: string };

export default function BuildScreen() {
  const { customWorkouts, addCustomWorkout, removeCustomWorkout } = useApp();
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [type, setType] = useState<CustomWorkout['type']>('strength-endurance');
  const [equip, setEquip] = useState<CustomWorkout['equipment']>('bodyweight');
  const [exercises, setExercises] = useState<DraftExercise[]>([]);
  const [saved, setSaved] = useState(false);

  const isCardio = type.startsWith('cardio');
  const categories = isCardio ? ['cardio'] : ['push', 'pull', 'legs', 'core'];

  const addExercise = () => {
    setExercises(prev => [...prev, {
      id: `e${Date.now()}`,
      name: '',
      category: isCardio ? 'cardio' : 'push',
      sets: isCardio ? '1' : '3',
      notes: '',
      videoUrl: '',
    }]);
  };

  const updateExercise = (idx: number, field: keyof DraftExercise, value: string) => {
    setExercises(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const removeExercise = (idx: number) => {
    setExercises(prev => prev.filter((_, i) => i !== idx));
  };

  const saveWorkout = async () => {
    if (!name.trim() || exercises.length === 0) return;
    const workout: CustomWorkout = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      description: desc.trim() || 'Custom workout',
      type,
      equipment: equip,
      custom: true,
      exercises: exercises.map((ex, i) => ({
        id: `e${i + 1}`,
        name: ex.name,
        category: ex.category as any,
        sets: parseInt(ex.sets) || 3,
        notes: ex.notes,
        videoUrl: ex.videoUrl,
      })),
    };
    await addCustomWorkout(workout);
    setSaved(true);
    setName(''); setDesc(''); setExercises([]);
    setTimeout(() => setSaved(false), 3000);
  };

  const confirmDelete = (id: string, wName: string) => {
    Alert.alert('Delete Workout', `Delete "${wName}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeCustomWorkout(id) },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.logo}>DADLIFT</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.h1}>BUILD A WORKOUT</Text>
        <Text style={styles.p}>Create your own workout. It'll appear in the library and can be added to your plan.</Text>

        {saved && (
          <View style={[styles.card, { backgroundColor: colors.successSoft, borderColor: colors.success, alignItems: 'center', padding: 14 }]}>
            <Text style={[styles.label, { color: colors.success }]}>Workout saved! Find it in the Workouts tab.</Text>
          </View>
        )}

        <Text style={styles.fieldLabel}>Workout name</Text>
        <TextInput style={styles.input} value={name} placeholder="e.g. Spicy Core Day" placeholderTextColor={colors.textDim} onChangeText={setName} />

        <Text style={styles.fieldLabel}>Short description</Text>
        <TextInput style={styles.input} value={desc} placeholder="e.g. The one that makes you question your choices" placeholderTextColor={colors.textDim} onChangeText={setDesc} />

        <Text style={styles.fieldLabel}>Workout type</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
          {Object.entries(workoutTypes).map(([key, t]) => (
            <Chip key={key} label={t.short} active={type === key} onPress={() => { setType(key as any); setExercises([]); }} />
          ))}
        </ScrollView>

        <Text style={styles.fieldLabel}>Equipment</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
          {equipmentOptions.map(eq => (
            <Chip key={eq.id} label={`${eq.icon} ${eq.label}`} active={equip === eq.id} onPress={() => setEquip(eq.id as any)} />
          ))}
        </ScrollView>

        <Text style={styles.h2}>EXERCISES</Text>
        {!isCardio && <Text style={styles.p}>Add at least one exercise for each category: push, pull, and legs.</Text>}

        {exercises.map((ex, idx) => (
          <View key={ex.id} style={[styles.card, { padding: 14 }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
              <Text style={styles.label}>Exercise {idx + 1}</Text>
              <TouchableOpacity onPress={() => removeExercise(idx)}>
                <Text style={[styles.smallBtn, { color: colors.accent }]}>Remove</Text>
              </TouchableOpacity>
            </View>
            <TextInput style={[styles.input, { marginBottom: 8 }]} value={ex.name} placeholder="Exercise name" placeholderTextColor={colors.textDim} onChangeText={v => updateExercise(idx, 'name', v)} />
            {!isCardio && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
                {categories.map(cat => (
                  <Chip key={cat} label={cat.charAt(0).toUpperCase() + cat.slice(1)} active={ex.category === cat} onPress={() => updateExercise(idx, 'category', cat)} />
                ))}
              </ScrollView>
            )}
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.fieldLabel, { marginBottom: 4 }]}>Sets</Text>
                <TextInput style={styles.input} value={ex.sets} keyboardType="numeric" placeholderTextColor={colors.textDim} onChangeText={v => updateExercise(idx, 'sets', v)} />
              </View>
            </View>
            <TextInput style={[styles.input, { marginBottom: 8 }]} value={ex.notes} placeholder="Tips or notes (optional)" placeholderTextColor={colors.textDim} onChangeText={v => updateExercise(idx, 'notes', v)} />
            <TextInput style={styles.input} value={ex.videoUrl} placeholder="YouTube search link (optional)" placeholderTextColor={colors.textDim} onChangeText={v => updateExercise(idx, 'videoUrl', v)} />
          </View>
        ))}

        <TouchableOpacity style={[styles.btnOutline, { marginBottom: 16 }]} onPress={addExercise}>
          <Text style={styles.btnOutlineText}>+ Add Exercise</Text>
        </TouchableOpacity>

        {exercises.length > 0 && !!name.trim() && (
          <TouchableOpacity style={styles.btn} onPress={saveWorkout}>
            <Text style={styles.btnText}>Save Workout</Text>
          </TouchableOpacity>
        )}

        {/* Saved custom workouts */}
        {customWorkouts.length > 0 && (
          <>
            <Text style={[styles.h2, { marginTop: 32 }]}>YOUR CUSTOM WORKOUTS</Text>
            {customWorkouts.map(w => {
              const typeInfo = workoutTypes[w.type];
              return (
                <View key={w.id} style={[styles.card, { borderLeftWidth: 3, borderLeftColor: typeInfo?.color || '#888' }]}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <View style={{ flex: 1 }}>
                      <View style={[styles.tag, { backgroundColor: (typeInfo?.color || '#888') + '22', marginBottom: 6 }]}>
                        <Text style={[styles.tagText, { color: typeInfo?.color || '#888' }]}>{typeInfo?.short?.toUpperCase()}</Text>
                      </View>
                      <Text style={styles.label}>{w.name}</Text>
                      <Text style={[styles.p, { marginTop: 2 }]}>{w.description}</Text>
                    </View>
                    <TouchableOpacity onPress={() => confirmDelete(w.id, w.name)} style={{ paddingLeft: 12 }}>
                      <Text style={[styles.smallBtn, { color: colors.accent }]}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  logo: { fontFamily: fonts.display, fontSize: 28, letterSpacing: 2, color: colors.accent },
  scroll: { padding: 20, paddingBottom: 32 },
  h1: { fontFamily: fonts.display, fontSize: 32, letterSpacing: 1, color: colors.text, marginBottom: 8 },
  h2: { fontFamily: fonts.display, fontSize: 24, letterSpacing: 1, color: colors.text, marginBottom: 12 },
  p: { fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted, lineHeight: 22, marginBottom: 8 },
  label: { fontFamily: fonts.semibold, fontSize: 15, color: colors.text },
  fieldLabel: { fontFamily: fonts.semibold, fontSize: 13, color: colors.textMuted, marginBottom: 6 },
  input: { backgroundColor: colors.cardAlt, borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 12, color: colors.text, fontFamily: fonts.regular, fontSize: 15, marginBottom: 12 },
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  chip: { borderWidth: 1, borderColor: colors.border, borderRadius: 20, paddingVertical: 6, paddingHorizontal: 14, marginRight: 8, backgroundColor: colors.card },
  chipActive: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  chipText: { fontFamily: fonts.semibold, fontSize: 13, color: colors.textMuted },
  chipTextActive: { color: colors.accent },
  smallBtn: { fontFamily: fonts.regular, fontSize: 13 },
  btn: { backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 8 },
  btnText: { fontFamily: fonts.bold, fontSize: 15, color: '#fff' },
  btnOutline: { borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  btnOutlineText: { fontFamily: fonts.semibold, fontSize: 15, color: colors.textMuted },
  tag: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 4 },
  tagText: { fontFamily: fonts.bold, fontSize: 10, letterSpacing: 1 },
});
