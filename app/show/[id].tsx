import React from 'react';
import { View, ScrollView, StyleSheet, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, MapPin, Clock, DoorOpen, ExternalLink } from 'lucide-react-native';
import { useShowStore } from '../../src/store/useShowStore';
import { Text } from '../../src/components/ui/Text';
import { Button } from '../../src/components/ui/Button';
import { Avatar } from '../../src/components/ui/Avatar';
import { Badge } from '../../src/components/ui/Badge';
import { IconButton } from '../../src/components/ui/IconButton';
import { ReactionBar } from '../../src/components/show/ReactionBar';
import { AttendanceButton } from '../../src/components/show/AttendanceButton';
import { LineupList } from '../../src/components/show/LineupList';
import { colors, spacing, radii } from '../../src/theme';
import { formatShowDate } from '../../src/utils/formatDate';

export default function ShowDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const show = useShowStore((s) => s.getShow(id));
  const toggleReaction = useShowStore((s) => s.toggleReaction);
  const setAttendance = useShowStore((s) => s.setAttendance);

  if (!show) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text variant="title3" color="textSecondary">Show not found</Text>
      </View>
    );
  }

  const allFriends = [...show.friendsGoing, ...show.friendsInterested];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: show.imageUrl }}
            style={styles.heroImage}
            contentFit="cover"
            transition={300}
          />
          <View style={styles.heroGradient} />

          <View style={[styles.heroOverlay, { paddingTop: insets.top + spacing.sm }]}>
            <IconButton
              icon={<ArrowLeft size={20} color={colors.textPrimary} />}
              onPress={() => router.back()}
            />
          </View>

          <View style={styles.heroContent}>
            <Badge label={show.genre} variant="genre" />
            <Text variant="largeTitle" style={styles.heroTitle}>
              {show.title}
            </Text>
            <View style={styles.heroMeta}>
              <Text variant="callout" color="primary">
                {formatShowDate(show.date)}
              </Text>
              <Text variant="callout" color="textTertiary"> · </Text>
              <Text variant="callout" color="textSecondary">
                {show.venue.name}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          {!show.isPast && (
            <AttendanceButton
              status={show.attendanceStatus}
              onPress={(status) => setAttendance(show.id, status)}
              goingCount={show.totalGoing}
              interestedCount={show.totalInterested}
            />
          )}

          <View style={styles.section}>
            <Text variant="calloutMedium" color="textSecondary" style={styles.sectionLabel}>
              DETAILS
            </Text>
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <MapPin size={16} color={colors.primary} />
              </View>
              <View>
                <Text variant="body">{show.venue.name}</Text>
                <Text variant="caption" color="textSecondary">{show.venue.address}, {show.venue.city}</Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <DoorOpen size={16} color={colors.primary} />
              </View>
              <View>
                <Text variant="body">Doors at {show.doorsOpen}</Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Clock size={16} color={colors.primary} />
              </View>
              <View>
                <Text variant="body">
                  {show.startTime}{show.endTime ? ` – ${show.endTime}` : ''}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <LineupList artists={show.artists} />
          </View>

          <View style={styles.section}>
            <Text variant="calloutMedium" color="textSecondary" style={styles.sectionLabel}>
              REACTIONS
            </Text>
            <ReactionBar
              reactions={show.reactions}
              onToggle={(type) => toggleReaction(show.id, type)}
            />
          </View>

          {allFriends.length > 0 && (
            <View style={styles.section}>
              <Text variant="calloutMedium" color="textSecondary" style={styles.sectionLabel}>
                FRIENDS
              </Text>
              {show.friendsGoing.length > 0 && (
                <View style={styles.friendGroup}>
                  <Text variant="caption" color="success" style={{ marginBottom: spacing.sm }}>
                    Going
                  </Text>
                  <View style={styles.friendsRow}>
                    {show.friendsGoing.map((friend) => (
                      <View key={friend.id} style={styles.friendItem}>
                        <Avatar uri={friend.avatarUrl} size="md" showOnline isOnline={friend.isOnline} />
                        <Text variant="micro" color="textSecondary" style={{ marginTop: 4 }}>
                          {friend.name.split(' ')[0]}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
              {show.friendsInterested.length > 0 && (
                <View style={styles.friendGroup}>
                  <Text variant="caption" color="gold" style={{ marginBottom: spacing.sm }}>
                    Interested
                  </Text>
                  <View style={styles.friendsRow}>
                    {show.friendsInterested.map((friend) => (
                      <View key={friend.id} style={styles.friendItem}>
                        <Avatar uri={friend.avatarUrl} size="md" showOnline isOnline={friend.isOnline} />
                        <Text variant="micro" color="textSecondary" style={{ marginTop: 4 }}>
                          {friend.name.split(' ')[0]}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}

          {!show.isPast && (
            <Button
              title="Get Tickets"
              variant="primary"
              onPress={() => Linking.openURL(show.ticketUrl)}
              icon={<ExternalLink size={16} color={colors.white} />}
              style={styles.ticketButton}
            />
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
  heroContainer: {
    height: 340,
    position: 'relative',
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(13, 13, 13, 0.5)',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    paddingBottom: spacing['2xl'],
    backgroundColor: 'rgba(13, 13, 13, 0.7)',
  },
  heroTitle: {
    marginTop: spacing.sm,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  body: {
    padding: spacing.lg,
    gap: spacing['2xl'],
  },
  section: {
    gap: spacing.sm,
  },
  sectionLabel: {
    letterSpacing: 1.2,
    marginBottom: spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  friendGroup: {
    marginBottom: spacing.md,
  },
  friendsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
  },
  friendItem: {
    alignItems: 'center',
    width: 56,
  },
  ticketButton: {
    marginTop: spacing.md,
    marginBottom: spacing['4xl'],
  },
});
