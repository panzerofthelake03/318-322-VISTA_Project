import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../theme/colors';

interface WatchFrameProps {
  children: React.ReactNode;
  accentColor?: string;
}

export function WatchFrame({ children, accentColor = Colors.aqiGood }: WatchFrameProps) {
  return (
    <View style={styles.phoneScreen}>
      <View style={[styles.bezel, { borderColor: accentColor + '60' }]}>
        <View style={styles.screen}>
          {children}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  phoneScreen: {
    flex: 1,
    backgroundColor: '#050505',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bezel: {
    width: 300,
    height: 300,
    borderRadius: 60,
    borderWidth: 3,
    padding: 4,
    backgroundColor: '#111111',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  },
  screen: {
    flex: 1,
    borderRadius: 56,
    overflow: 'hidden',
    backgroundColor: Colors.background,
  },
});
