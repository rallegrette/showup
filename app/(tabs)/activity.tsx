import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useActivityStore } from '../../src/store/useActivityStore';
import { ActivityItem } from '../../src/components/feed/ActivityItem';
import { Text } from '../../src/components/ui/Text';
import { IconButton } from '../../src/components/ui/IconButton';
import { colors, spacing } from '../../src/theme';
import { Activity } from '../../src/api/types';

export default function ActivityScreen() {
  const activities = useActivityStore((s) => s.activities);
  const fetchActivities = useActivityStore((s) => s.fetchActivities);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchActivities();
    setRefreshing(false);
  }, [fetchActivities]);

  const renderItem = useCallback(({ item }: { item: Activity }) => (
    <ActivityItem activity={item} />
  ), []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text variant="largeTitle">Friends</Text>
          <IconButton
            icon={<Search size={20} color={colors.textSecondary} />}
            onPress={() => router.push('/search')}
            size={40}
          />
        </View>
        <Text variant="callout" color="textSecondary">See what your friends are up to</Text>
      </View>

      <FlatList
        data={activities}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text variant="title3" color="textSecondary">No activity yet</Text>
            <Text variant="callout" color="textTertiary" style={{ marginTop: spacing.sm }}>
              When your friends react to shows, you'll see it here
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 120,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing['6xl'],
  },
});
