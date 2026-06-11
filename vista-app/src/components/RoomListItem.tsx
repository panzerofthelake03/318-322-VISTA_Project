import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RipplePressable } from './RipplePressable';
import { colors, fontSize, fontWeight, radius, spacing } from '../theme';

interface Props {
  roomName: string;
  aqi: number;
  statusLabel: string;
  statusColor: string;
  isActive?: boolean;
  isAlert?: boolean;
  onPress?: () => void;
}

export function RoomListItem({ roomName, aqi, statusLabel, statusColor, isActive, isAlert, onPress }: Props) {
  return (
    <RipplePressable
      style={[styles.row, isActive && styles.rowActive]}
      onPress={onPress}
    >
      <View style={[styles.dot, { backgroundColor: statusColor }]} />
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{roomName}</Text>
          {isAlert && (
            <Ionicons name="warning" size={14} color={colors.red ?? '#D0021B'} style={styles.alertIcon} />
          )}
        </View>
        <Text style={styles.sub}>AQI {aqi} · {statusLabel}</Text>
      </View>
      <View style={[styles.badge, { backgroundColor: statusColor + '22' }]}>
        <Text style={[styles.badgeText, { color: statusColor }]}>{statusLabel}</Text>
      </View>
      {isActive && <View style={styles.activeDot} />}
    </RipplePressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    gap: spacing.md,
    borderRadius: radius.md,
  },
  rowActive: {
    backgroundColor: colors.border,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: radius.full,
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  alertIcon: {
    marginTop: 1,
  },
  name: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
  },
  sub: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  badgeText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semiBold,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.textSecondary,
    opacity: 0.5,
  },
});
