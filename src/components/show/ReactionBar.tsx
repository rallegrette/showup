import React, { useRef } from 'react';
import { View, Pressable, StyleSheet, Animated } from 'react-native';
import { Reaction, ReactionType } from '../../api/types';
import { Text } from '../ui/Text';
import { colors, spacing, radii } from '../../theme';
import { reactionEmojis } from '../../utils/reactions';
import { useHaptics } from '../../hooks/useHaptics';

interface ReactionBarProps {
  reactions: Reaction[];
  onToggle: (type: ReactionType) => void;
}

function ReactionChip({ reaction, onToggle }: { reaction: Reaction; onToggle: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;
  const haptics = useHaptics();

  const handlePress = () => {
    haptics.medium();
    Animated.sequence([
      Animated.spring(scale, { toValue: 1.3, useNativeDriver: true, speed: 80, bounciness: 12 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 60, bounciness: 8 }),
    ]).start();
    onToggle();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={handlePress}
        style={[
          styles.chip,
          reaction.userReacted && styles.chipActive,
        ]}
      >
        <Text style={styles.emoji}>{reactionEmojis[reaction.type]}</Text>
        <Text
          variant="micro"
          color={reaction.userReacted ? 'primary' : 'textSecondary'}
        >
          {reaction.count}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export function ReactionBar({ reactions, onToggle }: ReactionBarProps) {
  return (
    <View style={styles.container}>
      {reactions.map((reaction) => (
        <ReactionChip
          key={reaction.type}
          reaction={reaction}
          onToggle={() => onToggle(reaction.type)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primaryMuted,
    borderColor: colors.primary,
  },
  emoji: {
    fontSize: 16,
  },
});
