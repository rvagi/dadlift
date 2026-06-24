import { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Vibration } from 'react-native';
import { useAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import { colors, fonts } from '@/constants/theme';

type Phase = 'idle' | 'countdown' | 'work' | 'rest' | 'done';

type IntervalTimerProps = {
  /** Pre-fill values, e.g. from a workout's prescribed interval. */
  initialWork?: number;
  initialRest?: number;
  initialRounds?: number;
};

const COUNTDOWN = 3; // "3, 2, 1" before the first work interval

function buzz(pattern?: number | number[]) {
  if (Platform.OS === 'web') return;
  try { Vibration.vibrate(pattern ?? 400); } catch { /* no-op */ }
}

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m > 0 ? `${m}:${sec.toString().padStart(2, '0')}` : `${sec}`;
}

export default function IntervalTimer({
  initialWork = 30,
  initialRest = 30,
  initialRounds = 8,
}: IntervalTimerProps) {
  const [work, setWork] = useState(initialWork);
  const [rest, setRest] = useState(initialRest);
  const [rounds, setRounds] = useState(initialRounds);

  const [phase, setPhase] = useState<Phase>('idle');
  const [round, setRound] = useState(1);
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);

  // --- Audio ---------------------------------------------------------------
  // One player per cue. The silent track loops while the timer runs to keep
  // the audio session active so beeps still fire when the screen is locked.
  const countdownSound = useAudioPlayer(require('@/assets/sounds/countdown.wav'));
  const workSound = useAudioPlayer(require('@/assets/sounds/work.wav'));
  const restSound = useAudioPlayer(require('@/assets/sounds/rest.wav'));
  const finishSound = useAudioPlayer(require('@/assets/sounds/finish.wav'));
  const keepAlive = useAudioPlayer(require('@/assets/sounds/silence.wav'));

  const play = (p: AudioPlayer) => { try { p.seekTo(0); p.play(); } catch { /* no-op */ } };

  const startKeepAlive = () => {
    try { keepAlive.loop = true; keepAlive.volume = 0; keepAlive.seekTo(0); keepAlive.play(); }
    catch { /* no-op */ }
  };
  const stopKeepAlive = () => { try { keepAlive.pause(); } catch { /* no-op */ } };

  // Configure the iOS/Android audio session: play through the silent switch
  // and keep running in the background while the timer is active.
  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: 'mixWithOthers',
    }).catch(() => { /* no-op */ });
  }, []);

  // Keep the freshest values available to the interval callback.
  const state = useRef({ phase, round, remaining, work, rest, rounds });
  state.current = { phase, round, remaining, work, rest, rounds };

  useEffect(() => () => {
    if (tick.current) clearInterval(tick.current);
    stopKeepAlive();
  }, []);

  const stopTick = () => { if (tick.current) { clearInterval(tick.current); tick.current = null; } };

  // Fired each time the visible second changes (the value we're counting down TO).
  const onSecond = (next: number) => {
    const ph = state.current.phase;
    if (ph === 'countdown') {
      if (next >= 1) play(countdownSound);           // the "2" and "1" beeps
    } else if (ph === 'rest') {
      if (next >= 1 && next <= 3) play(countdownSound); // get-ready cue, last 3s of rest
    }
  };

  const advance = () => {
    const s = state.current;

    // Countdown finished → first work interval begins.
    if (s.phase === 'countdown') {
      setPhase('work'); setRemaining(s.work); play(workSound); buzz(400); return;
    }

    if (s.phase === 'work') {
      if (s.rest > 0) { setPhase('rest'); setRemaining(s.rest); play(restSound); buzz([0, 200, 100, 200]); return; }
      // no rest → straight into next round (or done)
    }

    // Finishing a work block with no rest, or finishing a rest block.
    if (s.round >= s.rounds) {
      setPhase('done'); setRunning(false); stopTick(); stopKeepAlive();
      play(finishSound); buzz([0, 400, 150, 400, 150, 400]); return;
    }
    setRound(s.round + 1); setPhase('work'); setRemaining(s.work); play(workSound); buzz(400);
  };

  const startTick = () => {
    stopTick();
    tick.current = setInterval(() => {
      setRemaining(r => {
        if (r > 1) { onSecond(r - 1); return r - 1; }
        // hit zero — transition on the next frame to keep this setter pure-ish
        setTimeout(advance, 0);
        return 0;
      });
    }, 1000);
  };

  const start = () => {
    if (running) return;
    startKeepAlive();
    if (phase === 'idle' || phase === 'done') {
      // Begin with the 3-2-1 countdown before the first work interval.
      setPhase('countdown'); setRound(1); setRemaining(COUNTDOWN);
      play(countdownSound); buzz(200); // the "3" beep
    }
    setRunning(true);
    startTick();
  };

  const pause = () => { setRunning(false); stopTick(); stopKeepAlive(); };
  const reset = () => {
    setRunning(false); stopTick(); stopKeepAlive();
    setPhase('idle'); setRound(1); setRemaining(0);
  };

  const editable = phase === 'idle' || phase === 'done';
  const phaseColor = phase === 'work' ? colors.accent
    : phase === 'rest' ? colors.success
    : phase === 'countdown' ? colors.warning
    : colors.textMuted;

  const phaseLabel = phase === 'idle' ? 'READY'
    : phase === 'done' ? 'DONE 🎉'
    : phase === 'countdown' ? 'GET READY'
    : phase.toUpperCase();

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

      <View style={styles.display}>
        <Text style={[styles.phaseLabel, { color: phaseColor }]}>{phaseLabel}</Text>
        <Text style={[styles.bigTime, { color: phaseColor }]}>
          {phase === 'idle' ? fmt(work) : fmt(remaining)}
        </Text>
        <Text style={styles.roundText}>
          {phase === 'done' ? `${rounds} rounds complete`
            : phase === 'countdown' ? 'Starting…'
            : `Round ${round} of ${rounds}`}
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
