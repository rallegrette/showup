import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { MapPin, Calendar } from 'lucide-react-native';
import { Show } from '../../api/types';
import { Card } from '../ui/Card';
import { Text } from '../ui/Text';
import { colors, spacing } from '../../theme';
import { formatShowDate } from '../../utils/formatDate';
import { reactionEmojis } from '../../utils/reactions';

interface ShowHistoryCardProps {
  show: Show;
}

export function ShowHistoryCard({ show }: ShowHistoryCardProps) {
  const userReactions = show.reactions.filter((r) => r.userReacted);

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <Image
          source={{ uri: show.imageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.info}>
          <Text variant="bodyMedium" numberOfLines={1}>{show.title}</Text>
          <View style={styles.metaRow}>
            <MapPin size={12} color={colors.textTertiary} />
            <Text variant="caption" color="textSecondary" style={{ marginLeft: 3 }}>
              {show.venue.name}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Calendar size={12} color={colors.textTertiary} />
            <Text variant="caption" color="textTertiary" style={{ marginLeft: 3 }}>
              {formatShowDate(show.date)}
            </Text>
          </View>
          {userReactions.length > 0 && (
            <Text variant="caption" style={{ marginTop: 4 }}>
              {userReactions.map((r) => reactionEmojis[r.type]).join(' ')}
            </Text>
          )}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 10,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
    gap: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
