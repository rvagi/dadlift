import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';
import { colors, fonts } from '@/constants/theme';
import { useSubscription } from '@/context/SubscriptionContext';

function TabIcon({ emoji, focused, locked }: { emoji: string; label: string; focused: boolean; locked?: boolean }) {
  return (
    <View style={{ alignItems: 'center', gap: 4, paddingTop: 4 }}>
      <View>
        <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.45 }}>{emoji}</Text>
        {locked && (
          <View style={{
            position: 'absolute', top: -4, right: -6,
            backgroundColor: colors.accent, borderRadius: 6,
            paddingHorizontal: 3, paddingVertical: 1,
          }}>
            <Text style={{ fontSize: 8, color: '#fff', fontFamily: fonts.bold }}>PRO</Text>
          </View>
        )}
      </View>
      <View style={{
        width: 4, height: 4, borderRadius: 2,
        backgroundColor: focused ? colors.accent : 'transparent',
      }} />
    </View>
  );
}

export default function TabLayout() {
  const { isPro } = useSubscription();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 72,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏋️" label="Workout" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="plan"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="📋" label="Plan" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="📊" label="History" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="📚" label="Library" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="build"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="🔨" label="Build" focused={focused} locked={!isPro} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="⚙️" label="Settings" focused={focused} />,
        }}
      />
      {/* Hide legacy template file */}
      <Tabs.Screen name="two" options={{ href: null }} />
    </Tabs>
  );
}
