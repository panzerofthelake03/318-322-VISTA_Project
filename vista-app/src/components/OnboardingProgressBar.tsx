import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fontSize, radius, spacing } from '../theme';

interface Props {
  currentStep: number;
  totalSteps: number;
}

export function OnboardingProgressBar({ currentStep, totalSteps }: Props) {
  const progress = currentStep / totalSteps;

  return (
    <View style={styles.wrap}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress * 100}%` as any }]} />
      </View>
      <Text style={styles.label}>{currentStep} / {totalSteps}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  track: {
    flex: 1,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.coral,
    borderRadius: radius.full,
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    minWidth: 28,
    textAlign: 'right',
  },
});
