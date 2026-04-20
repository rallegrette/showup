import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Music } from 'lucide-react-native';
import { Artist } from '../../api/types';
import { Text } from '../ui/Text';
import { Badge } from '../ui/Badge';
import { colors, spacing } from '../../theme';

interface LineupListProps {
  artists: Artist[];
}

export function LineupList({ artists }: LineupListProps) {
  return (
    <View style={styles.container}>
      <Text variant="calloutMedium" color="textSecondary" style={styles.label}>
        LINEUP
      </Text>
      {artists.map((artist, index) => (
        <View key={artist.id} style={styles.artistRow}>
          <View style={styles.iconContainer}>
            <Music size={16} color={colors.primary} />
          </View>
          <View style={styles.artistInfo}>
            <Text variant="bodyMedium">{artist.name}</Text>
            <Badge label={artist.genre} variant="genre" style={{ marginTop: 2 }} />
          </View>
          {index === 0 && (
            <Text variant="micro" color="primary">HEADLINER</Text>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  label: {
    letterSpacing: 1.2,
    marginBottom: spacing.xs,
  },
  artistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  artistInfo: {
    flex: 1,
  },
});
