import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { colors } from '../src/theme';
import { useShowStore } from '../src/store/useShowStore';
import { useUserStore } from '../src/store/useUserStore';
import { useActivityStore } from '../src/store/useActivityStore';

export default function RootLayout() {
  const fetchShows = useShowStore((s) => s.fetchShows);
  const fetchPastShows = useShowStore((s) => s.fetchPastShows);
  const fetchCurrentUser = useUserStore((s) => s.fetchCurrentUser);
  const fetchActivities = useActivityStore((s) => s.fetchActivities);

  useEffect(() => {
    fetchShows();
    fetchPastShows();
    fetchCurrentUser();
    fetchActivities();
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="show/[id]"
          options={{
            presentation: 'card',
            animation: 'slide_from_bottom',
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
