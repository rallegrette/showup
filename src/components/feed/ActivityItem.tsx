import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Activity } from '../../api/types';
import { Text } from '../ui/Text';
import { Avatar } from '../ui/Avatar';
import { colors, spacing, radii } from '../../theme';
import { reactionEmojis } from '../../utils/reactions';
import { formatRelativeTime } from '../../utils/formatDate';

interface ActivityItemProps {
  activity: Activity;
}

export function ActivityItem({ activity }: ActivityItemProps) {
  const router = useRouter();

  const getActionText = () => {
    switch (activity.type) {
      case 'going':
        return 'is going to';
      case 'interested':
        return 'is interested in';
      case 'reacted':
        return `reacted ${activity.reactionType ? reactionEmojis[activity.reactionType] : ''} to`;
    }
  };

  return (
    <Pressable
      onPress={() => router.push(`/show/${activity.show.id}`)}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <Pressable onPress={() => router.push(`/user/${activity.user.id}`)}>
        <Avatar
          uri={activity.user.avatarUrl}
          size="md"
          showOnline
          isOnline={activity.user.isOnline}
        />
      </Pressable>
      <View style={styles.content}>
        <Text variant="callout" numberOfLines={2}>
          <Text variant="calloutMedium">{activity.user.name}</Text>
          {' '}{getActionText()}{' '}
          <Text variant="calloutMedium" color="primary">{activity.show.title}</Text>
          {' '}at {activity.show.venue.name}
        </Text>
        <Text variant="caption" color="textTertiary" style={{ marginTop: 2 }}>
          {formatRelativeTime(activity.timestamp)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.lg,
    gap: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  pressed: {
    backgroundColor: colors.surfaceElevated,
  },
  content: {
    flex: 1,
  },
});
