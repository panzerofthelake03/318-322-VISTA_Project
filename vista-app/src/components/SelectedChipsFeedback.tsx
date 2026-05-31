import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, radius, spacing } from '../theme';

interface Props {
  selected: string[];
}

export function SelectedChipsFeedback({ selected }: Props) {
  if (selected.length === 0) return null;

  const text = selected.join(' + ') + ' seçildi';

  return (
    <View style={styles.container}>
      <Ionicons name="information-circle-outline" size={16} color="#4A90D9" />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: '#EAF3FB',
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  text: {
    fontSize: fontSize.sm,
    color: '#4A90D9',
    flex: 1,
  },
});
