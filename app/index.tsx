import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { colors } from '@/constants/theme';

export default function Index() {
  const { isReady, onboarded } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) return;
    if (onboarded) {
      router.replace('/(tabs)');
    } else {
      router.replace('/onboarding');
    }
  }, [isReady, onboarded]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator color={colors.accent} size="large" />
    </View>
  );
}
