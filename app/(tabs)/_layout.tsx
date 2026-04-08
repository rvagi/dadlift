import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';
import { colors, fonts } from '@/constants/theme';

function TabIcon({ emoji, focused }: { emoji: string; label: string; focused: boolean }) {
  return (
    <View style={{ alignItems: 'center', gap: 4, paddingTop: 4 }}>
      <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.45 }}>{emoji}</Text>
      <View style={{
        width: 4, height: 4, borderRadius: 2,
        backgroundColor: focused ? colors.accent : 'transparent',
      }} />
    </View>
  );
}

export default function TabLayout() {
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
          tabBarIcon: ({ focused }) => <TabIcon emoji="🔨" label="Build" focused={focused} />,
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
