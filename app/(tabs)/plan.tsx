import { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, TextInput, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { colors, fonts, workoutTypes, DAYS } from '@/constants/theme';

function Tag({ label, color }: { label: string; color: string }) {
  return (
    <View style={[styles.tag, { backgroundColor: color + '22' }]}>
      <Text style={[styles.tagText, { color }]}>{label.toUpperCase()}</Text>
    </View>
  );
}

export default function PlanScreen() {
  const { weekPlan, setWeekPlan, monthLabel, setMonthLabel, allWorkouts, setPlanSlot, setBrowseFilter } = useApp();
  const [localMonth, setLocalMonth] = useState(monthLabel);
  const [confirmReset, setConfirmReset] = useState(false);
  const router = useRouter();

  const hasAnyAssignment = Object.values(weekPlan).some(v => v && v !== 'rest');

  const removeFromDay = (day: string) => {
    const next = { ...weekPlan };
    delete next[day];
    setWeekPlan(next).catch(console.error);
  };

  const setRestDay = (day: string) => {
    setWeekPlan({ ...weekPlan, [day]: 'rest' }).catch(console.error);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.logo}>DADLIFT</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.h1}>BUILD THIS MONTH'S PLAN</Text>
        <Text style={styles.p}>
          Assign a workout to each day you plan to train. Tap an assigned workout to start it.
        </Text>

        {/* Month name input */}
        <Text style={styles.fieldLabel}>Name this month (optional)</Text>
        <TextInput
          style={styles.input}
          value={localMonth}
          placeholder="e.g. April — Foundation Month"
          placeholderTextColor={colors.textDim}
          onChangeText={setLocalMonth}
          onBlur={() => setMonthLabel(localMonth).catch(console.error)}
        />

        {/* Days */}
        {DAYS.map(day => {
          const val = weekPlan[day];
          const isRest = val === 'rest';
          const w = val && !isRest ? allWorkouts.find(x => x.id === val) : null;
          const typeInfo = w ? workoutTypes[w.type] : null;

          return (
            <View key={day} style={[
              styles.card,
              { borderLeftWidth: 4 },
              typeInfo ? { borderLeftColor: typeInfo.color } :
              isRest ? { borderLeftColor: colors.border, opacity: 0.6 } :
              { borderLeftColor: 'transparent' },
            ]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.label}>{day}</Text>
                {(w || isRest) && (
                  <TouchableOpacity onPress={() => removeFromDay(day)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Text style={styles.clearBtn}>✕ Clear</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Assigned workout — tappable to start */}
              {w && typeInfo && (
                <TouchableOpacity
                  style={styles.assignedRow}
                  onPress={() => router.push(`/workout/${w.id}`)}
                >
                  <Tag label={typeInfo.short} color={typeInfo.color} />
                  <Text style={styles.workoutName}>{w.name}</Text>
                  <Text style={styles.startArrow}>→</Text>
                </TouchableOpacity>
              )}

              {isRest && (
                <Text style={[styles.p, { marginTop: 6, marginBottom: 0 }]}>Rest / Recovery day</Text>
              )}

              {/* Empty day — show all 4 type buttons */}
              {!val && (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                  {Object.entries(workoutTypes).map(([typeKey, t]) => (
                    <TouchableOpacity
                      key={typeKey}
                      style={[styles.chipBtn, { borderColor: t.color }]}
                      onPress={() => {
                        setPlanSlot({ day, type: typeKey });
                        setBrowseFilter({ type: typeKey, equip: null });
                        router.push('/(tabs)/library');
                      }}
                    >
                      <Text style={[styles.chipBtnText, { color: t.color }]}>+ {t.short}</Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity
                    style={[styles.chipBtn, { borderColor: colors.textDim }]}
                    onPress={() => setRestDay(day)}
                  >
                    <Text style={[styles.chipBtnText, { color: colors.textDim }]}>Rest Day</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}

        {/* Save plan & go train */}
        {hasAnyAssignment && !confirmReset && (
          <TouchableOpacity style={styles.btn} onPress={() => router.push('/(tabs)')}>
            <Text style={styles.btnText}>Save Plan — Let's Train →</Text>
          </TouchableOpacity>
        )}

        {/* Reset */}
        {hasAnyAssignment && !confirmReset && (
          <TouchableOpacity style={styles.btnOutline} onPress={() => setConfirmReset(true)}>
            <Text style={styles.btnOutlineText}>Start New Month</Text>
          </TouchableOpacity>
        )}

        {confirmReset && (
          <View style={[styles.card, { backgroundColor: colors.dangerSoft, borderColor: colors.danger, alignItems: 'center', padding: 20 }]}>
            <Text style={[styles.label, { marginBottom: 8 }]}>Start fresh?</Text>
            <Text style={[styles.p, { textAlign: 'center', marginBottom: 16 }]}>
              This will clear your current plan. Your workout history will be kept.
            </Text>
            <View style={{ flexDirection: 'row', gap: 10, width: '100%' }}>
              <TouchableOpacity style={[styles.btn, { flex: 1 }]} onPress={() => {
                setWeekPlan({}).catch(console.error);
                setMonthLabel('').catch(console.error);
                setLocalMonth('');
                setConfirmReset(false);
              }}>
                <Text style={styles.btnText}>Yes, Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btnOutline, { flex: 1, marginTop: 0 }]} onPress={() => setConfirmReset(false)}>
                <Text style={styles.btnOutlineText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  p: { fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted, lineHeight: 22, marginBottom: 8 },
  label: { fontFamily: fonts.semibold, fontSize: 15, color: colors.text },
  fieldLabel: { fontFamily: fonts.semibold, fontSize: 13, color: colors.textMuted, marginBottom: 6 },
  input: {
    backgroundColor: colors.cardAlt, borderWidth: 1, borderColor: colors.border, borderRadius: 10,
    padding: 12, color: colors.text, fontFamily: fonts.regular, fontSize: 15, marginBottom: 20,
  },
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  tag: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  tagText: { fontFamily: fonts.bold, fontSize: 10, letterSpacing: 1 },
  assignedRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  workoutName: { fontFamily: fonts.semibold, fontSize: 14, color: colors.text, flex: 1 },
  startArrow: { fontFamily: fonts.regular, fontSize: 16, color: colors.accent },
  clearBtn: { fontFamily: fonts.regular, fontSize: 13, color: colors.textDim },
  chipBtn: { borderWidth: 1, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12 },
  chipBtnText: { fontFamily: fonts.semibold, fontSize: 13 },
  btn: { backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  btnText: { fontFamily: fonts.bold, fontSize: 15, color: '#fff' },
  btnOutline: { borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  btnOutlineText: { fontFamily: fonts.semibold, fontSize: 15, color: colors.textMuted },
});
