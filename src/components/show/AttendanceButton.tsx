import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Check, Star } from 'lucide-react-native';
import { AttendanceStatus } from '../../api/types';
import { Text } from '../ui/Text';
import { colors, spacing, radii } from '../../theme';
import { useHaptics } from '../../hooks/useHaptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface AttendanceButtonProps {
  status: AttendanceStatus;
  onPress: (status: AttendanceStatus) => void;
  goingCount: number;
  interestedCount: number;
}

export function AttendanceButton({
  status,
  onPress,
  goingCount,
  interestedCount,
}: AttendanceButtonProps) {
  const goingScale = useSharedValue(1);
  const interestedScale = useSharedValue(1);
  const haptics = useHaptics();

  const goingAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: goingScale.value }],
  }));

  const interestedAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interestedScale.value }],
  }));

  const handleGoingPress = () => {
    haptics.success();
    goingScale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
    setTimeout(() => {
      goingScale.value = withSpring(1, { damping: 15, stiffness: 300 });
    }, 100);
    onPress('going');
  };

  const handleInterestedPress = () => {
    haptics.light();
    interestedScale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
    setTimeout(() => {
      interestedScale.value = withSpring(1, { damping: 15, stiffness: 300 });
    }, 100);
    onPress('interested');
  };

  return (
    <View style={styles.container}>
      <AnimatedPressable
        onPress={handleGoingPress}
        style={[
          styles.button,
          status === 'going' ? styles.goingActive : styles.goingInactive,
          goingAnimatedStyle,
        ]}
      >
        <Check size={18} color={status === 'going' ? colors.white : colors.success} strokeWidth={2.5} />
        <View style={styles.buttonText}>
          <Text
            variant="calloutMedium"
            style={{ color: status === 'going' ? colors.white : colors.success }}
          >
            Going
          </Text>
          <Text variant="micro" style={{ color: status === 'going' ? 'rgba(255,255,255,0.7)' : colors.textTertiary }}>
            {goingCount}
          </Text>
        </View>
      </AnimatedPressable>

      <AnimatedPressable
        onPress={handleInterestedPress}
        style={[
          styles.button,
          status === 'interested' ? styles.interestedActive : styles.interestedInactive,
          interestedAnimatedStyle,
        ]}
      >
        <Star
          size={18}
          color={status === 'interested' ? colors.white : colors.gold}
          fill={status === 'interested' ? colors.white : 'transparent'}
          strokeWidth={2.5}
        />
        <View style={styles.buttonText}>
          <Text
            variant="calloutMedium"
            style={{ color: status === 'interested' ? colors.white : colors.gold }}
          >
            Interested
          </Text>
          <Text variant="micro" style={{ color: status === 'interested' ? 'rgba(255,255,255,0.7)' : colors.textTertiary }}>
            {interestedCount}
          </Text>
        </View>
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
  },
  buttonText: {
    alignItems: 'center',
  },
  goingActive: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  goingInactive: {
    backgroundColor: colors.successMuted,
    borderColor: 'rgba(74, 222, 128, 0.3)',
  },
  interestedActive: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  interestedInactive: {
    backgroundColor: colors.goldMuted,
    borderColor: 'rgba(232, 197, 71, 0.3)',
  },
});
