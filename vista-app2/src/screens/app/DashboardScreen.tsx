import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDeviceStore } from '../../store/deviceStore';
import { useOnboardingStore } from '../../store/onboardingStore';
import { ROOM_DEVICE_MAP, RoomKey } from '../../data/mockDevice';
import { useTemperature, useTranslation, TranslationKey } from '../../i18n';
import { colors, spacing, fontSize, fontWeight, radius } from '../../theme';

type DeviceMode = 'auto' | 'sleep' | 'manual';

const MODE_ICONS: Record<DeviceMode, React.ComponentProps<typeof Ionicons>['name']> = {
  auto: 'radio-button-on-outline',
  sleep: 'moon-outline',
  manual: 'square-outline',
};

const MODE_LABEL_KEYS: Record<DeviceMode, TranslationKey> = {
  auto: 'mode_auto',
  sleep: 'mode_sleep',
  manual: 'mode_manual',
};

export function DashboardScreen() {
  const aqi = useDeviceStore((s) => s.aqi);
  const pm25 = useDeviceStore((s) => s.pm25);
  const co2 = useDeviceStore((s) => s.co2);
  const humidity = useDeviceStore((s) => s.humidity);
  const temperature = useDeviceStore((s) => s.temperature);
  const fanSpeed = useDeviceStore((s) => s.fanSpeed);
  const mode = useDeviceStore((s) => s.mode);
  const filterLife = useDeviceStore((s) => s.filterLife);
  const totalRuntime = useDeviceStore((s) => s.totalRuntime);
  const isAlertActive = useDeviceStore((s) => s.isAlertActive);
  const setMode = useDeviceStore((s) => s.setMode);
  const setFanSpeed = useDeviceStore((s) => s.setFanSpeed);
  const clearAlert = useDeviceStore((s) => s.clearAlert);

  const childName = useOnboardingStore((s) => s.childName);
  const { format: formatTemp } = useTemperature();
  const { t } = useTranslation();
  const roomType = useOnboardingStore((s) => s.roomType);
  const roomName = ROOM_DEVICE_MAP[roomType as RoomKey]?.name ?? 'Cihaz';

  const aqiCardBg = isAlertActive ? colors.redLight : colors.greenLight;
  const aqiCardBorder = isAlertActive ? colors.red : colors.green;
  const aqiStatusText = isAlertActive ? t('unhealthy') : t('clean_air');
  const aqiStatusLabel = isAlertActive ? t('critical') : t('excellent');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {isAlertActive ? (
              <Text style={styles.headerAlertLabel}>{t('alert_present')}</Text>
            ) : (
              <Text style={styles.headerGreeting}>{t('good_morning')}</Text>
            )}
            <Text style={styles.headerRoom}>{roomName}</Text>
          </View>
          <TouchableOpacity style={styles.avatar}>
            <Text style={styles.avatarText}>
              {childName.charAt(0).toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>

        {/* AQI Card */}
        <View style={[styles.aqiCard, { backgroundColor: aqiCardBg, borderColor: aqiCardBorder }]}>
          {isAlertActive ? (
            <>
              {/* Alarm state */}
              <View style={styles.aqiRow}>
                <View style={styles.aqiLeft}>
                  <Ionicons name="warning-outline" size={24} color={colors.red} />
                  <View style={styles.aqiNumbers}>
                    <Text style={[styles.aqiValue, { color: colors.red }]}>{aqi}</Text>
                    <Text style={[styles.aqiLabel, { color: colors.red }]}>
                      AQI · {aqiStatusText}
                    </Text>
                  </View>
                </View>
                <View style={[styles.badge, { backgroundColor: colors.red }]}>
                  <Text style={styles.badgeText}>{aqiStatusLabel}</Text>
                </View>
              </View>
              <Text style={styles.alertSubtitle}>
                PM2.5: {pm25} μg ·{' '}
                {t('critical_for_child').replace('{name}', childName)}
              </Text>
              <View style={styles.alertButtons}>
                <TouchableOpacity
                  style={styles.alertMaxBtn}
                  onPress={() => setFanSpeed(4)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.alertMaxBtnText}>{t('max_power')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.alertDismissBtn}
                  onPress={clearAlert}
                  activeOpacity={0.85}
                >
                  <Text style={styles.alertDismissBtnText}>{t('dismiss')}</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              {/* Normal state */}
              <View style={styles.aqiRow}>
                <View style={styles.aqiLeft}>
                  <View style={styles.aqiCircleIcon}>
                    <Ionicons name="radio-button-on-outline" size={24} color={colors.green} />
                  </View>
                  <View style={styles.aqiNumbers}>
                    <Text style={[styles.aqiValue, { color: colors.green }]}>{aqi}</Text>
                    <Text style={[styles.aqiLabel, { color: colors.green }]}>
                      AQI · {aqiStatusText}
                    </Text>
                  </View>
                </View>
                <View style={[styles.badge, { backgroundColor: colors.greenLight, borderWidth: 1, borderColor: colors.green }]}>
                  <Text style={[styles.badgeText, { color: colors.green }]}>
                    {aqiStatusLabel}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.metricsRow}>
                <View style={styles.metricItem}>
                  <Text style={styles.metricValue}>{pm25}</Text>
                  <Text style={styles.metricLabel}>PM2.5</Text>
                </View>
                <View style={styles.metricDivider} />
                <View style={styles.metricItem}>
                  <Text style={styles.metricValue}>{co2}</Text>
                  <Text style={styles.metricLabel}>CO₂</Text>
                </View>
                <View style={styles.metricDivider} />
                <View style={styles.metricItem}>
                  <Text style={styles.metricValue}>{humidity}%</Text>
                  <Text style={styles.metricLabel}>{t('humidity_short')}</Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* CO2 warning (alarm state only) */}
        {isAlertActive && co2 > 1000 && (
          <View style={styles.co2Card}>
            <View style={styles.co2CardLeft} />
            <View style={styles.co2CardContent}>
              <Text style={styles.co2Title}>{t('co2_warning')}</Text>
              <Text style={styles.co2Desc}>{co2} ppm · {t('co2_advice')}</Text>
              <TouchableOpacity>
                <Text style={styles.co2Link}>{t('see_solutions')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Info Grid */}
        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <Ionicons name="thermometer-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.infoValue}>{formatTemp(temperature)}</Text>
            <Text style={styles.infoLabel}>{t('temperature')}</Text>
            <Text style={styles.infoSub}>{t('ideal_range')}</Text>
          </View>
          <View style={styles.infoCard}>
            <Ionicons name="speedometer-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.infoValue}>{fanSpeed}/4</Text>
            <Text style={styles.infoLabel}>{t('fan_speed')}</Text>
            <Text style={styles.infoSub}>{t('mode_auto')}</Text>
          </View>
          <View style={styles.infoCard}>
            <Ionicons name="shield-checkmark-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.infoValue}>{filterLife.hepa}%</Text>
            <Text style={styles.infoLabel}>{t('filter_life')}</Text>
            <Text style={styles.infoSub}>{t('months_left')}</Text>
          </View>
          <View style={styles.infoCard}>
            <Ionicons name="time-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.infoValue}>14 s</Text>
            <Text style={styles.infoLabel}>{t('runtime')}</Text>
            <Text style={styles.infoSub}>{totalRuntime} s {t('total_suffix')}</Text>
          </View>
        </View>

        {/* Quick Control */}
        <Text style={styles.sectionTitle}>{t('quick_control')}</Text>
        <View style={styles.modeRow}>
          {(['auto', 'sleep', 'manual'] as DeviceMode[]).map((m) => {
            const isActive = mode === m;
            return (
              <TouchableOpacity
                key={m}
                style={[styles.modeChip, isActive && styles.modeChipActive]}
                onPress={() => setMode(m)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={MODE_ICONS[m]}
                  size={16}
                  color={isActive ? colors.coral : colors.textSecondary}
                />
                <Text style={[styles.modeChipText, isActive && styles.modeChipTextActive]}>
                  {t(MODE_LABEL_KEYS[m])}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  headerLeft: {},
  headerGreeting: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  headerAlertLabel: {
    fontSize: fontSize.sm,
    color: colors.coral,
    fontWeight: fontWeight.semiBold,
    marginBottom: 2,
  },
  headerRoom: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.coral,
  },
  avatarText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.coral,
  },
  aqiCard: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1.5,
    marginBottom: spacing.md,
  },
  aqiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  aqiLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  aqiCircleIcon: {},
  aqiNumbers: {},
  aqiValue: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    lineHeight: 36,
  },
  aqiLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  badgeText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semiBold,
    color: colors.white,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
    opacity: 0.5,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  metricLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border,
  },
  alertSubtitle: {
    fontSize: fontSize.sm,
    color: colors.red,
    marginBottom: spacing.md,
    fontWeight: fontWeight.medium,
  },
  alertButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  alertMaxBtn: {
    flex: 1,
    backgroundColor: colors.coral,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  alertMaxBtnText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semiBold,
    color: colors.white,
  },
  alertDismissBtn: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 44,
    justifyContent: 'center',
  },
  alertDismissBtnText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
  co2Card: {
    flexDirection: 'row',
    backgroundColor: colors.amberLight,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  co2CardLeft: {
    width: 4,
    backgroundColor: colors.amber,
  },
  co2CardContent: {
    flex: 1,
    padding: spacing.md,
  },
  co2Title: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semiBold,
    color: colors.amber,
    marginBottom: spacing.xs,
  },
  co2Desc: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  co2Link: {
    fontSize: fontSize.sm,
    color: colors.coral,
    fontWeight: fontWeight.medium,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    width: '47.5%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoValue: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  infoLabel: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    fontWeight: fontWeight.medium,
    marginTop: 2,
  },
  infoSub: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  modeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  modeChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    minHeight: 44,
  },
  modeChipActive: {
    backgroundColor: colors.coralLight,
    borderColor: colors.coral,
  },
  modeChipText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  modeChipTextActive: {
    color: colors.coral,
    fontWeight: fontWeight.semiBold,
  },
});
