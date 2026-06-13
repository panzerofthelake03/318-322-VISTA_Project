import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AqiOrbProps {
  value: number | string;
  accentColor: string;
  borderColor: string;
  size?: number;
  fontSize?: number;
}

export function AqiOrb({ value, accentColor, borderColor, size = 58, fontSize }: AqiOrbProps) {
  const radius = size / 2;
  const fSize = fontSize ?? Math.round(size * 0.33);
  return (
    <View style={[styles.orb, { width: size, height: size, borderRadius: radius, borderColor }]}>
      <Text style={[styles.value, { color: accentColor, fontSize: fSize }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  orb: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  value: {
    fontWeight: '500',
    letterSpacing: -0.5,
  },
});
