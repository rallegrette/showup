import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar, Heart, Users } from 'lucide-react-native';
import { UserProfile } from '../../api/types';
import { Text } from '../ui/Text';
import { Avatar } from '../ui/Avatar';
import { colors, spacing, radii } from '../../theme';

interface ProfileHeaderProps {
  user: UserProfile;
}

function StatItem({ icon: Icon, value, label }: { icon: typeof Calendar; value: number; label: string }) {
  return (
    <View style={styles.stat}>
      <Icon size={16} color={colors.primary} />
      <Text variant="title3" style={{ marginTop: 2 }}>{value}</Text>
      <Text variant="micro" color="textSecondary">{label}</Text>
    </View>
  );
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <View style={styles.container}>
      <Avatar uri={user.avatarUrl} size="xl" showOnline isOnline={user.isOnline} />
      <Text variant="title1" style={styles.name}>{user.name}</Text>
      <Text variant="callout" color="textSecondary">@{user.username}</Text>
      <Text variant="body" color="textSecondary" style={styles.bio}>{user.bio}</Text>

      <View style={styles.statsRow}>
        <StatItem icon={Calendar} value={user.showsAttended} label="Shows" />
        <View style={styles.divider} />
        <StatItem icon={Heart} value={user.totalReactions} label="Reactions" />
        <View style={styles.divider} />
        <StatItem icon={Users} value={user.friendCount} label="Friends" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
    paddingHorizontal: spacing.lg,
  },
  name: {
    marginTop: spacing.lg,
  },
  bio: {
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing['2xl'],
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing['2xl'],
    gap: spacing.xl,
  },
  stat: {
    alignItems: 'center',
    gap: 2,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
});
