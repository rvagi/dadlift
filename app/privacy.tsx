import { ScrollView, View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { colors, fonts } from '@/constants/theme';

export default function PrivacyPolicy() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.logo}>DADLIFT</Text>
        <Text style={styles.h1}>Privacy Policy</Text>
        <Text style={styles.updated}>Last updated: April 2026</Text>

        <Text style={styles.p}>
          DadLift is built for dads who want to get stronger and healthier. We take your privacy seriously and keep things simple.
        </Text>

        <Text style={styles.h2}>What We Collect</Text>
        <Text style={styles.p}>
          <Text style={styles.bold}>Email address</Text> — collected when you create an account. Used only to identify your account and send essential communications.
        </Text>
        <Text style={styles.p}>
          <Text style={styles.bold}>Workout data</Text> — your weekly plan, workout logs, exercise sets, reps, weights, and any notes you enter. This data is stored to power the app's features and help you track your progress.
        </Text>

        <Text style={styles.h2}>What We Don't Do</Text>
        <Text style={styles.p}>
          We do not sell your personal data to third parties. We do not share your data with advertisers. We do not use your workout data for any purpose other than providing the DadLift service to you.
        </Text>

        <Text style={styles.h2}>How Your Data Is Stored</Text>
        <Text style={styles.p}>
          Your data is stored securely. Workout data is saved locally on your device. If you create an account, your data is also backed up to our secure servers so you can access it across devices.
        </Text>

        <Text style={styles.h2}>Your Rights</Text>
        <Text style={styles.p}>
          You can request a copy of your data or ask us to delete your account and all associated data at any time. To make a request, email us at:
        </Text>
        <Text style={[styles.p, styles.email]}>support@dadliftapp.com</Text>
        <Text style={styles.p}>
          We will respond within 30 days.
        </Text>

        <Text style={styles.h2}>Children's Privacy</Text>
        <Text style={styles.p}>
          DadLift is intended for adults. We do not knowingly collect data from anyone under the age of 13.
        </Text>

        <Text style={styles.h2}>Changes to This Policy</Text>
        <Text style={styles.p}>
          If we make material changes to this policy, we will update the date at the top of this page. Continued use of the app after changes constitutes acceptance of the updated policy.
        </Text>

        <Text style={styles.h2}>Contact</Text>
        <Text style={styles.p}>
          Questions about this policy? Email us at support@dadliftapp.com.
        </Text>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 24, paddingBottom: 48, maxWidth: 680, alignSelf: 'center', width: '100%' },
  logo: { fontFamily: fonts.display, fontSize: 24, letterSpacing: 2, color: colors.accent, marginBottom: 24 },
  h1: { fontFamily: fonts.display, fontSize: 36, letterSpacing: 1, color: colors.text, marginBottom: 6 },
  updated: { fontFamily: fonts.regular, fontSize: 13, color: colors.textDim, marginBottom: 24 },
  h2: { fontFamily: fonts.semibold, fontSize: 18, color: colors.text, marginTop: 24, marginBottom: 8 },
  p: { fontFamily: fonts.regular, fontSize: 15, color: colors.textMuted, lineHeight: 24, marginBottom: 8 },
  bold: { fontFamily: fonts.semibold, color: colors.text },
  email: { color: colors.accent, fontFamily: fonts.semibold },
});
