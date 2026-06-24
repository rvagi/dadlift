import { ScrollView, View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, fonts } from '@/constants/theme';
import IntervalTimer from '@/components/IntervalTimer';

// Parse an optional numeric route param, falling back to undefined so the
// timer uses its own sensible defaults.
function num(v: string | string[] | undefined): number | undefined {
  if (typeof v !== 'string') return undefined;
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : undefined;
}

export default function TimerScreen() {
  const { work, rest, rounds, name } = useLocalSearchParams<{
    work?: string; rest?: string; rounds?: string; name?: string;
  }>();
  const router = useRouter();

  const prefilled = work !== undefined || rest !== undefined || rounds !== undefined;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backRow}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.h1}>INTERVAL TIMER</Text>
        <Text style={styles.p}>
          {prefilled && name
            ? `Pre-filled from “${name}”. Adjust the work, rest, and rounds to taste.`
            : prefilled
              ? 'Pre-filled from this workout. Adjust the work, rest, and rounds to taste.'
              : 'Set your work, rest, and rounds, then hit start. Audio cues play even on silent.'}
        </Text>

        <IntervalTimer
          initialWork={num(work)}
          initialRest={num(rest)}
          initialRounds={num(rounds)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 20, paddingBottom: 40 },
  backRow: { marginBottom: 16 },
  backBtn: { fontFamily: fonts.regular, fontSize: 16, color: colors.textMuted },
  h1: { fontFamily: fonts.display, fontSize: 32, letterSpacing: 1, color: colors.text, marginBottom: 6 },
  p: { fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted, lineHeight: 22, marginBottom: 16 },
});
