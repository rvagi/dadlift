import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useSubscription } from '@/context/SubscriptionContext';
import PaywallModal from './PaywallModal';
import { colors, fonts } from '@/constants/theme';

type Props = {
  featureName: string;
  children: React.ReactNode;
};

/**
 * Wraps a screen. If the user is not Pro, shows a locked overlay with the paywall.
 * If Pro, renders children normally.
 */
export default function ProGate({ featureName, children }: Props) {
  const { isPro, isLoading } = useSubscription();
  const [paywallVisible, setPaywallVisible] = useState(false);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (isPro) {
    return <>{children}</>;
  }

  return (
    <View style={styles.container}>
      {/* Blurred/dimmed preview of the children */}
      <View style={styles.preview} pointerEvents="none">
        {children}
      </View>

      {/* Lock overlay */}
      <View style={styles.overlay}>
        <Text style={styles.lock}>🔒</Text>
        <Text style={styles.title}>DADLIFT PRO</Text>
        <Text style={styles.desc}>
          {featureName} is a Pro feature.{'\n'}Upgrade to unlock it and everything else.
        </Text>
        <TouchableOpacity style={styles.btn} onPress={() => setPaywallVisible(true)}>
          <Text style={styles.btnText}>See Plans →</Text>
        </TouchableOpacity>
      </View>

      <PaywallModal
        visible={paywallVisible}
        onClose={() => setPaywallVisible(false)}
        featureName={featureName}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  container: { flex: 1 },
  preview: { flex: 1, opacity: 0.12 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.bg + 'CC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  lock: { fontSize: 48, marginBottom: 16 },
  title: {
    fontFamily: fonts.display, fontSize: 32, letterSpacing: 2,
    color: colors.accent, marginBottom: 12,
  },
  desc: {
    fontFamily: fonts.regular, fontSize: 15, color: colors.textMuted,
    textAlign: 'center', lineHeight: 24, marginBottom: 28,
  },
  btn: {
    backgroundColor: colors.accent, borderRadius: 14,
    paddingVertical: 16, paddingHorizontal: 40,
  },
  btnText: { fontFamily: fonts.bold, fontSize: 16, color: '#fff' },
});
