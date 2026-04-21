import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, Modal, TextInput, Pressable, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useActivityStore } from '../../src/store/useActivityStore';
import { useUserStore } from '../../src/store/useUserStore';
import { ActivityItem } from '../../src/components/feed/ActivityItem';
import { Text } from '../../src/components/ui/Text';
import { Avatar } from '../../src/components/ui/Avatar';
import { IconButton } from '../../src/components/ui/IconButton';
import { colors, spacing, radii } from '../../src/theme';
import { Activity, User } from '../../src/api/types';

export default function ActivityScreen() {
  const activities = useActivityStore((s) => s.activities);
  const fetchActivities = useActivityStore((s) => s.fetchActivities);
  const searchUsers = useUserStore((s) => s.searchUsers);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [refreshing, setRefreshing] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [query, setQuery] = useState('');

  const results = searchUsers(query);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchActivities();
    setRefreshing(false);
  }, [fetchActivities]);

  const renderItem = useCallback(({ item }: { item: Activity }) => (
    <ActivityItem activity={item} />
  ), []);

  const openSearch = () => {
    setQuery('');
    setSearchVisible(true);
  };

  const closeSearch = () => {
    Keyboard.dismiss();
    setSearchVisible(false);
    setQuery('');
  };

  const selectUser = (user: User) => {
    closeSearch();
    router.push(`/user/${user.id}`);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text variant="largeTitle">Friends</Text>
          <IconButton
            icon={<Search size={20} color={colors.textSecondary} />}
            onPress={openSearch}
            size={40}
          />
        </View>
        <Text variant="callout" color="textSecondary">See what your friends are up to</Text>
      </View>

      <FlatList
        data={activities}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text variant="title3" color="textSecondary">No activity yet</Text>
            <Text variant="callout" color="textTertiary" style={{ marginTop: spacing.sm }}>
              When your friends react to shows, you'll see it here
            </Text>
          </View>
        }
      />

      <Modal
        visible={searchVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeSearch}
      >
        <View style={[styles.modalContainer, { paddingTop: insets.top + spacing.md }]}>
          <View style={styles.searchHeader}>
            <View style={styles.searchInputWrapper}>
              <Search size={18} color={colors.textTertiary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by name or username..."
                placeholderTextColor={colors.textTertiary}
                value={query}
                onChangeText={setQuery}
                autoFocus
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="search"
              />
              {query.length > 0 && (
                <Pressable onPress={() => setQuery('')}>
                  <X size={18} color={colors.textTertiary} />
                </Pressable>
              )}
            </View>
            <Pressable onPress={closeSearch} style={styles.cancelButton}>
              <Text variant="callout" color="primary">Cancel</Text>
            </Pressable>
          </View>

          {query.length === 0 ? (
            <View style={styles.searchHint}>
              <Text variant="callout" color="textTertiary">
                Search for people by name or username
              </Text>
            </View>
          ) : results.length === 0 ? (
            <View style={styles.searchHint}>
              <Text variant="callout" color="textTertiary">
                No users found for "{query}"
              </Text>
            </View>
          ) : (
            <FlatList
              data={results}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => selectUser(item)}
                  style={({ pressed }) => [styles.resultRow, pressed && styles.resultRowPressed]}
                >
                  <Avatar uri={item.avatarUrl} size="md" showOnline isOnline={item.isOnline} />
                  <View style={styles.resultInfo}>
                    <Text variant="bodyMedium">{item.name}</Text>
                    <Text variant="caption" color="textSecondary">@{item.username}</Text>
                  </View>
                </Pressable>
              )}
            />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 120,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing['6xl'],
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 44,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 16,
    height: 44,
  },
  cancelButton: {
    paddingVertical: spacing.sm,
  },
  searchHint: {
    alignItems: 'center',
    paddingTop: spacing['6xl'],
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  resultRowPressed: {
    backgroundColor: colors.surfaceElevated,
  },
  resultInfo: {
    flex: 1,
    gap: 2,
  },
});
