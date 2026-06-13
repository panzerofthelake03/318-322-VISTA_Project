import React from 'react';
import { View, StyleSheet } from 'react-native';

interface WatchFrameProps {
  children: React.ReactNode;
  accentColor?: string;
}

// Figma watch border-radius: 28px; proportions: 166×326 → 186×356
// Sağ taraftaki küçük dikdörtgenler fiziksel saat butonlarını temsil eder
export function WatchFrame({ children, accentColor = '#4A9E72' }: WatchFrameProps) {
  return (
    <View style={styles.host}>
      {/* Üst bant tutacağı */}
      <View style={styles.bandTop} />

      <View style={styles.body}>
        {/* Saat gövdesi */}
        <View style={[styles.bezel, { borderColor: accentColor + '55' }]}>
          <View style={styles.screen}>
            {children}
          </View>
        </View>

        {/* Sağ taraf fiziksel butonlar */}
        <View style={styles.buttons}>
          <View style={[styles.button, styles.buttonLarge]} />
          <View style={[styles.button, styles.buttonSmall]} />
        </View>
      </View>

      {/* Alt bant tutacağı */}
      <View style={styles.bandBottom} />
    </View>
  );
}

const BEZEL_W = 207.9;
const BEZEL_H = 253;
const RADIUS  = 40;

const styles = StyleSheet.create({
  host: {
    alignItems: 'center',
  },
  bandTop: {
    width: 60,
    height: 14,
    backgroundColor: '#1c1c1e',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  bandBottom: {
    width: 60,
    height: 14,
    backgroundColor: '#1c1c1e',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bezel: {
    width: BEZEL_W,
    height: BEZEL_H,
    borderRadius: RADIUS,
    borderWidth: 2.5,
    padding: 3,
    backgroundColor: '#1c1c1e',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.9,
    shadowRadius: 24,
    elevation: 24,
  },
  screen: {
    flex: 1,
    borderRadius: RADIUS - 3,
    overflow: 'hidden',
    backgroundColor: '#1a1510',
  },
  buttons: {
    marginLeft: 2,
    gap: 12,
    justifyContent: 'center',
  },
  button: {
    width: 5,
    backgroundColor: '#2a2a2c',
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
    borderWidth: 0.5,
    borderColor: '#3a3a3c',
  },
  buttonLarge: { height: 44 },
  buttonSmall: { height: 26 },
});
