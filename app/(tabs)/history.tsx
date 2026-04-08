import { ScrollView, View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useApp } from '@/context/AppContext';
import { colors, fonts, workoutTypes } from '@/constants/theme';

function Tag({ label, color }: { label: string; color: string }) {
  return (
    <View style={[styles.tag, { backgroundColor: color + '22' }]}>
      <Text style={[styles.tagText, { color }]}>{label.toUpperCase()}</Text>
    </View>
  );
}

export default function HistoryScreen() {
  const { workoutLogs, allWorkouts } = useApp();

  // Flatten all logs into a sorted list
  const allLogs: Array<{ workoutId: string; log: (typeof workoutLogs)[string][number] }> = [];
  Object.entries(workoutLogs).forEach(([wid, logs]) => {
    logs.forEach(log => allLogs.push({ workoutId: wid, log }));
  });
  allLogs.sort((a, b) => new Date(b.log.logged_at).getTime() - new Date(a.log.logged_at).getTime());

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.logo}>DADLIFT</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.h1}>HISTORY</Text>

        {allLogs.length === 0 && (
          <View style={[styles.card, { alignItems: 'center', padding: 32 }]}>
            <Text style={{ fontSize: 40, marginBottom: 12 }}>📊</Text>
            <Text style={styles.p}>No workouts logged yet. Get after it!</Text>
          </View>
        )}

        {allLogs.map(({ workoutId, log }, i) => {
          const w = allWorkouts.find(x => x.id === workoutId);
          if (!w) return null;
          const typeInfo = workoutTypes[w.type];
          const isCardio = w.type.startsWith('cardio');

          return (
            <View key={`${workoutId}-${i}`} style={[styles.card, { borderLeftWidth: 3, borderLeftColor: typeInfo.color }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <View>
                  <Text style={styles.dateText}>
                    {new Date(log.logged_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </Text>
                  <Text style={styles.workoutName}>{w.name}</Text>
                </View>
                <Tag label={typeInfo.short} color={typeInfo.color} />
              </View>

              {isCardio && log.data.duration && (
                <Text style={styles.detail}>Duration: {log.data.duration} min</Text>
              )}

              {!isCardio && log.data.exercises && (
                <View style={{ marginTop: 4 }}>
                  {w.exercises.map(ex => {
                    const exLog = log.data.exercises?.[ex.id];
                    if (!exLog) return null;
                    const summary = exLog.map(s => {
                      if (w.type === 'strength-hypertrophy') return `${s.weight || 0}×${s.reps || 0}`;
                      return `${s.reps || 0}`;
                    }).join(' / ');
                    const unit = w.type === 'strength-hypertrophy' ? ' lbs×reps' : ' reps';
                    return (
                      <Text key={ex.id} style={styles.detail}>
                        <Text style={{ color: colors.textMuted }}>{ex.name}: </Text>
                        {summary}{unit}
                      </Text>
                    );
                  })}
                </View>
              )}

              {log.data.notes && (
                <Text style={styles.notes}>"{log.data.notes}"</Text>
              )}
            </View>
          );
        })}

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
  h1: { fontFamily: fonts.display, fontSize: 32, letterSpacing: 1, color: colors.text, marginBottom: 20 },
  p: { fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted, lineHeight: 22, textAlign: 'center' },
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  dateText: { fontFamily: fonts.regular, fontSize: 12, color: colors.textDim, marginBottom: 2 },
  workoutName: { fontFamily: fonts.semibold, fontSize: 16, color: colors.text },
  detail: { fontFamily: fonts.regular, fontSize: 12, color: colors.text, marginTop: 2, lineHeight: 18 },
  notes: { fontFamily: fonts.light, fontSize: 12, color: colors.textDim, marginTop: 8, fontStyle: 'italic' },
  tag: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  tagText: { fontFamily: fonts.bold, fontSize: 10, letterSpacing: 1 },
});
