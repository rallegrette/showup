import React, { useMemo, useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShowStore } from '../../src/store/useShowStore';
import { FeedSection } from '../../src/components/feed/FeedSection';
import { Text } from '../../src/components/ui/Text';
import { colors, spacing, radii } from '../../src/theme';
import { getDateGroup } from '../../src/utils/formatDate';
import { Show } from '../../src/api/types';

const GENRES = ['All', 'Rock', 'Electronic', 'Hip Hop', 'R&B', 'Jazz', 'Funk', 'Indie'];

export default function FeedScreen() {
  const shows = useShowStore((s) => s.shows);
  const loading = useShowStore((s) => s.loading);
  const fetchShows = useShowStore((s) => s.fetchShows);
  const insets = useSafeAreaInsets();
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const filteredShows = useMemo(() => {
    if (selectedGenre === 'All') return shows;
    return shows.filter((s) =>
      s.genre.toLowerCase().includes(selectedGenre.toLowerCase())
    );
  }, [shows, selectedGenre]);

  const groupedShows = useMemo(() => {
    const groups: Record<string, Show[]> = {};
    const order = ['Tonight', 'Tomorrow', 'This Week', 'Next Week', 'Coming Up'];

    filteredShows.forEach((show) => {
      const group = getDateGroup(show.date);
      if (!groups[group]) groups[group] = [];
      groups[group].push(show);
    });

    return order
      .filter((key) => groups[key]?.length > 0)
      .map((key) => ({ title: key, shows: groups[key] }));
  }, [filteredShows]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchShows();
    setRefreshing(false);
  }, [fetchShows]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text variant="largeTitle">Shows</Text>
        <Text variant="callout" color="textSecondary">Upcoming near you</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {GENRES.map((genre) => (
          <Pressable
            key={genre}
            onPress={() => setSelectedGenre(genre)}
            style={[
              styles.filterChip,
              selectedGenre === genre && styles.filterChipActive,
            ]}
          >
            <Text
              variant="captionMedium"
              color={selectedGenre === genre ? 'white' : 'textSecondary'}
            >
              {genre}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.feedContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {groupedShows.length === 0 ? (
          <View style={styles.empty}>
            <Text variant="title3" color="textSecondary">No shows found</Text>
            <Text variant="callout" color="textTertiary" style={{ marginTop: spacing.sm }}>
              {selectedGenre !== 'All'
                ? 'Try a different genre'
                : 'Check back soon for upcoming shows'}
            </Text>
          </View>
        ) : (
          groupedShows.map((group) => (
            <FeedSection key={group.title} title={group.title} shows={group.shows} />
          ))
        )}
      </ScrollView>
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
    paddingBottom: spacing.sm,
  },
  filterScroll: {
    flexGrow: 0,
    marginBottom: spacing.md,
  },
  filterContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    alignItems: 'center',
  },
  filterChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  feedContent: {
    paddingBottom: 120,
    paddingTop: spacing.sm,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing['6xl'],
  },
});
