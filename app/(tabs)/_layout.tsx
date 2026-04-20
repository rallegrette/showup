import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Map, Music, Users, User } from 'lucide-react-native';
import { colors, spacing } from '../../src/theme';
import { useHaptics } from '../../src/hooks/useHaptics';
import { Text } from '../../src/components/ui/Text';

function TabIcon({ icon: Icon, focused, label }: { icon: typeof Map; focused: boolean; label: string }) {
  return (
    <View style={styles.tabItem}>
      <Icon
        size={22}
        color={focused ? colors.primary : colors.textTertiary}
        strokeWidth={focused ? 2.5 : 1.8}
      />
      <Text
        variant="micro"
        style={{
          color: focused ? colors.primary : colors.textTertiary,
          marginTop: 2,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  const haptics = useHaptics();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
      }}
      screenListeners={{
        tabPress: () => haptics.selection(),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={Map} focused={focused} label="Map" />
          ),
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={Music} focused={focused} label="Shows" />
          ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={Users} focused={focused} label="Friends" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={User} focused={focused} label="Profile" />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'rgba(13, 13, 13, 0.95)',
    borderTopColor: colors.border,
    borderTopWidth: 0.5,
    height: Platform.OS === 'ios' ? 95 : 70,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 28 : 10,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
