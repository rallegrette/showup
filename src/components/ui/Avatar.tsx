import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { colors } from '../../theme';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  uri: string;
  size?: AvatarSize;
  showOnline?: boolean;
  isOnline?: boolean;
  style?: ViewStyle;
}

const sizeMap: Record<AvatarSize, number> = {
  sm: 28,
  md: 36,
  lg: 48,
  xl: 72,
};

export function Avatar({
  uri,
  size = 'md',
  showOnline = false,
  isOnline = false,
  style,
}: AvatarProps) {
  const dimension = sizeMap[size];
  const indicatorSize = dimension * 0.3;

  return (
    <View style={[{ width: dimension, height: dimension }, style]}>
      <Image
        source={{ uri }}
        style={[
          styles.image,
          {
            width: dimension,
            height: dimension,
            borderRadius: dimension / 2,
          },
        ]}
        contentFit="cover"
        transition={200}
      />
      {showOnline && isOnline && (
        <View
          style={[
            styles.indicator,
            {
              width: indicatorSize,
              height: indicatorSize,
              borderRadius: indicatorSize / 2,
              borderWidth: dimension > 36 ? 2.5 : 2,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: colors.surfaceElevated,
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.success,
    borderColor: colors.surface,
  },
});
