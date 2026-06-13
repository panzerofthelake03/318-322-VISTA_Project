import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, getAqiColor } from '../theme/colors';

interface Metric {
  label: string;
  value: string;
  unit: string;
  color: string;
}

interface Props {
  aqi: number;
  pm25: number;
  co2: number;
  humidity: number;
  onBack: () => void;
}

export function AirDetailScreen({ aqi, pm25, co2, humidity, onBack }: Props) {
  const metrics: Metric[] = [
    { label: 'PM2.5', value: pm25.toFixed(1), unit: 'μg/m³', color: getAqiColor(aqi) },
    { label: 'CO₂', value: co2.toString(), unit: 'ppm', color: co2 > 1000 ? Colors.aqiUnhealthy : co2 > 700 ? Colors.aqiModerate : Colors.aqiGood },
    { label: 'NEM', value: humidity.toString(), unit: '%', color: humidity < 30 || humidity > 70 ? Colors.aqiModerate : Colors.aqiGood },
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <Text style={styles.backText}>‹ Geri</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Hava Kalitesi</Text>

      <View style={styles.metricsContainer}>
        {metrics.map((m) => (
          <View key={m.label} style={styles.metricRow}>
            <View style={styles.metricLeft}>
              <View style={[styles.indicator, { backgroundColor: m.color }]} />
              <Text style={styles.metricLabel}>{m.label}</Text>
            </View>
            <View style={styles.metricRight}>
              <Text style={[styles.metricValue, { color: m.color }]}>{m.value}</Text>
              <Text style={styles.metricUnit}>{m.unit}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.filterRow}>
        <Text style={styles.filterLabel}>Filtre</Text>
        <View style={styles.filterBar}>
          <View style={[styles.filterFill, { width: '68%', backgroundColor: Colors.aqiGood }]} />
        </View>
        <Text style={styles.filterPct}>68%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: 2,
  },
  backText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 14,
    letterSpacing: 0.5,
  },
  metricsContainer: {
    gap: 10,
    marginBottom: 16,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  metricLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  metricLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  metricRight: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  metricValue: {
    fontSize: 17,
    fontWeight: '700',
  },
  metricUnit: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '400',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '500',
    width: 30,
  },
  filterBar: {
    flex: 1,
    height: 5,
    backgroundColor: Colors.surface,
    borderRadius: 3,
    overflow: 'hidden',
  },
  filterFill: {
    height: '100%',
    borderRadius: 3,
  },
  filterPct: {
    color: Colors.aqiGood,
    fontSize: 11,
    fontWeight: '600',
    width: 28,
    textAlign: 'right',
  },
});
