import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, fontWeight, radius, spacing } from '../theme';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  active?: boolean;
  onPress?: () => void;
}

export function ActionCard({ icon, title, subtitle, active = false, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[styles.card, active && styles.cardActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons name={icon} size={22} color={active ? colors.white : colors.textPrimary} />
      <Text style={[styles.title, active && styles.titleActive]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, active && styles.subtitleActive]}>{subtitle}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    backgroundColor: colors.white,
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: 80,
    justifyContent: 'center',
  },
  cardActive: {
    backgroundColor: colors.black,
    borderColor: colors.black,
  },
  title: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semiBold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  titleActive: {
    color: colors.white,
  },
  subtitle: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  subtitleActive: {
    color: '#AAAAAA',
  },
});
