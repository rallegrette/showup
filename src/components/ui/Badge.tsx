import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, radii } from '../../theme';
import { Text } from './Text';

type BadgeVariant = 'going' | 'interested' | 'soldout' | 'genre' | 'default';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

export function Badge({ label, variant = 'default', style }: BadgeProps) {
  const variantStyle = getVariantStyle(variant);

  return (
    <View style={[styles.badge, variantStyle.container, style]}>
      <Text variant="micro" color={variantStyle.textColor}>
        {label}
      </Text>
    </View>
  );
}

function getVariantStyle(variant: BadgeVariant) {
  switch (variant) {
    case 'going':
      return { container: styles.going, textColor: 'success' as const };
    case 'interested':
      return { container: styles.interested, textColor: 'gold' as const };
    case 'soldout':
      return { container: styles.soldout, textColor: 'accent' as const };
    case 'genre':
      return { container: styles.genre, textColor: 'primary' as const };
    default:
      return { container: styles.default, textColor: 'textSecondary' as const };
  }
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
    alignSelf: 'flex-start',
  },
  going: {
    backgroundColor: colors.successMuted,
  },
  interested: {
    backgroundColor: colors.goldMuted,
  },
  soldout: {
    backgroundColor: colors.accentMuted,
  },
  genre: {
    backgroundColor: colors.primaryMuted,
  },
  default: {
    backgroundColor: colors.surfaceElevated,
  },
});
