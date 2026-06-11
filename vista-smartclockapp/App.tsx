import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { WatchFrame } from './src/components/WatchFrame';
import { WatchFaceScreen } from './src/screens/WatchFaceScreen';
import { AirDetailScreen } from './src/screens/AirDetailScreen';
import { ModeScreen } from './src/screens/ModeScreen';
import { Colors, getAqiColor } from './src/theme/colors';

type Screen = 'face' | 'detail' | 'mode';

const AQI_PRESETS = [
  { label: 'İyi', aqi: 28, pm25: 8.2, co2: 420, humidity: 52 },
  { label: 'Orta', aqi: 75, pm25: 28.5, co2: 750, humidity: 38 },
  { label: 'Kötü', aqi: 145, pm25: 58.0, co2: 1200, humidity: 25 },
];

export default function App() {
  const [screen, setScreen] = useState<Screen>('face');
  const [presetIdx, setPresetIdx] = useState(0);

  const preset = AQI_PRESETS[presetIdx];
  const accentColor = getAqiColor(preset.aqi);

  return (
    <View style={styles.root}>
      <StatusBar style="light" backgroundColor="#050505" />

      <Text style={styles.header}>VISTA Watch Simulator</Text>

      <WatchFrame accentColor={accentColor}>
        {screen === 'face' && (
          <WatchFaceScreen
            aqi={preset.aqi}
            onNavigate={(s) => setScreen(s)}
          />
        )}
        {screen === 'detail' && (
          <AirDetailScreen
            aqi={preset.aqi}
            pm25={preset.pm25}
            co2={preset.co2}
            humidity={preset.humidity}
            onBack={() => setScreen('face')}
          />
        )}
        {screen === 'mode' && (
          <ModeScreen onBack={() => setScreen('face')} />
        )}
      </WatchFrame>

      <View style={styles.controls}>
        <Text style={styles.controlsLabel}>Hava Kalitesi Simülatörü</Text>
        <View style={styles.presetRow}>
          {AQI_PRESETS.map((p, i) => {
            const col = getAqiColor(p.aqi);
            const isActive = i === presetIdx;
            return (
              <TouchableOpacity
                key={p.label}
                style={[
                  styles.presetBtn,
                  { borderColor: col },
                  isActive && { backgroundColor: col + '22' },
                ]}
                onPress={() => { setPresetIdx(i); setScreen('face'); }}
              >
                <Text style={[styles.presetLabel, { color: col }]}>{p.label}</Text>
                <Text style={styles.presetAqi}>AQI {p.aqi}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.hint}>
          Saat yüzüne dokun → Detaylar  ·  Modlar → Bebek / Uyku / Turbo
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#050505',
    paddingTop: Platform.OS === 'android' ? 32 : 0,
  },
  header: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2,
    textAlign: 'center',
    paddingTop: 12,
    paddingBottom: 4,
    textTransform: 'uppercase',
  },
  controls: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    alignItems: 'center',
    gap: 12,
  },
  controlsLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    letterSpacing: 1,
  },
  presetRow: {
    flexDirection: 'row',
    gap: 10,
  },
  presetBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  presetLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  presetAqi: {
    color: Colors.textMuted,
    fontSize: 10,
  },
  hint: {
    color: '#444',
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 16,
  },
});
