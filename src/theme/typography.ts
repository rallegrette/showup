import { TextStyle } from 'react-native';

export const fontFamilies = {
  regular: 'System',
  medium: 'System',
  semibold: 'System',
  bold: 'System',
} as const;

export const fontWeights = {
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semibold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
};

export const typography = {
  largeTitle: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: fontWeights.bold,
    letterSpacing: -0.5,
  },
  title1: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: fontWeights.bold,
    letterSpacing: -0.3,
  },
  title2: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: fontWeights.semibold,
    letterSpacing: -0.2,
  },
  title3: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: fontWeights.semibold,
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: fontWeights.regular,
  },
  bodyMedium: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: fontWeights.medium,
  },
  callout: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: fontWeights.regular,
  },
  calloutMedium: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: fontWeights.medium,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: fontWeights.regular,
  },
  captionMedium: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: fontWeights.medium,
  },
  micro: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: fontWeights.medium,
  },
} as const;

export type TypographyVariant = keyof typeof typography;
