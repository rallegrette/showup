import React, { useRef } from 'react';
import { Pressable, StyleSheet, ViewStyle, Animated } from 'react-native';
import { colors } from '../../theme';
import { useHaptics } from '../../hooks/useHaptics';

interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  size?: number;
  style?: ViewStyle;
}

export function IconButton({ icon, onPress, size = 40, style }: IconButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const haptics = useHaptics();

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.9, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={() => { haptics.light(); onPress(); }}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.button,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
          style,
        ]}
      >
        {icon}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
});
