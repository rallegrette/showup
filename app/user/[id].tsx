import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useUserStore } from '../../src/store/useUserStore';
import { useShowStore } from '../../src/store/useShowStore';
import { ProfileHeader } from '../../src/components/profile/ProfileHeader';
import { ShowHistoryCard } from '../../src/components/profile/ShowHistoryCard';
import { Text } from '../../src/components/ui/Text';
import { IconButton } from '../../src/components/ui/IconButton';
import { Badge } from '../../src/components/ui/Badge';
import { colors, spacing } from '../../src/theme';
import { reactionEmojis } from '../../src/utils/reactions';

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const getUserProfile = useUserStore((s) => s.getUserProfile);
  const pastShows = useShowStore((s) => s.pastShows);

  const profile = getUserProfile(id);

  if (!profile) {
    return (
      <View style={[styles.container, styles.center, { paddingTop: insets.top }]}>
        <Text variant="title3" color="textSecondary">User not found</Text>
      </View>
    );
  }

  const userShows = pastShows.slice(0, Math.min(pastShows.length, 2 + Math.floor(Math.random() * 2)));

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerBar}>
        <IconButton
          icon={<ArrowLeft size={20} color={colors.textPrimary} />}
          onPress={() => router.back()}
          size={36}
        />
        <Text variant="callout" color="textSecondary">@{profile.username}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <ProfileHeader user={profile} />

        {profile.topReactions.length > 0 && (
          <View style={styles.section}>
            <Text variant="calloutMedium" color="textSecondary" style={styles.sectionLabel}>
              TOP REACTIONS
            </Text>
            <View style={styles.reactionsRow}>
              {profile.topReactions.map((type) => (
                <View key={type} style={styles.topReaction}>
                  <Text style={{ fontSize: 28 }}>{reactionEmojis[type]}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="calloutMedium" color="textSecondary" style={styles.sectionLabel}>
              SHOW HISTORY
            </Text>
            <Badge label={`${profile.showsAttended} shows`} />
          </View>
          {userShows.map((show) => (
            <ShowHistoryCard key={show.id} show={show} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing['2xl'],
  },
  sectionLabel: {
    letterSpacing: 1.2,
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reactionsRow: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  topReaction: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
