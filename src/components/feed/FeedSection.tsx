import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Show } from '../../api/types';
import { Text } from '../ui/Text';
import { ShowCard } from '../show/ShowCard';
import { spacing } from '../../theme';

interface FeedSectionProps {
  title: string;
  shows: Show[];
}

export function FeedSection({ title, shows }: FeedSectionProps) {
  if (shows.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text variant="title2" style={styles.title}>
        {title}
      </Text>
      {shows.map((show) => (
        <ShowCard key={show.id} show={show} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.xl,
  },
  title: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
});
