import { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, TextInput, StyleSheet, SafeAreaView, Alert, Clipboard, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { useSubscription } from '@/context/SubscriptionContext';
import PaywallModal from '@/components/PaywallModal';
import { colors, fonts, equipmentOptions } from '@/constants/theme';

export default function SettingsScreen() {
  const { equipment, setEquipment, clearWorkoutHistory } = useApp();
  const { isPro, customerID, restorePurchases, refreshStatus } = useSubscription();
  const router = useRouter();
  const [paywallVisible, setPaywallVisible] = useState(false);
  const [giftCode, setGiftCode] = useState('');
  const [redeemingCode, setRedeemingCode] = useState(false);

  const redeemGiftCode = async () => {
    if (!giftCode.trim()) return;
    if (!customerID) {
      Alert.alert('Not ready', 'Please wait a moment and try again.');
      return;
    }
    setRedeemingCode(true);
    try {
      const res = await fetch(
        'https://vbsixbjxnhmwemishfxa.supabase.co/functions/v1/redeem-gift-code',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ giftCode: giftCode.trim(), customerId: customerID }),
        }
      );
      const data = await res.json();
      if (data.success) {
        await refreshStatus();
        setGiftCode('');
        Alert.alert('Welcome to Pro!', 'You now have full access to DadLift Pro.');
      } else {
        Alert.alert('Invalid code', 'That code didn\'t work. Double-check and try again.');
      }
    } catch {
      Alert.alert('Error', 'Could not connect. Check your internet and try again.');
    } finally {
      setRedeemingCode(false);
    }
  };

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

        {/* ── SUBSCRIPTION ── */}
        <Text style={styles.h2}>SUBSCRIPTION</Text>
        {isPro ? (
          <View style={[styles.card, { borderColor: colors.accent, borderWidth: 2 }]}>
            <Text style={[styles.label, { color: colors.accent }]}>✓ DADLIFT PRO</Text>
            <Text style={[styles.p, { marginBottom: 8 }]}>
              You have full access to all Pro features.
            </Text>
            {Platform.OS !== 'web' && customerID ? (
              <TouchableOpacity onPress={() => {
                Clipboard.setString(customerID);
                Alert.alert('Copied', 'Your customer ID has been copied.\nShare it to receive gift access.');
              }}>
                <Text style={[styles.p, { fontSize: 11, color: colors.textDim }]}>
                  Customer ID (tap to copy){'\n'}{customerID}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : (
          <>
            <Text style={styles.p}>
              Unlock monthly planning, workout history, and custom workouts.
            </Text>
            <TouchableOpacity style={styles.btnAccent} onPress={() => setPaywallVisible(true)}>
              <Text style={styles.btnAccentText}>Upgrade to Pro →</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnOutline} onPress={async () => {
              try {
                await restorePurchases();
                await refreshStatus();
                Alert.alert('Restored', 'Your purchases have been restored.');
              } catch {
                Alert.alert('Nothing to restore', 'No previous purchases found for this account.');
              }
            }}>
              <Text style={styles.btnOutlineText}>Restore Purchases</Text>
            </TouchableOpacity>
            {/* Gift code redemption */}
            <View style={styles.giftRow}>
              <TextInput
                style={styles.giftInput}
                value={giftCode}
                onChangeText={setGiftCode}
                placeholder="Have a gift code?"
                placeholderTextColor={colors.textDim}
                autoCapitalize="characters"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={[styles.giftBtn, (!giftCode.trim() || redeemingCode) && { opacity: 0.5 }]}
                onPress={redeemGiftCode}
                disabled={!giftCode.trim() || redeemingCode}
              >
                {redeemingCode
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={styles.giftBtnText}>Redeem</Text>
                }
              </TouchableOpacity>
            </View>

            {Platform.OS !== 'web' && customerID ? (
              <TouchableOpacity onPress={() => {
                Clipboard.setString(customerID);
                Alert.alert('Copied', 'Share your customer ID to receive gift access from a friend.');
              }}>
                <Text style={[styles.p, { fontSize: 11, color: colors.textDim, marginTop: 8 }]}>
                  Customer ID (tap to copy){'\n'}{customerID}
                </Text>
              </TouchableOpacity>
            ) : null}
          </>
        )}

        <PaywallModal visible={paywallVisible} onClose={() => setPaywallVisible(false)} />

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
  btnAccent: { backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 10 },
  btnAccentText: { fontFamily: fonts.bold, fontSize: 15, color: '#fff' },
  giftRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  giftInput: {
    flex: 1, backgroundColor: colors.cardAlt, borderWidth: 1, borderColor: colors.border,
    borderRadius: 10, padding: 12, color: colors.text, fontFamily: fonts.regular, fontSize: 15,
  },
  giftBtn: {
    backgroundColor: colors.accent, borderRadius: 10,
    paddingHorizontal: 16, justifyContent: 'center', alignItems: 'center',
  },
  giftBtnText: { fontFamily: fonts.bold, fontSize: 14, color: '#fff' },
});
