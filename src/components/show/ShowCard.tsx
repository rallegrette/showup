import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { MapPin, Clock } from 'lucide-react-native';
import { Show } from '../../api/types';
import { Card } from '../ui/Card';
import { Text } from '../ui/Text';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { colors, spacing, radii } from '../../theme';
import { formatShowDate, formatShowTime } from '../../utils/formatDate';

interface ShowCardProps {
  show: Show;
}

export function ShowCard({ show }: ShowCardProps) {
  const router = useRouter();

  return (
    <Card
      onPress={() => router.push(`/show/${show.id}`)}
      style={styles.card}
    >
      <Image
        source={{ uri: show.imageUrl }}
        style={styles.image}
        contentFit="cover"
        transition={300}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text variant="title3" numberOfLines={1}>
              {show.title}
            </Text>
            <View style={styles.metaRow}>
              <MapPin size={13} color={colors.textSecondary} />
              <Text variant="caption" color="textSecondary" style={styles.metaText}>
                {show.venue.name}
              </Text>
            </View>
          </View>
          <Badge label={formatShowDate(show.date)} variant="genre" />
        </View>

        <View style={styles.metaRow}>
          <Clock size={13} color={colors.textSecondary} />
          <Text variant="caption" color="textSecondary" style={styles.metaText}>
            {formatShowTime(show.startTime)}
          </Text>
          <Text variant="caption" color="textTertiary"> · </Text>
          <Text variant="caption" color="textSecondary">
            {show.price}
          </Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.friendsRow}>
            {show.friendsGoing.slice(0, 3).map((friend, i) => (
              <View key={friend.id} style={[styles.friendAvatar, { marginLeft: i > 0 ? -8 : 0 }]}>
                <Avatar uri={friend.avatarUrl} size="sm" />
              </View>
            ))}
            {show.friendsGoing.length > 0 && (
              <Text variant="caption" color="textSecondary" style={{ marginLeft: spacing.xs }}>
                {show.friendsGoing.length} friend{show.friendsGoing.length !== 1 ? 's' : ''} going
              </Text>
            )}
          </View>

          {show.attendanceStatus && (
            <Badge
              label={show.attendanceStatus === 'going' ? 'Going' : 'Interested'}
              variant={show.attendanceStatus === 'going' ? 'going' : 'interested'}
            />
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
  },
  image: {
    width: '100%',
    height: 160,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
    marginRight: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  metaText: {
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  friendsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  friendAvatar: {
    borderWidth: 2,
    borderColor: colors.surface,
    borderRadius: 14,
  },
});
