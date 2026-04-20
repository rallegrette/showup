import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { colors, typography, TypographyVariant } from '../../theme';
import { ColorKey } from '../../theme/colors';

interface TextProps extends RNTextProps {
  variant?: TypographyVariant;
  color?: ColorKey;
}

export function Text({
  variant = 'body',
  color = 'textPrimary',
  style,
  ...props
}: TextProps) {
  return (
    <RNText
      style={[
        styles.base,
        typography[variant],
        { color: colors[color] },
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    color: colors.textPrimary,
  },
});
