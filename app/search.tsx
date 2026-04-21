import React, { useState } from 'react';
import { View, FlatList, StyleSheet, TextInput, Pressable, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, X, ArrowLeft } from 'lucide-react-native';
import { useUserStore } from '../src/store/useUserStore';
import { Text } from '../src/components/ui/Text';
import { Avatar } from '../src/components/ui/Avatar';
import { IconButton } from '../src/components/ui/IconButton';
import { colors, spacing, radii } from '../src/theme';
import { User } from '../src/api/types';

export default function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const searchUsers = useUserStore((s) => s.searchUsers);
  const [query, setQuery] = useState('');

  const results = searchUsers(query);

  const selectUser = (user: User) => {
    Keyboard.dismiss();
    router.replace(`/user/${user.id}`);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.md }]}>
      <View style={styles.searchHeader}>
        <IconButton
          icon={<ArrowLeft size={20} color={colors.textPrimary} />}
          onPress={() => router.back()}
          size={36}
        />
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
      </View>

      {query.length === 0 ? (
        <View style={styles.hint}>
          <Search size={40} color={colors.textTertiary} />
          <Text variant="callout" color="textTertiary" style={{ marginTop: spacing.md }}>
            Search for people by name or username
          </Text>
        </View>
      ) : results.length === 0 ? (
        <View style={styles.hint}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.sm,
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
  hint: {
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
