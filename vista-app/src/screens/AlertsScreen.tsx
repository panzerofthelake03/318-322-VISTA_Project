import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, fontWeight, radius, spacing } from '../theme';
import { mockAlerts } from '../data/mockDevice';

const typeConfig = {
  pm25: { icon: 'alert-circle' as const, color: colors.red, bg: colors.redLight },
  filter: { icon: 'cube-outline' as const, color: colors.amber, bg: colors.amberLight },
  aqi: { icon: 'warning' as const, color: colors.amber, bg: colors.amberLight },
};

export function AlertsScreen() {
  const grouped = mockAlerts.reduce<Record<string, typeof mockAlerts>>((acc, alert) => {
    const key = alert.date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(alert);
    return acc;
  }, {});

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Uyarılar</Text>
        <Text style={styles.subtitle}>{mockAlerts.length} bildirim</Text>

        {Object.entries(grouped).map(([date, alerts]) => (
          <View key={date}>
            <Text style={styles.dateHeader}>{date}</Text>
            <View style={styles.group}>
              {alerts.map((alert, i) => {
                const cfg = typeConfig[alert.type];
                return (
                  <View
                    key={alert.id}
                    style={[
                      styles.alertCard,
                      i < alerts.length - 1 && styles.alertCardBorder,
                    ]}
                  >
                    <View style={[styles.iconWrap, { backgroundColor: cfg.bg }]}>
                      <Ionicons name={cfg.icon} size={20} color={cfg.color} />
                    </View>
                    <View style={styles.alertContent}>
                      <View style={styles.alertHeader}>
                        <Text style={styles.alertMessage}>{alert.message}</Text>
                        <Text style={styles.alertTime}>{alert.time}</Text>
                      </View>
                      <Text style={styles.alertDetail}>{alert.detail}</Text>
                      {alert.resolved && (
                        <View style={styles.resolvedBadge}>
                          <Ionicons name="checkmark-circle" size={12} color={colors.green} />
                          <Text style={styles.resolvedText}>Çözüldü</Text>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        ))}

        {/* Boş durum mesajı gösterimi için placeholder */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.infoText}>
            PM2.5, AQI ve filtre uyarıları burada görünür. Bildirimler Ada'nın hassas profili baz alınarak oluşturulur.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },
  title: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.textPrimary },
  subtitle: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: -spacing.sm },
  dateHeader: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semiBold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  group: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  alertCard: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  alertCardBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  alertContent: { flex: 1, gap: spacing.xs },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  alertMessage: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semiBold,
    color: colors.textPrimary,
    flex: 1,
  },
  alertTime: { fontSize: fontSize.xs, color: colors.textSecondary, flexShrink: 0 },
  alertDetail: { fontSize: fontSize.sm, color: colors.textSecondary },
  resolvedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  resolvedText: { fontSize: fontSize.xs, color: colors.green, fontWeight: fontWeight.medium },
  infoBox: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.lg,
    alignItems: 'flex-start',
  },
  infoText: { flex: 1, fontSize: fontSize.xs, color: colors.textSecondary, lineHeight: 18 },
});
