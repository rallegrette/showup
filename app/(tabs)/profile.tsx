import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Settings } from 'lucide-react-native';
import { useUserStore } from '../../src/store/useUserStore';
import { useShowStore } from '../../src/store/useShowStore';
import { ProfileHeader } from '../../src/components/profile/ProfileHeader';
import { ShowHistoryCard } from '../../src/components/profile/ShowHistoryCard';
import { Text } from '../../src/components/ui/Text';
import { IconButton } from '../../src/components/ui/IconButton';
import { Badge } from '../../src/components/ui/Badge';
import { colors, spacing } from '../../src/theme';
import { reactionEmojis } from '../../src/utils/reactions';

export default function ProfileScreen() {
  const currentUser = useUserStore((s) => s.currentUser);
  const pastShows = useShowStore((s) => s.pastShows);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  if (!currentUser) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text variant="title3" color="textSecondary">Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerBar}>
        <Text variant="title3">Profile</Text>
        <IconButton
          icon={<Settings size={20} color={colors.textSecondary} />}
          onPress={() => router.push('/settings')}
          size={36}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <ProfileHeader user={currentUser} />

        {currentUser.topReactions.length > 0 && (
          <View style={styles.section}>
            <Text variant="calloutMedium" color="textSecondary" style={styles.sectionLabel}>
              TOP REACTIONS
            </Text>
            <View style={styles.reactionsRow}>
              {currentUser.topReactions.map((type) => (
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
            <Badge label={`${pastShows.length} shows`} />
          </View>
          {pastShows.map((show) => (
            <ShowHistoryCard key={show.id} show={show} />
          ))}
          {pastShows.length === 0 && (
            <View style={styles.empty}>
              <Text variant="callout" color="textTertiary">
                Shows you attend will appear here
              </Text>
            </View>
          )}
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
  empty: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
  },
});
