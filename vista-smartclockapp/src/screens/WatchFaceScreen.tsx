import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Colors, getAqiColor, getAqiLabel } from '../theme/colors';

interface Props {
  aqi: number;
  onNavigate: (screen: 'detail' | 'mode') => void;
}

function getCurrentTime(): string {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, '0');
  const m = now.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

export function WatchFaceScreen({ aqi, onNavigate }: Props) {
  const [time, setTime] = useState(getCurrentTime());
  const color = getAqiColor(aqi);
  const label = getAqiLabel(aqi);

  useEffect(() => {
    const interval = setInterval(() => setTime(getCurrentTime()), 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <Text style={styles.time}>{time}</Text>

      <TouchableOpacity
        style={[styles.aqiCircle, { borderColor: color }]}
        onPress={() => onNavigate('detail')}
        activeOpacity={0.8}
      >
        <Text style={[styles.aqiNumber, { color }]}>{aqi}</Text>
        <Text style={styles.aqiUnit}>AQI</Text>
      </TouchableOpacity>

      <View style={[styles.statusBadge, { backgroundColor: color + '25', borderColor: color + '60' }]}>
        <View style={[styles.dot, { backgroundColor: color }]} />
        <Text style={[styles.statusText, { color }]}>{label}</Text>
      </View>

      <TouchableOpacity style={styles.modeBtn} onPress={() => onNavigate('mode')}>
        <Text style={styles.modeBtnText}>≡  Modlar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  time: {
    fontSize: 22,
    fontWeight: '200',
    color: Colors.textSecondary,
    letterSpacing: 2,
  },
  aqiCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#161616',
  },
  aqiNumber: {
    fontSize: 38,
    fontWeight: '700',
    lineHeight: 42,
  },
  aqiUnit: {
    fontSize: 10,
    color: Colors.textMuted,
    letterSpacing: 2,
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  modeBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modeBtnText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
});
