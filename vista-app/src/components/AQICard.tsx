import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, fontSize, fontWeight, radius, spacing } from '../theme';

type AQIStatus = 'Temiz' | 'Orta' | 'Sağlıksız';

interface Props {
  aqi: number;
  status: AQIStatus;
  mode?: string;
  isAlert?: boolean;
  isAutoModeActive?: boolean;
  onModePress?: () => void;
}

const statusConfig: Record<AQIStatus, { bg: string; text: string; border: string }> = {
  Temiz:    { bg: colors.greenLight, text: colors.green, border: colors.green },
  Orta:     { bg: colors.amberLight, text: colors.amber, border: colors.amber },
  Sağlıksız:{ bg: colors.redLight,   text: colors.red,   border: colors.red   },
};

export function AQICard({
  aqi,
  status,
  mode = 'Otomatik mod',
  isAlert = false,
  isAutoModeActive = true,
  onModePress,
}: Props) {
  const config = statusConfig[status];

  // Alert durumu: her zaman dolu (aktif görünüm)
  // Normal durum: isAutoModeActive'e göre dolu (beyaz yazı) veya boş (yeşil yazı)
  const circleFilled = isAlert || isAutoModeActive;
  const circleBg    = circleFilled ? config.border : colors.white;
  const circleText  = circleFilled ? colors.white  : config.border;

  return (
    <View style={[styles.card, { backgroundColor: config.bg, borderColor: config.border }]}>
      <View style={styles.left}>
        <Text style={styles.smallLabel}>Hava kalitesi</Text>
        <Text style={[styles.aqiNumber, { color: config.text }]}>{aqi}</Text>
        <Text style={[styles.statusText, { color: config.text }]}>AQI · {status}</Text>
      </View>

      <TouchableOpacity
        style={[styles.circle, { borderColor: config.border, backgroundColor: circleBg }]}
        onPress={!isAlert ? () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onModePress?.();
        } : undefined}
        activeOpacity={isAlert ? 1 : 0.75}
        disabled={isAlert}
      >
        {isAlert ? (
          <Ionicons name="warning-outline" size={28} color={circleText} />
        ) : (
          <Text style={[styles.modeLabel, { color: circleText }]}>{mode}</Text>
        )}
      </TouchableOpacity>
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
  left: { gap: 2 },
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
