import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Switch, Pressable, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft, Bell, MapPin, Eye, Moon, Shield,
  HelpCircle, MessageSquare, ChevronRight, LogOut,
} from 'lucide-react-native';
import { Text } from '../src/components/ui/Text';
import { IconButton } from '../src/components/ui/IconButton';
import { Avatar } from '../src/components/ui/Avatar';
import { useUserStore } from '../src/store/useUserStore';
import { colors, spacing, radii } from '../src/theme';

type SettingRowProps = {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  trailing?: React.ReactNode;
  onPress?: () => void;
};

function SettingRow({ icon, label, subtitle, trailing, onPress }: SettingRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.settingRow, pressed && onPress && styles.settingRowPressed]}
      disabled={!onPress && !trailing}
    >
      <View style={styles.settingIcon}>{icon}</View>
      <View style={styles.settingContent}>
        <Text variant="body">{label}</Text>
        {subtitle && (
          <Text variant="caption" color="textTertiary">{subtitle}</Text>
        )}
      </View>
      {trailing ?? (onPress && <ChevronRight size={18} color={colors.textTertiary} />)}
    </Pressable>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <Text variant="calloutMedium" color="textSecondary" style={styles.sectionHeader}>
      {title}
    </Text>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const currentUser = useUserStore((s) => s.currentUser);

  const [notifications, setNotifications] = useState(true);
  const [friendActivity, setFriendActivity] = useState(true);
  const [showReminders, setShowReminders] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [privateProfile, setPrivateProfile] = useState(false);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerBar}>
        <IconButton
          icon={<ArrowLeft size={20} color={colors.textPrimary} />}
          onPress={() => router.back()}
          size={36}
        />
        <Text variant="title3">Settings</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {currentUser && (
          <Pressable style={styles.profileCard} onPress={() => router.back()}>
            <Avatar uri={currentUser.avatarUrl} size="lg" showOnline isOnline={currentUser.isOnline} />
            <View style={styles.profileInfo}>
              <Text variant="title3">{currentUser.name}</Text>
              <Text variant="caption" color="textSecondary">@{currentUser.username}</Text>
              <Text variant="caption" color="primary" style={{ marginTop: 4 }}>Edit Profile</Text>
            </View>
            <ChevronRight size={18} color={colors.textTertiary} />
          </Pressable>
        )}

        <SectionHeader title="NOTIFICATIONS" />
        <View style={styles.sectionCard}>
          <SettingRow
            icon={<Bell size={20} color={colors.primary} />}
            label="Push Notifications"
            subtitle="Show alerts and updates"
            trailing={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: colors.surfaceElevated, true: colors.primary }}
                thumbColor={colors.white}
              />
            }
          />
          <View style={styles.separator} />
          <SettingRow
            icon={<MessageSquare size={20} color={colors.accent} />}
            label="Friend Activity"
            subtitle="When friends react or RSVP"
            trailing={
              <Switch
                value={friendActivity}
                onValueChange={setFriendActivity}
                trackColor={{ false: colors.surfaceElevated, true: colors.primary }}
                thumbColor={colors.white}
              />
            }
          />
          <View style={styles.separator} />
          <SettingRow
            icon={<Bell size={20} color={colors.gold} />}
            label="Show Reminders"
            subtitle="Doors open, show starting soon"
            trailing={
              <Switch
                value={showReminders}
                onValueChange={setShowReminders}
                trackColor={{ false: colors.surfaceElevated, true: colors.primary }}
                thumbColor={colors.white}
              />
            }
          />
        </View>

        <SectionHeader title="LOCATION" />
        <View style={styles.sectionCard}>
          <SettingRow
            icon={<MapPin size={20} color={colors.success} />}
            label="Location Services"
            subtitle="Find shows and venues near you"
            trailing={
              <Switch
                value={locationEnabled}
                onValueChange={setLocationEnabled}
                trackColor={{ false: colors.surfaceElevated, true: colors.primary }}
                thumbColor={colors.white}
              />
            }
          />
        </View>

        <SectionHeader title="PRIVACY" />
        <View style={styles.sectionCard}>
          <SettingRow
            icon={<Eye size={20} color={colors.textSecondary} />}
            label="Private Profile"
            subtitle="Only friends can see your activity"
            trailing={
              <Switch
                value={privateProfile}
                onValueChange={setPrivateProfile}
                trackColor={{ false: colors.surfaceElevated, true: colors.primary }}
                thumbColor={colors.white}
              />
            }
          />
          <View style={styles.separator} />
          <SettingRow
            icon={<Shield size={20} color={colors.textSecondary} />}
            label="Blocked Users"
            onPress={() => {}}
          />
        </View>

        <SectionHeader title="APP" />
        <View style={styles.sectionCard}>
          <SettingRow
            icon={<Moon size={20} color={colors.textSecondary} />}
            label="Appearance"
            subtitle="Dark mode (always on)"
          />
          <View style={styles.separator} />
          <SettingRow
            icon={<HelpCircle size={20} color={colors.textSecondary} />}
            label="Help & Support"
            onPress={() => Linking.openURL('mailto:support@showup.app')}
          />
        </View>

        <Pressable style={styles.logoutButton} onPress={() => {}}>
          <LogOut size={18} color={colors.accent} />
          <Text variant="bodyMedium" color="accent" style={{ marginLeft: spacing.sm }}>
            Log Out
          </Text>
        </Pressable>

        <Text variant="micro" color="textTertiary" style={styles.version}>
          ShowUp v1.0.0
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  profileInfo: {
    flex: 1,
  },
  sectionHeader: {
    letterSpacing: 1.2,
    marginTop: spacing['2xl'],
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  sectionCard: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  settingRowPressed: {
    backgroundColor: colors.surfaceElevated,
  },
  settingIcon: {
    width: 32,
    alignItems: 'center',
  },
  settingContent: {
    flex: 1,
    gap: 2,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginLeft: 60,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.lg,
    marginTop: spacing['3xl'],
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  version: {
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
