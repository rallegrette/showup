import React, { useRef } from 'react';
import { Pressable, StyleSheet, ViewStyle, Animated } from 'react-native';
import { colors, spacing, radii } from '../../theme';
import { Text } from './Text';
import { useHaptics } from '../../hooks/useHaptics';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  icon,
}: ButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const haptics = useHaptics();

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  };

  const handlePress = () => {
    haptics.light();
    onPress();
  };

  const variantStyles = getVariantStyles(variant);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[
          styles.base,
          variantStyles.container,
          disabled && styles.disabled,
          style,
        ]}
      >
        {icon}
        <Text
          variant="calloutMedium"
          color={variantStyles.textColor}
          style={icon ? { marginLeft: spacing.sm } : undefined}
        >
          {title}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

function getVariantStyles(variant: ButtonVariant) {
  switch (variant) {
    case 'primary':
      return { container: styles.primary, textColor: 'white' as const };
    case 'secondary':
      return { container: styles.secondary, textColor: 'primary' as const };
    case 'ghost':
      return { container: styles.ghost, textColor: 'textPrimary' as const };
    case 'outline':
      return { container: styles.outline, textColor: 'textPrimary' as const };
  }
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.lg,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.primaryMuted,
  },
  ghost: {
    backgroundColor: colors.transparent,
  },
  outline: {
    backgroundColor: colors.transparent,
    borderWidth: 1,
    borderColor: colors.border,
  },
  disabled: {
    opacity: 0.5,
  },
});
