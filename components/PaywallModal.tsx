import { useState } from 'react';
import {
  Modal, View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, ActivityIndicator, Alert, Linking,
} from 'react-native';
import { useSubscription } from '@/context/SubscriptionContext';
import { colors, fonts } from '@/constants/theme';

type Props = {
  visible: boolean;
  onClose: () => void;
  featureName?: string;
};

export default function PaywallModal({ visible, onClose, featureName }: Props) {
  const { purchaseMonthly, purchaseAnnual, restorePurchases, isLoading, offerings } = useSubscription();
  const [buying, setBuying] = useState<'monthly' | 'annual' | 'restore' | null>(null);
  const productsReady = !!offerings?.current;

  const handleMonthly = async () => {
    console.log('[Paywall] Monthly tapped, productsReady:', productsReady);
    setBuying('monthly');
    try {
      await purchaseMonthly();
      console.log('[Paywall] Monthly purchase completed, closing paywall');
      onClose();
    } catch (e: any) {
      console.log('[Paywall] Monthly purchase error:', e?.message, 'userCancelled:', e?.userCancelled);
      if (e?.userCancelled) {
        setBuying(null);
        return;
      }
      Alert.alert('Purchase failed', e?.message ?? 'Something went wrong. Please try again.');
    } finally {
      setBuying(null);
    }
  };

  const handleAnnual = async () => {
    console.log('[Paywall] Annual tapped, productsReady:', productsReady);
    setBuying('annual');
    try {
      await purchaseAnnual();
      console.log('[Paywall] Annual purchase completed, closing paywall');
      onClose();
    } catch (e: any) {
      console.log('[Paywall] Annual purchase error:', e?.message, 'userCancelled:', e?.userCancelled);
      if (e?.userCancelled) {
        setBuying(null);
        return;
      }
      Alert.alert('Purchase failed', e?.message ?? 'Something went wrong. Please try again.');
    } finally {
      setBuying(null);
    }
  };

  const handleRestore = async () => {
    setBuying('restore');
    try {
      const didRestore = await restorePurchases();
      if (didRestore) {
        Alert.alert('Restored', 'Your DadLift Pro subscription has been restored.');
        onClose();
      } else {
        Alert.alert('No purchases found', 'No active DadLift Pro subscription was found on this Apple ID.');
      }
    } catch (e: any) {
      Alert.alert('Restore failed', e?.message ?? 'Something went wrong. Please try again.');
    } finally {
      setBuying(null);
    }
  };

  const isBusy = isLoading || buying !== null;
  const planButtonsDisabled = isBusy || !productsReady;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.safe}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose} disabled={isBusy}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.badge}>DADLIFT PRO</Text>
          <Text style={styles.headline}>TRAIN LIKE A DAD.{'\n'}PLAN LIKE A PRO.</Text>

          {featureName && (
            <Text style={styles.subheadline}>Unlock {featureName} and everything below.</Text>
          )}

          <View style={styles.featureList}>
            {[
              ['📋', 'Monthly workout planning'],
              ['📊', 'Full workout history & stats'],
              ['🔨', 'Build custom workouts'],
              ['♾️', 'All future features'],
            ].map(([icon, label]) => (
              <View key={label} style={styles.featureRow}>
                <Text style={styles.featureIcon}>{icon}</Text>
                <Text style={styles.featureLabel}>{label}</Text>
              </View>
            ))}
          </View>

          {/* Annual — best value */}
          <TouchableOpacity
            style={[styles.planCard, styles.planCardHighlight, planButtonsDisabled && styles.planCardDisabled]}
            onPress={handleAnnual}
            disabled={planButtonsDisabled}
          >
            <View style={styles.bestValueBadge}>
              <Text style={styles.bestValueText}>BEST VALUE</Text>
            </View>
            <View style={styles.planRow}>
              {buying === 'annual' || (isLoading && !productsReady)
                ? <ActivityIndicator color="#fff" />
                : <>
                    <View>
                      <Text style={styles.planTitle}>Annual</Text>
                      <Text style={styles.planSub}>$2.08 / month</Text>
                    </View>
                    <Text style={styles.planPrice}>$25 / year</Text>
                  </>
              }
            </View>
          </TouchableOpacity>

          {/* Monthly */}
          <TouchableOpacity
            style={[styles.planCard, planButtonsDisabled && styles.planCardDisabled]}
            onPress={handleMonthly}
            disabled={planButtonsDisabled}
          >
            <View style={styles.planRow}>
              {buying === 'monthly' || (isLoading && !productsReady)
                ? <ActivityIndicator color={colors.text} />
                : <>
                    <Text style={styles.planTitle}>Monthly</Text>
                    <Text style={styles.planPrice}>$4.99 / month</Text>
                  </>
              }
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.restoreBtn} onPress={handleRestore} disabled={isBusy}>
            {buying === 'restore'
              ? <ActivityIndicator color={colors.textMuted} size="small" />
              : <Text style={styles.restoreText}>Restore Purchases</Text>
            }
          </TouchableOpacity>

          <Text style={styles.legal}>
            DadLift Pro is available as a monthly subscription ($4.99/month) or annual subscription ($25/year). Payment is charged to your Apple ID account at confirmation of purchase. Subscriptions automatically renew unless cancelled at least 24 hours before the end of the current period. Manage or cancel your subscription in your Account Settings after purchase.
          </Text>

          <View style={styles.legalLinks}>
            <TouchableOpacity onPress={() => Linking.openURL('https://www.apple.com/legal/internet-services/itunes/dev/stdeula/')}>
              <Text style={styles.legalLink}>Terms of Use</Text>
            </TouchableOpacity>
            <Text style={styles.legalSep}>·</Text>
            <TouchableOpacity onPress={() => Linking.openURL('https://dadliftapp.com/privacy')}>
              <Text style={styles.legalLink}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  closeBtn: { alignSelf: 'flex-end', padding: 20 },
  closeBtnText: { color: colors.textMuted, fontSize: 18 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 24, paddingBottom: 48 },
  badge: {
    fontFamily: fonts.bold, fontSize: 12, letterSpacing: 3,
    color: colors.accent, marginBottom: 12,
  },
  headline: {
    fontFamily: fonts.display, fontSize: 36, letterSpacing: 1,
    color: colors.text, lineHeight: 42, marginBottom: 8,
  },
  subheadline: {
    fontFamily: fonts.regular, fontSize: 15, color: colors.textMuted,
    marginBottom: 24, lineHeight: 22,
  },
  featureList: { marginBottom: 28 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  featureIcon: { fontSize: 20, width: 28 },
  featureLabel: { fontFamily: fonts.regular, fontSize: 15, color: colors.text },

  planCard: {
    backgroundColor: colors.card, borderRadius: 16, padding: 18,
    borderWidth: 1, borderColor: colors.border, marginBottom: 12,
  },
  planCardHighlight: {
    backgroundColor: colors.accent, borderColor: colors.accent,
  },
  planCardDisabled: {
    opacity: 0.5,
  },
  bestValueBadge: {
    alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 10,
  },
  bestValueText: { fontFamily: fonts.bold, fontSize: 10, letterSpacing: 2, color: '#fff' },
  planRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  planTitle: { fontFamily: fonts.bold, fontSize: 17, color: '#fff' },
  planSub: { fontFamily: fonts.regular, fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  planPrice: { fontFamily: fonts.bold, fontSize: 17, color: '#fff' },

  restoreBtn: { alignItems: 'center', paddingVertical: 12 },
  restoreText: { fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted },

  legal: {
    fontFamily: fonts.light, fontSize: 11, color: colors.textMuted,
    textAlign: 'center', lineHeight: 16, marginTop: 8,
  },
  legalLinks: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    marginTop: 10, gap: 6,
  },
  legalLink: {
    fontFamily: fonts.regular, fontSize: 11, color: colors.text,
    textDecorationLine: 'underline',
  },
  legalSep: {
    fontFamily: fonts.regular, fontSize: 11, color: colors.textMuted,
  },
});
