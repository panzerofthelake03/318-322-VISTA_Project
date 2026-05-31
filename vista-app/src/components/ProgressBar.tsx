import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fontSize, fontWeight, radius, spacing } from '../theme';

interface Props {
  label: string;
  value: number;
  color?: string;
}

export function ProgressBar({ label, value, color }: Props) {
  const barColor = color ?? (value <= 50 ? colors.red : colors.green);

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.trackWrap}>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${value}%` as any, backgroundColor: barColor }]} />
        </View>
        <Text style={styles.value}>{value}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    fontWeight: fontWeight.medium,
    marginBottom: spacing.xs,
  },
  trackWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  track: {
    flex: 1,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.full,
  },
  value: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    minWidth: 36,
    textAlign: 'right',
  },
});
