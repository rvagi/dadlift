import { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Vibration } from 'react-native';
import { colors, fonts } from '@/constants/theme';

type Phase = 'idle' | 'work' | 'rest' | 'done';

type Preset = { label: string; work: number; rest: number; rounds: number };
const PRESETS: Preset[] = [
  { label: 'Tabata', work: 20, rest: 10, rounds: 8 },
  { label: 'EMOM', work: 60, rest: 0, rounds: 10 },
  { label: 'Sprints', work: 30, rest: 90, rounds: 8 },
];

function buzz(pattern?: number | number[]) {
  if (Platform.OS === 'web') return;
  try { Vibration.vibrate(pattern ?? 400); } catch { /* no-op */ }
}

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m > 0 ? `${m}:${sec.toString().padStart(2, '0')}` : `${sec}`;
}

export default function IntervalTimer() {
  const [work, setWork] = useState(30);
  const [rest, setRest] = useState(30);
  const [rounds, setRounds] = useState(8);

  const [phase, setPhase] = useState<Phase>('idle');
  const [round, setRound] = useState(1);
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);

  // Keep the freshest values available to the interval callback.
  const state = useRef({ phase, round, remaining, work, rest, rounds });
  state.current = { phase, round, remaining, work, rest, rounds };

  useEffect(() => () => { if (tick.current) clearInterval(tick.current); }, []);

  const stopTick = () => { if (tick.current) { clearInterval(tick.current); tick.current = null; } };

  const advance = () => {
    const s = state.current;
    if (s.phase === 'work') {
      if (s.rest > 0) { setPhase('rest'); setRemaining(s.rest); buzz([0, 200, 100, 200]); return; }
      // no rest → straight into next round (or done)
    }
    // finishing a work block with no rest, or finishing a rest block
    if (s.round >= s.rounds) { setPhase('done'); setRunning(false); stopTick(); buzz([0, 400, 150, 400, 150, 400]); return; }
    setRound(s.round + 1); setPhase('work'); setRemaining(s.work); buzz(400);
  };

  const start = () => {
    if (running) return;
    if (phase === 'idle' || phase === 'done') {
      setPhase('work'); setRound(1); setRemaining(work); buzz(400);
    }
    setRunning(true);
    stopTick();
    tick.current = setInterval(() => {
      setRemaining(r => {
        if (r > 1) return r - 1;
        // hit zero — transition on the next frame to keep this setter pure-ish
        setTimeout(advance, 0);
        return 0;
      });
    }, 1000);
  };

  const pause = () => { setRunning(false); stopTick(); };
  const reset = () => { setRunning(false); stopTick(); setPhase('idle'); setRound(1); setRemaining(0); };

  const editable = phase === 'idle' || phase === 'done';
  const phaseColor = phase === 'work' ? colors.accent : phase === 'rest' ? colors.success : colors.textMuted;

  const Stepper = ({ label, value, onChange, step, min, max, suffix }: {
    label: string; value: number; onChange: (v: number) => void; step: number; min: number; max: number; suffix?: string;
  }) => (
    <View style={styles.stepperRow}>
      <Text style={styles.stepperLabel}>{label}</Text>
      <View style={styles.stepperControls}>
        <TouchableOpacity
          style={[styles.stepBtn, !editable && styles.stepBtnDisabled]}
          disabled={!editable}
          onPress={() => onChange(Math.max(min, value - step))}
        >
          <Text style={styles.stepBtnText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.stepperValue}>{value}{suffix}</Text>
        <TouchableOpacity
          style={[styles.stepBtn, !editable && styles.stepBtnDisabled]}
          disabled={!editable}
          onPress={() => onChange(Math.min(max, value + step))}
        >
          <Text style={styles.stepBtnText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Interval Timer</Text>

      {editable && (
        <View style={styles.presets}>
          {PRESETS.map(p => (
            <TouchableOpacity
              key={p.label}
              style={styles.presetBtn}
              onPress={() => { setWork(p.work); setRest(p.rest); setRounds(p.rounds); }}
            >
              <Text style={styles.presetText}>{p.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.display}>
        <Text style={[styles.phaseLabel, { color: phaseColor }]}>
          {phase === 'idle' ? 'READY' : phase === 'done' ? 'DONE 🎉' : phase.toUpperCase()}
        </Text>
        <Text style={[styles.bigTime, { color: phaseColor }]}>
          {phase === 'idle' ? fmt(work) : fmt(remaining)}
        </Text>
        <Text style={styles.roundText}>
          {phase === 'done' ? `${rounds} rounds complete` : `Round ${round} of ${rounds}`}
        </Text>
      </View>

      {editable && (
        <View style={{ marginBottom: 12 }}>
          <Stepper label="Work" value={work} onChange={setWork} step={5} min={5} max={600} suffix="s" />
          <Stepper label="Rest" value={rest} onChange={setRest} step={5} min={0} max={600} suffix="s" />
          <Stepper label="Rounds" value={rounds} onChange={setRounds} step={1} min={1} max={50} />
        </View>
      )}

      <View style={styles.controls}>
        {!running ? (
          <TouchableOpacity style={[styles.ctrlBtn, styles.startBtn]} onPress={start}>
            <Text style={styles.startText}>{phase === 'idle' || phase === 'done' ? '▶ Start' : '▶ Resume'}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.ctrlBtn, styles.pauseBtn]} onPress={pause}>
            <Text style={styles.pauseText}>❚❚ Pause</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={[styles.ctrlBtn, styles.resetBtn]} onPress={reset}>
          <Text style={styles.resetText}>↺ Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  cardTitle: { fontFamily: fonts.semibold, fontSize: 14, color: colors.text, marginBottom: 10 },
  presets: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  presetBtn: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12 },
  presetText: { fontFamily: fonts.semibold, fontSize: 12, color: colors.textMuted },
  display: { alignItems: 'center', paddingVertical: 12 },
  phaseLabel: { fontFamily: fonts.bold, fontSize: 13, letterSpacing: 2, marginBottom: 2 },
  bigTime: { fontFamily: fonts.display, fontSize: 56, letterSpacing: 1 },
  roundText: { fontFamily: fonts.regular, fontSize: 13, color: colors.textDim, marginTop: 2 },
  stepperRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  stepperLabel: { fontFamily: fonts.semibold, fontSize: 14, color: colors.textMuted },
  stepperControls: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  stepBtn: { width: 36, height: 36, borderRadius: 8, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cardAlt },
  stepBtnDisabled: { opacity: 0.35 },
  stepBtnText: { fontFamily: fonts.bold, fontSize: 20, color: colors.text, lineHeight: 22 },
  stepperValue: { fontFamily: fonts.semibold, fontSize: 16, color: colors.text, width: 56, textAlign: 'center' },
  controls: { flexDirection: 'row', gap: 10 },
  ctrlBtn: { flex: 1, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  startBtn: { backgroundColor: colors.accent },
  startText: { fontFamily: fonts.bold, fontSize: 15, color: '#fff' },
  pauseBtn: { backgroundColor: colors.warning },
  pauseText: { fontFamily: fonts.bold, fontSize: 15, color: '#fff' },
  resetBtn: { borderWidth: 1, borderColor: colors.border },
  resetText: { fontFamily: fonts.semibold, fontSize: 15, color: colors.textMuted },
});
