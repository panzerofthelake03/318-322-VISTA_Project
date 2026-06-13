import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../theme/colors';

interface MetricTileProps {
  value: string;
  label: string;
  style?: ViewStyle;
}

export function MetricTile({ value, label, style }: MetricTileProps) {
  return (
    <View style={[styles.tile, style]}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    minHeight: 40,
  },
  value: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 19,
  },
  label: {
    color: Colors.textDimmer,
    fontSize: 11,
    fontWeight: '400',
    marginTop: 2,
  },
});
