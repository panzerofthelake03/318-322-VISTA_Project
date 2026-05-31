import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fontSize, fontWeight, radius, spacing } from '../theme';

interface Props {
  roomName: string;
  aqi: number;
  statusLabel: string;
  statusColor: string;
}

export function RoomListItem({ roomName, aqi, statusLabel, statusColor }: Props) {
  return (
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: statusColor }]} />
      <View style={styles.info}>
        <Text style={styles.name}>{roomName}</Text>
        <Text style={styles.sub}>AQI {aqi} · {statusLabel}</Text>
      </View>
      <View style={[styles.badge, { backgroundColor: statusColor + '22' }]}>
        <Text style={[styles.badgeText, { color: statusColor }]}>{statusLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: radius.full,
  },
  info: {
    flex: 1,
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
});
