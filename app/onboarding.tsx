import { useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { colors, fonts, workoutTypes, equipmentOptions } from '@/constants/theme';

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const { completeOnboarding } = useApp();
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);

  const next = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
    setStep(s => s + 1);
  };

  const finish = () => {
    // Navigate immediately — save happens in the background
    completeOnboarding(selectedEquipment).catch(console.error);
    router.replace('/(tabs)');
  };

  const toggleEquipment = (id: string) => {
    setSelectedEquipment(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const steps = [
    // Step 0: Welcome
    <View style={s.centered} key="0">
      <Text style={s.heroEmoji}>👨‍👧‍👦</Text>
      <Text style={s.logo}>DADLIFT</Text>
      <Text style={s.heroSubtitle}>
        The fitness app for dads who want to show up — for their kids, their partner, and themselves.
      </Text>
      <TouchableOpacity style={s.btn} onPress={next}>
        <Text style={s.btnText}>Let's Go</Text>
      </TouchableOpacity>
    </View>,

    // Step 1: Value prop
    <View key="1">
      <Text style={s.h1}>YOU DON'T NEED TO BE A COMMANDO.</Text>
      <Text style={s.p}>You just need to:</Text>
      <View style={[s.card, { borderLeftWidth: 4, borderLeftColor: colors.accent }]}>
        <Text style={s.listItem}>Have the energy to keep up with your kids</Text>
        <Text style={s.listItem}>Be healthy enough to play with your grandkids someday</Text>
        <Text style={s.listItem}>Be strong enough to help the people who need you</Text>
        <Text style={[s.listItem, { marginBottom: 0 }]}>Feel good and look good enough that your wife notices</Text>
      </View>
      <Text style={s.p}>
        DadLift gives you the 20% of fitness knowledge that delivers 80% of the results. No confusion. No overwhelm. No six-pack promises. Just a simple, proven system that gets you stronger, healthier, and more capable — starting this week.
      </Text>
      <TouchableOpacity style={s.btn} onPress={next}>
        <Text style={s.btnText}>How It Works →</Text>
      </TouchableOpacity>
    </View>,

    // Step 2: How it works
    <View key="2">
      <Text style={s.h1}>THE SYSTEM: 4 WORKOUTS A WEEK</Text>
      <Text style={s.p}>Every week follows the same simple template. No thinking required.</Text>
      {Object.entries(workoutTypes).map(([key, t]) => (
        <View key={key} style={[s.card, { borderLeftWidth: 4, borderLeftColor: t.color, marginBottom: 10, padding: 14 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: t.color }} />
            <Text style={[s.label, { color: colors.text }]}>{t.label}</Text>
          </View>
          <Text style={[s.p, { fontSize: 13, marginBottom: 0 }]}>
            {key === 'strength-endurance' && "Full-body workout with light or no weight. You'll build the stamina to carry groceries, haul kids, and power through a long day without feeling wiped out."}
            {key === 'strength-hypertrophy' && "Full-body workout with heavier weights and fewer reps. This is how you gain muscle, fill out a t-shirt, and build the kind of strength people notice."}
            {key === 'cardio-l2' && "A longer, easy-paced session — walking, jogging, cycling, whatever you enjoy. This is what keeps your heart healthy, your stress low, and your energy steady all day. 45-60+ minutes."}
            {key === 'cardio-vo2max' && "Short, intense bursts — hill sprints, bike intervals, burpees. This builds the kind of fitness that lets you sprint after your kid without gasping for air. 20-30 minutes total."}
          </Text>
        </View>
      ))}
      <Text style={[s.p, { fontSize: 13 }]}>
        Every strength workout hits your full body — chest, back, arms, and legs — in a single session. No complicated schedules.
      </Text>
      <TouchableOpacity style={s.btn} onPress={next}>
        <Text style={s.btnText}>Got It →</Text>
      </TouchableOpacity>
    </View>,

    // Step 3: Monthly rotation
    <View key="3">
      <Text style={s.h1}>MONTHLY ROTATION</Text>
      <Text style={s.p}>Pick your 4 workouts. Run them for a month. Then swap in new ones.</Text>
      <View style={s.card}>
        <Text style={s.cardTitle}>🔁  Why rotate monthly?</Text>
        <Text style={[s.p, { marginBottom: 0, fontSize: 14 }]}>
          Cross-training different movements and muscle groups keeps your body adapting and prevents plateaus. Plus it keeps things fresh — you never get bored.
        </Text>
      </View>
      <View style={s.card}>
        <Text style={s.cardTitle}>📈  Tracking progress</Text>
        <Text style={[s.p, { marginBottom: 0, fontSize: 14 }]}>
          On endurance days, track max reps. Beat last week's number.{'\n'}
          On hypertrophy days, track weight. When you hit all your reps, add weight next time.{'\n'}
          On cardio, just log that you did it. Consistency wins.
        </Text>
      </View>
      <TouchableOpacity style={s.btn} onPress={next}>
        <Text style={s.btnText}>Almost Done →</Text>
      </TouchableOpacity>
    </View>,

    // Step 4: Equipment
    <View key="4">
      <Text style={s.h1}>WHAT DO YOU HAVE ACCESS TO?</Text>
      <Text style={s.p}>Select all that apply. Bodyweight workouts are always available. You can change this anytime.</Text>
      {equipmentOptions.filter(e => e.id !== 'bodyweight').map(eq => {
        const selected = selectedEquipment.includes(eq.id);
        return (
          <TouchableOpacity
            key={eq.id}
            onPress={() => toggleEquipment(eq.id)}
            style={[s.card, s.equipRow, selected && s.equipSelected]}
          >
            <Text style={{ fontSize: 28 }}>{eq.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.label}>{eq.label}</Text>
              <Text style={[s.p, { fontSize: 13, marginBottom: 0 }]}>{eq.desc}</Text>
            </View>
            {selected && <Text style={{ color: colors.accent, fontSize: 20 }}>✓</Text>}
          </TouchableOpacity>
        );
      })}
      <View style={[s.card, s.equipRow, { opacity: 0.6 }]}>
        <Text style={{ fontSize: 28 }}>🏋️</Text>
        <View style={{ flex: 1 }}>
          <Text style={s.label}>Bodyweight</Text>
          <Text style={[s.p, { fontSize: 13, marginBottom: 0 }]}>Always available — no equipment needed</Text>
        </View>
        <Text style={{ color: colors.success, fontSize: 20 }}>✓</Text>
      </View>
      <TouchableOpacity style={s.btn} onPress={finish}>
        <Text style={s.btnText}>Start Training →</Text>
      </TouchableOpacity>
    </View>,
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {steps[step]}
      </ScrollView>
      {/* Step dots */}
      <View style={s.dots}>
        {steps.map((_, i) => (
          <View key={i} style={[s.dot, i === step && s.dotActive]} />
        ))}
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  scroll: { padding: 24, paddingBottom: 48 },
  centered: { alignItems: 'center', justifyContent: 'center', minHeight: 500, gap: 16 },
  heroEmoji: { fontSize: 64 },
  logo: { fontFamily: fonts.display, fontSize: 48, letterSpacing: 3, color: colors.accent },
  heroSubtitle: { fontFamily: fonts.regular, fontSize: 17, color: colors.textMuted, textAlign: 'center', lineHeight: 26, maxWidth: 300 },
  h1: { fontFamily: fonts.display, fontSize: 30, letterSpacing: 1, color: colors.text, marginBottom: 12, lineHeight: 34 },
  p: { fontFamily: fonts.regular, fontSize: 15, color: colors.textMuted, lineHeight: 24, marginBottom: 16 },
  label: { fontFamily: fonts.semibold, fontSize: 15, color: colors.text },
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  cardTitle: { fontFamily: fonts.semibold, fontSize: 15, color: colors.text, marginBottom: 8 },
  listItem: { fontFamily: fonts.regular, fontSize: 16, color: colors.text, lineHeight: 26, marginBottom: 14 },
  equipRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  equipSelected: { borderColor: colors.accent, borderWidth: 2, backgroundColor: colors.accentSoft },
  btn: { backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  btnText: { fontFamily: fonts.bold, fontSize: 16, color: '#fff', letterSpacing: 0.5 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, paddingBottom: 20, paddingTop: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  dotActive: { backgroundColor: colors.accent, width: 24 },
});
