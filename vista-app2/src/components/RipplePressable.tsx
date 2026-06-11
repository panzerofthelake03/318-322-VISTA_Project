import React, { useRef } from 'react';
import {
  Pressable,
  Animated,
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  LayoutChangeEvent,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';

interface Props {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  rippleColor?: string;
}

export function RipplePressable({
  children,
  onPress,
  style,
  rippleColor = 'rgba(193, 113, 85, 0.15)',
}: Props) {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const size = useRef({ width: 0, height: 0 });
  const touchOrigin = useRef({ x: 0, y: 0 });

  const handleLayout = (e: LayoutChangeEvent) => {
    size.current = {
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height,
    };
  };

  const triggerRipple = (x: number, y: number) => {
    touchOrigin.current = { x, y };
    scale.setValue(0);
    opacity.setValue(1);

    Animated.parallel([
      Animated.timing(scale, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = async (e: any) => {
    const { locationX, locationY } = e.nativeEvent;
    triggerRipple(locationX, locationY);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  const { width, height } = size.current;
  const rippleDiameter = Math.sqrt(width * width + height * height) * 2;

  const rippleStyle = {
    width: rippleDiameter,
    height: rippleDiameter,
    borderRadius: rippleDiameter / 2,
    backgroundColor: rippleColor,
    position: 'absolute' as const,
    top: touchOrigin.current.y - rippleDiameter / 2,
    left: touchOrigin.current.x - rippleDiameter / 2,
    transform: [{ scale }],
    opacity,
  };

  if (Platform.OS === 'android') {
    return (
      <Pressable
        style={style}
        onPress={handlePress}
        android_ripple={{ color: rippleColor, borderless: false }}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <Pressable style={[styles.wrap, style]} onPress={handlePress} onLayout={handleLayout}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Animated.View style={rippleStyle} />
      </View>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
  },
});
