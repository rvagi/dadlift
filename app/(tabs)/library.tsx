import { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, TextInput, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { colors, fonts, workoutTypes, equipmentOptions } from '@/constants/theme';

function Tag({ label, color }: { label: string; color: string }) {
  return (
    <View style={[styles.tag, { backgroundColor: color + '22' }]}>
      <Text style={[styles.tagText, { color }]}>{label.toUpperCase()}</Text>
    </View>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function LibraryScreen() {
  const { allWorkouts, equipment, weekPlan, setWeekPlan, planSlot, setPlanSlot, browseFilter, setBrowseFilter } = useApp();
  const router = useRouter();
  const [search, setSearch] = useState('');

  const availableEquip = ['bodyweight', ...equipment];

  const filtered = allWorkouts.filter(w => {
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      const matchesName = w.name.toLowerCase().includes(q);
      const matchesExercise = w.exercises.some(ex => ex.name.toLowerCase().includes(q));
      if (!matchesName && !matchesExercise) return false;
    }
    if (planSlot) {
      if (w.type !== planSlot.type) return false;
    } else {
      if (browseFilter.type && w.type !== browseFilter.type) return false;
    }
    if (browseFilter.equip && w.equipment !== browseFilter.equip) return false;
    if (!availableEquip.includes(w.equipment)) return false;
    return true;
  });

  const handleSelect = (workoutId: string) => {
    if (planSlot) {
      setWeekPlan({ ...weekPlan, [planSlot.day]: workoutId }).catch(console.error);
      setPlanSlot(null);
      setBrowseFilter({ type: null, equip: null });
      router.push('/(tabs)/plan');
    } else {
      router.push(`/workout/${workoutId}`);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        {planSlot ? (
          <TouchableOpacity onPress={() => { setPlanSlot(null); setBrowseFilter({ type: null, equip: null }); router.back(); }}>
            <Text style={styles.backBtn}>←</Text>
          </TouchableOpacity>
        ) : null}
        <Text style={styles.logo}>
          {planSlot ? `PICK ${workoutTypes[planSlot.type]?.short.toUpperCase()}` : 'WORKOUT LIBRARY'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {planSlot && (
          <Text style={styles.p}>Choose a workout for {planSlot.day}</Text>
        )}

        {/* Search */}
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search by workout or exercise name…"
          placeholderTextColor={colors.textDim}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />

        {/* Type filter (only when not in plan-slot mode) */}
        {!planSlot && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
            <Chip label="All Types" active={!browseFilter.type} onPress={() => setBrowseFilter({ ...browseFilter, type: null })} />
            {Object.entries(workoutTypes).map(([key, t]) => (
              <Chip key={key} label={t.short} active={browseFilter.type === key} onPress={() => setBrowseFilter({ ...browseFilter, type: key })} />
            ))}
          </ScrollView>
        )}

        {/* Equipment filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          <Chip label="All Equipment" active={!browseFilter.equip} onPress={() => setBrowseFilter({ ...browseFilter, equip: null })} />
          {equipmentOptions.filter(e => availableEquip.includes(e.id)).map(eq => (
            <Chip key={eq.id} label={`${eq.icon} ${eq.label}`} active={browseFilter.equip === eq.id} onPress={() => setBrowseFilter({ ...browseFilter, equip: eq.id })} />
          ))}
        </ScrollView>

        {filtered.length === 0 && (
          <View style={[styles.card, { alignItems: 'center', padding: 24 }]}>
            <Text style={styles.p}>No workouts match these filters.</Text>
          </View>
        )}

        {filtered.map(w => {
          const typeInfo = workoutTypes[w.type];
          const equip = equipmentOptions.find(e => e.id === w.equipment);
          return (
            <TouchableOpacity
              key={w.id}
              style={[styles.card, { borderLeftWidth: 3, borderLeftColor: typeInfo.color }]}
              onPress={() => handleSelect(w.id)}
            >
              <View style={{ flexDirection: 'row', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
                <Tag label={typeInfo.short} color={typeInfo.color} />
                {equip && <Tag label={`${equip.icon} ${equip.label}`} color="#888" />}
              </View>
              <Text style={styles.h3}>{w.name}</Text>
              <Text style={styles.p}>{w.description}</Text>
              {planSlot && (
                <Text style={[styles.p, { color: colors.accent, fontFamily: fonts.semibold }]}>
                  Tap to assign to {planSlot.day} →
                </Text>
              )}
            </TouchableOpacity>
          );
        })}

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: 'row', alignItems: 'center', gap: 8 },
  logo: { fontFamily: fonts.display, fontSize: 24, letterSpacing: 1, color: colors.text },
  backBtn: { fontFamily: fonts.regular, fontSize: 22, color: colors.textMuted, paddingRight: 4 },
  scroll: { padding: 20, paddingBottom: 32 },
  filterRow: { marginBottom: 8 },
  p: { fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted, lineHeight: 22, marginBottom: 0 },
  h3: { fontFamily: fonts.display, fontSize: 20, letterSpacing: 1, color: colors.text, marginBottom: 4 },
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  tag: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  tagText: { fontFamily: fonts.bold, fontSize: 10, letterSpacing: 1 },
  searchInput: {
    backgroundColor: colors.cardAlt, borderWidth: 1, borderColor: colors.border, borderRadius: 10,
    padding: 12, color: colors.text, fontFamily: fonts.regular, fontSize: 15, marginBottom: 12,
  },
  chip: { borderWidth: 1, borderColor: colors.border, borderRadius: 20, paddingVertical: 6, paddingHorizontal: 14, marginRight: 8, backgroundColor: colors.card },
  chipActive: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  chipText: { fontFamily: fonts.semibold, fontSize: 13, color: colors.textMuted },
  chipTextActive: { color: colors.accent },
});
