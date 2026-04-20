import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence } from 'react-native-reanimated';
import { Reaction, ReactionType } from '../../api/types';
import { Text } from '../ui/Text';
import { colors, spacing, radii } from '../../theme';
import { reactionEmojis } from '../../utils/reactions';
import { useHaptics } from '../../hooks/useHaptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ReactionBarProps {
  reactions: Reaction[];
  onToggle: (type: ReactionType) => void;
}

function ReactionChip({ reaction, onToggle }: { reaction: Reaction; onToggle: () => void }) {
  const scale = useSharedValue(1);
  const haptics = useHaptics();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    haptics.medium();
    scale.value = withSequence(
      withSpring(1.3, { damping: 8, stiffness: 400 }),
      withSpring(1, { damping: 12, stiffness: 300 })
    );
    onToggle();
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[
        styles.chip,
        reaction.userReacted && styles.chipActive,
        animatedStyle,
      ]}
    >
      <Text style={styles.emoji}>{reactionEmojis[reaction.type]}</Text>
      <Text
        variant="micro"
        color={reaction.userReacted ? 'primary' : 'textSecondary'}
      >
        {reaction.count}
      </Text>
    </AnimatedPressable>
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
