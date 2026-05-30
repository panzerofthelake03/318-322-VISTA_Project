import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, fontWeight, radius, spacing } from '../theme';

type AQIStatus = 'Temiz' | 'Orta' | 'Sağlıksız';

interface Props {
  aqi: number;
  status: AQIStatus;
  mode?: string;
  isAlert?: boolean;
}

const statusConfig: Record<AQIStatus, { bg: string; text: string; border: string; icon: keyof typeof Ionicons.glyphMap }> = {
  Temiz: { bg: colors.greenLight, text: colors.green, border: colors.green, icon: 'checkmark-circle-outline' },
  Orta: { bg: colors.amberLight, text: colors.amber, border: colors.amber, icon: 'alert-circle-outline' },
  Sağlıksız: { bg: colors.redLight, text: colors.red, border: colors.red, icon: 'warning-outline' },
};

export function AQICard({ aqi, status, mode = 'Otomatik mod', isAlert = false }: Props) {
  const config = statusConfig[status];

  return (
    <View style={[styles.card, { backgroundColor: config.bg, borderColor: config.border }]}>
      <View style={styles.left}>
        <Text style={styles.smallLabel}>Hava kalitesi</Text>
        <Text style={[styles.aqiNumber, { color: config.text }]}>{aqi}</Text>
        <Text style={[styles.statusText, { color: config.text }]}>AQI · {status}</Text>
      </View>
      <View style={[styles.circle, { borderColor: config.border }]}>
        {isAlert ? (
          <Ionicons name="warning-outline" size={28} color={config.text} />
        ) : (
          <Text style={[styles.modeLabel, { color: config.text }]}>{mode}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    gap: 2,
  },
  smallLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  aqiNumber: {
    fontSize: 48,
    fontWeight: fontWeight.bold,
    lineHeight: 56,
  },
  statusText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    textAlign: 'center',
  },
});
