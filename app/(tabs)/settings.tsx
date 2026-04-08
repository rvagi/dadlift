import { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { colors, fonts, equipmentOptions } from '@/constants/theme';

export default function SettingsScreen() {
  const { equipment, setEquipment, clearWorkoutHistory } = useApp();
  const router = useRouter();

  const toggleEquipment = async (id: string) => {
    const next = equipment.includes(id) ? equipment.filter(e => e !== id) : [...equipment, id];
    await setEquipment(next);
  };

  const confirmClearHistory = () => {
    Alert.alert(
      'Clear Workout History',
      'This will permanently delete all your workout logs. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: () => clearWorkoutHistory() },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.logo}>DADLIFT</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.h1}>SETTINGS</Text>

        <Text style={styles.h2}>MY EQUIPMENT</Text>
        <Text style={styles.p}>Tap to toggle. This filters which workouts appear in your library.</Text>

        {equipmentOptions.filter(e => e.id !== 'bodyweight').map(eq => {
          const active = equipment.includes(eq.id);
          return (
            <TouchableOpacity
              key={eq.id}
              style={[styles.card, styles.equipRow, active && styles.equipActive]}
              onPress={() => toggleEquipment(eq.id)}
            >
              <Text style={{ fontSize: 24 }}>{eq.icon}</Text>
              <Text style={styles.label}>{eq.label}</Text>
              {active && <Text style={{ marginLeft: 'auto', color: colors.accent, fontSize: 18 }}>✓</Text>}
            </TouchableOpacity>
          );
        })}

        <View style={[styles.card, styles.equipRow, { opacity: 0.5 }]}>
          <Text style={{ fontSize: 24 }}>🏋️</Text>
          <Text style={styles.label}>Bodyweight</Text>
          <Text style={{ marginLeft: 'auto', color: colors.success, fontSize: 18 }}>✓</Text>
        </View>

        <Text style={styles.h2}>ABOUT</Text>
        <TouchableOpacity style={styles.btnOutline} onPress={() => router.push('/onboarding')}>
          <Text style={styles.btnOutlineText}>Replay Intro</Text>
        </TouchableOpacity>

        <Text style={styles.h2}>DATA</Text>
        <TouchableOpacity
          style={[styles.btnOutline, { borderColor: colors.danger }]}
          onPress={confirmClearHistory}
        >
          <Text style={[styles.btnOutlineText, { color: colors.danger }]}>Clear Workout History</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  logo: { fontFamily: fonts.display, fontSize: 28, letterSpacing: 2, color: colors.accent },
  scroll: { padding: 20, paddingBottom: 32 },
  h1: { fontFamily: fonts.display, fontSize: 32, letterSpacing: 1, color: colors.text, marginBottom: 16 },
  h2: { fontFamily: fonts.display, fontSize: 24, letterSpacing: 1, color: colors.text, marginTop: 24, marginBottom: 12 },
  p: { fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted, lineHeight: 22, marginBottom: 12 },
  label: { fontFamily: fonts.semibold, fontSize: 15, color: colors.text },
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.border },
  equipRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  equipActive: { borderColor: colors.accent, borderWidth: 2, backgroundColor: colors.accentSoft },
  btnOutline: { borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 10 },
  btnOutlineText: { fontFamily: fonts.semibold, fontSize: 15, color: colors.textMuted },
});
