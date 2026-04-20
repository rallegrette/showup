export const colors = {
  background: '#0D0D0D',
  surface: '#1A1A1A',
  surfaceElevated: '#252525',
  surfacePressed: '#2F2F2F',

  primary: '#FF6B35',
  primaryMuted: 'rgba(255, 107, 53, 0.15)',
  accent: '#FF4D6D',
  accentMuted: 'rgba(255, 77, 109, 0.15)',
  gold: '#E8C547',
  goldMuted: 'rgba(232, 197, 71, 0.15)',

  success: '#4ADE80',
  successMuted: 'rgba(74, 222, 128, 0.15)',

  textPrimary: '#F5F0EB',
  textSecondary: '#8A8580',
  textTertiary: '#5A5550',

  border: '#2A2A2A',
  borderLight: '#333333',

  overlay: 'rgba(0, 0, 0, 0.6)',
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export type ColorKey = keyof typeof colors;
