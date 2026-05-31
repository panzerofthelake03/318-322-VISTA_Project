import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fontSize, fontWeight, radius, spacing } from '../theme';

type Speed = 1 | 2 | 3 | 'Max';
const OPTIONS: Speed[] = [1, 2, 3, 'Max'];

interface Props {
  value: Speed;
  onChange: (val: Speed) => void;
  speedLabel?: string;
}

export function FanSpeedSelector({ value, onChange, speedLabel }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text style={styles.sectionLabel}>Fan hızı</Text>
        {speedLabel && <Text style={styles.speedLabel}>{speedLabel}</Text>}
      </View>
      <View style={styles.buttons}>
        {OPTIONS.map((opt) => {
          const active = opt === value;
          return (
            <TouchableOpacity
              key={String(opt)}
              style={[styles.btn, active && styles.btnActive]}
              onPress={() => onChange(opt)}
              activeOpacity={0.8}
            >
              <Text style={[styles.btnLabel, active && styles.btnLabelActive]}>
                {String(opt)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionLabel: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semiBold,
    color: colors.textPrimary,
  },
  speedLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  buttons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  btn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  btnActive: {
    backgroundColor: colors.black,
    borderColor: colors.black,
  },
  btnLabel: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
  },
  btnLabelActive: {
    color: colors.white,
  },
});
