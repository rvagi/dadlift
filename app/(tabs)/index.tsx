import { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { useSubscription } from '@/context/SubscriptionContext';
import { colors, fonts, workoutTypes, DAYS } from '@/constants/theme';
import PaywallModal from '@/components/PaywallModal';

function Tag({ label, color }: { label: string; color: string }) {
  return (
    <View style={[styles.tag, { backgroundColor: color + '22' }]}>
      <Text style={[styles.tagText, { color }]}>{label.toUpperCase()}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const { weekPlan, allWorkouts, getLastLog, monthLabel } = useApp();
  const { isPro } = useSubscription();
  const router = useRouter();
  const [paywallVisible, setPaywallVisible] = useState(false);

  const todayIdx = new Date().getDay();
  const today = DAYS[todayIdx === 0 ? 6 : todayIdx - 1];
  const todayPlan = weekPlan[today];
  const todayWorkout = todayPlan && todayPlan !== 'rest'
    ? allWorkouts.find(w => w.id === todayPlan) : null;

  const hasAnyPlan = Object.keys(weekPlan).length > 0;
  const planEntries = Object.entries(weekPlan).filter(([, v]) => v && v !== 'rest');

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.logo}>DADLIFT</Text>
        <TouchableOpacity
          style={styles.timerBtn}
          onPress={() => router.push('/timer')}
          accessibilityLabel="Open interval timer"
          hitSlop={8}
        >
          <Ionicons name="timer-outline" size={24} color={colors.accent} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.h1}>DO MY WORKOUT</Text>
        {!!monthLabel && <Text style={styles.monthLabel}>{monthLabel}</Text>}

        {/* Today's workout card */}
        {todayWorkout && (() => {
          const typeInfo = workoutTypes[todayWorkout.type];
          const lastLog = getLastLog(todayWorkout.id);
          return (
            <TouchableOpacity
              style={[styles.card, { borderLeftWidth: 4, borderLeftColor: typeInfo.color }]}
              onPress={() => router.push(`/workout/${todayWorkout.id}`)}
            >
              <Text style={[styles.overline, { color: colors.accent }]}>Today — {today}</Text>
              <Text style={styles.h3}>{todayWorkout.name}</Text>
              <Tag label={typeInfo.short} color={typeInfo.color} />
              <Text style={[styles.p, { marginTop: 8 }]}>{todayWorkout.description}</Text>
              {lastLog && (
                <Text style={styles.lastTime}>
                  Last: {new Date(lastLog.logged_at).toLocaleDateString()}
                </Text>
              )}
              <View style={[styles.btn, { marginTop: 12 }]}>
                <Text style={styles.btnText}>Start Workout →</Text>
              </View>
            </TouchableOpacity>
          );
        })()}

        {/* Rest day */}
        {!todayWorkout && todayPlan === 'rest' && hasAnyPlan && (
          <View style={[styles.card, { alignItems: 'center', padding: 24 }]}>
            <Text style={styles.label}>Today is a rest day</Text>
            <Text style={[styles.p, { textAlign: 'center', marginTop: 8 }]}>
              Recovery is part of the program. Your body builds muscle while you rest.
            </Text>
          </View>
        )}

        {/* No plan yet */}
        {!hasAnyPlan && (
          <View style={[styles.card, { alignItems: 'center', padding: 24 }]}>
            <Text style={styles.label}>No plan built yet</Text>
            <Text style={[styles.p, { textAlign: 'center', marginTop: 8, marginBottom: 16 }]}>
              Head over to My Plan to build this month's workout schedule.
            </Text>
            <TouchableOpacity style={styles.btn} onPress={() => router.push('/(tabs)/plan')}>
              <Text style={styles.btnText}>Build This Month's Plan →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* This week's lineup */}
        {planEntries.length > 0 && (
          <>
            <Text style={styles.h2}>THIS WEEK'S LINEUP</Text>
            {DAYS.map(day => {
              const wid = weekPlan[day];
              const isRest = !wid || wid === 'rest';
              const w = !isRest ? allWorkouts.find(x => x.id === wid) : null;

              if (isRest) return (
                <View key={day} style={[styles.card, styles.dayRow, { opacity: 0.5 }]}>
                  <Text style={styles.dayName}>{day}</Text>
                  <Text style={[styles.p, { fontSize: 13 }]}>Rest day</Text>
                </View>
              );

              if (!w) return null;
              const typeInfo = workoutTypes[w.type];
              const lastLog = getLastLog(w.id);
              return (
                <TouchableOpacity
                  key={day}
                  style={[styles.card, styles.dayRow, { borderLeftWidth: 3, borderLeftColor: typeInfo.color }]}
                  onPress={() => router.push(`/workout/${w.id}`)}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.dayName}>{day}</Text>
                    <Text style={styles.label}>{w.name}</Text>
                    {lastLog && (
                      <Text style={styles.lastTime}>
                        Last: {new Date(lastLog.logged_at).toLocaleDateString()}
                      </Text>
                    )}
                  </View>
                  <Tag label={typeInfo.short} color={typeInfo.color} />
                </TouchableOpacity>
              );
            })}
          </>
        )}

        {/* Upgrade card — visible to free users, always at the bottom */}
        {!isPro && (
          <TouchableOpacity style={styles.upgradeCard} onPress={() => setPaywallVisible(true)}>
            <View style={styles.upgradeRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.upgradeLabel}>DADLIFT PRO</Text>
                <Text style={styles.upgradeHeadline}>Unlock the full library + custom workouts</Text>
                <Text style={styles.upgradePrice}>$4.99 / month · $25 / year</Text>
              </View>
              <Text style={styles.upgradeArrow}>→</Text>
            </View>
          </TouchableOpacity>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      <PaywallModal
        visible={paywallVisible}
        onClose={() => setPaywallVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 10,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  logo: { fontFamily: fonts.display, fontSize: 28, letterSpacing: 2, color: colors.accent },
  timerBtn: { padding: 4 },
  scroll: { padding: 20, paddingBottom: 32 },
  h1: { fontFamily: fonts.display, fontSize: 32, letterSpacing: 1, color: colors.text, marginBottom: 8 },
  h2: { fontFamily: fonts.display, fontSize: 24, letterSpacing: 1, color: colors.text, marginTop: 24, marginBottom: 12 },
  h3: { fontFamily: fonts.display, fontSize: 22, letterSpacing: 1, color: colors.text, marginBottom: 6 },
  p: { fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted, lineHeight: 22 },
  label: { fontFamily: fonts.semibold, fontSize: 15, color: colors.text },
  monthLabel: { fontFamily: fonts.semibold, fontSize: 13, color: colors.accent, letterSpacing: 1, marginBottom: 16 },
  overline: { fontFamily: fonts.bold, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 },
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  dayRow: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 8 },
  dayName: { fontFamily: fonts.semibold, fontSize: 12, color: colors.textDim, marginBottom: 2 },
  lastTime: { fontFamily: fonts.regular, fontSize: 12, color: colors.success, marginTop: 4 },
  tag: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  tagText: { fontFamily: fonts.bold, fontSize: 10, letterSpacing: 1 },
  btn: { backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  btnText: { fontFamily: fonts.bold, fontSize: 15, color: '#fff' },
  upgradeCard: {
    borderWidth: 1, borderColor: colors.accent, borderRadius: 16,
    padding: 16, marginTop: 8, backgroundColor: colors.accentSoft,
  },
  upgradeRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  upgradeLabel: { fontFamily: fonts.bold, fontSize: 10, letterSpacing: 2, color: colors.accent, marginBottom: 4 },
  upgradeHeadline: { fontFamily: fonts.semibold, fontSize: 15, color: colors.text, marginBottom: 4 },
  upgradePrice: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted },
  upgradeArrow: { fontFamily: fonts.bold, fontSize: 22, color: colors.accent },
});
