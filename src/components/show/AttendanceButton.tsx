import React, { useRef } from 'react';
import { View, Pressable, StyleSheet, Animated } from 'react-native';
import { Check, Star } from 'lucide-react-native';
import { AttendanceStatus } from '../../api/types';
import { Text } from '../ui/Text';
import { colors, spacing, radii } from '../../theme';
import { useHaptics } from '../../hooks/useHaptics';

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
  const goingScale = useRef(new Animated.Value(1)).current;
  const interestedScale = useRef(new Animated.Value(1)).current;
  const haptics = useHaptics();

  const animatePress = (anim: Animated.Value) => {
    Animated.sequence([
      Animated.spring(anim, { toValue: 0.95, useNativeDriver: true, speed: 50, bounciness: 4 }),
      Animated.spring(anim, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 4 }),
    ]).start();
  };

  const handleGoingPress = () => {
    haptics.success();
    animatePress(goingScale);
    onPress('going');
  };

  const handleInterestedPress = () => {
    haptics.light();
    animatePress(interestedScale);
    onPress('interested');
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.flex, { transform: [{ scale: goingScale }] }]}>
        <Pressable
          onPress={handleGoingPress}
          style={[
            styles.button,
            status === 'going' ? styles.goingActive : styles.goingInactive,
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
        </Pressable>
      </Animated.View>

      <Animated.View style={[styles.flex, { transform: [{ scale: interestedScale }] }]}>
        <Pressable
          onPress={handleInterestedPress}
          style={[
            styles.button,
            status === 'interested' ? styles.interestedActive : styles.interestedInactive,
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
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  flex: {
    flex: 1,
  },
  button: {
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
