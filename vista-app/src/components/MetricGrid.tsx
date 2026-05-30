import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fontSize, fontWeight, radius, spacing } from '../theme';

export interface Metric {
  label: string;
  value: string | number;
  unit: string;
  highlight?: boolean;
  highlightColor?: string;
}

interface Props {
  metrics: Metric[];
}

export function MetricGrid({ metrics }: Props) {
  return (
    <View style={styles.row}>
      {metrics.map((m, i) => (
        <View
          key={i}
          style={[
            styles.cell,
            m.highlight && { backgroundColor: m.highlightColor ?? colors.amberLight },
          ]}
        >
          <Text style={styles.value}>
            {m.value}
            <Text style={styles.unit}> {m.unit}</Text>
          </Text>
          <Text style={[styles.label, m.highlight && styles.labelHighlight]}>{m.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  cell: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'flex-start',
  },
  value: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  unit: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.regular,
    color: colors.textSecondary,
  },
  label: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  labelHighlight: {
    color: colors.amber,
    fontWeight: fontWeight.semiBold,
  },
});
