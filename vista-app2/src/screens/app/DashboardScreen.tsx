import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDeviceStore } from '../../store/deviceStore';
import { useOnboardingStore } from '../../store/onboardingStore';
import { ROOM_DEVICE_MAP, RoomKey } from '../../data/mockDevice';
import { useTemperature, useTranslation, TranslationKey } from '../../i18n';
import { colors, spacing, fontSize, fontWeight, fonts, radius } from '../../theme';

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
  const triggerAlert = useDeviceStore((s) => s.triggerAlert);

  const childName = useOnboardingStore((s) => s.childName);
  const { format: formatTemp } = useTemperature();
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (isAlertActive) return;
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.12, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 900, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [isAlertActive]);

  const roomType = useOnboardingStore((s) => s.roomType);
  const roomName = ROOM_DEVICE_MAP[roomType as RoomKey]?.name ?? 'Cihaz';

  const aqiCardBg     = isAlertActive ? colors.redLight   : colors.greenLight;
  const aqiAccent     = isAlertActive ? colors.red         : colors.green;
  const aqiStatusText = isAlertActive ? t('unhealthy')     : t('clean_air');
  const aqiStatusLabel = isAlertActive ? t('critical')     : t('excellent');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ─────────────────────────────────────── */}
        <View style={styles.header}>
          <View>
            {isAlertActive
              ? <Text style={styles.headerAlertLabel}>{t('alert_present')}</Text>
              : <Text style={styles.headerGreeting}>{t('good_morning')}</Text>
            }
            <Text style={styles.headerRoom}>{roomName}</Text>
          </View>
          <TouchableOpacity
            style={styles.avatar}
            onPress={() => navigation.navigate('SettingsStack', { screen: 'Profiles' })}
          >
            <Text style={styles.avatarText}>{childName.charAt(0).toUpperCase()}</Text>
          </TouchableOpacity>
        </View>

        {/* ── AQI Card ───────────────────────────────────── */}
        <View style={[styles.aqiCard, { backgroundColor: aqiCardBg }]}>
          {isAlertActive ? (
            <>
              <View style={styles.aqiRow}>
                <View style={styles.aqiLeft}>
                  <View style={styles.alertIconCircle}>
                    <Ionicons name="warning-outline" size={26} color={colors.coral} />
                  </View>
                  <View>
                    <Text style={styles.aqiValue}>{aqi}</Text>
                    <Text style={styles.aqiLabel}>AQI · {aqiStatusText}</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.alertSubtitle}>
                PM2.5: {pm25} μg · {t('critical_for_child').replace('{name}', childName)}
              </Text>
              <View style={styles.alertButtons}>
                <TouchableOpacity style={styles.alertMaxBtn} onPress={() => setFanSpeed(4)} activeOpacity={0.85}>
                  <Text style={styles.alertMaxBtnText}>{t('max_power')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.alertDismissBtn} onPress={clearAlert} activeOpacity={0.85}>
                  <Text style={styles.alertDismissBtnText}>{t('dismiss')}</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <View style={styles.aqiRow}>
                <View style={styles.aqiLeft}>
                  <Animated.View style={[styles.aqiIconCircle, { transform: [{ scale: pulseAnim }] }]}>
                    <Ionicons name="locate-outline" size={26} color={colors.green} />
                  </Animated.View>
                  <View>
                    <Text style={styles.aqiValue}>{aqi}</Text>
                    <Text style={styles.aqiLabel}>AQI · {aqiStatusText}</Text>
                  </View>
                </View>
                <Text style={[styles.aqiStatusText, { color: colors.green }]}>{aqiStatusLabel}</Text>
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

        {/* CO2 uyarısı (yalnız alarm durumunda) */}
        {isAlertActive && co2 > 1000 && (
          <View style={styles.co2Card}>
            <Text style={styles.co2Title}>{t('co2_warning')}</Text>
            <Text style={styles.co2Desc}>{co2} ppm · {t('co2_advice')}</Text>
            <TouchableOpacity>
              <Text style={styles.co2Link}>{t('see_solutions')} →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Info Grid: 2×2 tablo ──────────────────────── */}
        <View style={styles.infoGrid}>
          {/* Alarm satırı: PM2.5 + CO₂ */}
          {isAlertActive && (
            <>
              <View style={styles.infoRow}>
                <View style={styles.infoCell}>
                  <Text style={styles.infoCellLabel}>PM2.5</Text>
                  <Text style={styles.infoCellValue}>
                    {pm25}<Text style={styles.infoCellUnit}> µg</Text>
                  </Text>
                  <Text style={styles.infoCellSub}>Limit: 15µg</Text>
                </View>
                <View style={styles.infoColDivider} />
                <View style={styles.infoCell}>
                  <Text style={styles.infoCellLabel}>CO₂</Text>
                  <Text style={[styles.infoCellValue, { color: colors.coral }]}>
                    {co2 >= 1000 ? (co2 / 1000).toFixed(1) + 'k' : co2}
                    <Text style={[styles.infoCellUnit, { color: colors.coral }]}> ppm</Text>
                  </Text>
                  <Text style={[styles.infoCellSub, { color: colors.coral }]}>Limit: 800</Text>
                </View>
              </View>
              <View style={styles.infoRowDivider} />
            </>
          )}

          {/* Satır 1 */}
          <View style={styles.infoRow}>
            <View style={styles.infoCell}>
              <Text style={styles.infoCellLabel}>{t('temperature')}</Text>
              <Text style={styles.infoCellValue}>{formatTemp(temperature)}</Text>
              <Text style={[styles.infoCellSub, { color: colors.green }]}>{t('ideal_range')}</Text>
            </View>
            <View style={styles.infoColDivider} />
            <View style={styles.infoCell}>
              <Text style={styles.infoCellLabel}>{t('fan_speed')}</Text>
              <Text style={styles.infoCellValue}>
                {fanSpeed}<Text style={styles.infoCellUnit}> /{4}</Text>
              </Text>
              <Text style={styles.infoCellSub}>{t('mode_auto')}</Text>
            </View>
          </View>

          <View style={styles.infoRowDivider} />

          {/* Satır 2 */}
          <View style={styles.infoRow}>
            <View style={styles.infoCell}>
              <Text style={styles.infoCellLabel}>{t('filter_life')}</Text>
              <Text style={styles.infoCellValue}>
                {filterLife.hepa}<Text style={styles.infoCellUnit}> %</Text>
              </Text>
              <Text style={[styles.infoCellSub, { color: colors.green }]}>{t('months_left')}</Text>
            </View>
            <View style={styles.infoColDivider} />
            <View style={styles.infoCell}>
              <Text style={styles.infoCellLabel}>{t('runtime')}</Text>
              <Text style={styles.infoCellValue}>
                14<Text style={styles.infoCellUnit}> s</Text>
              </Text>
              <Text style={styles.infoCellSub}>{totalRuntime} s {t('total_suffix')}</Text>
            </View>
          </View>
        </View>

        {/* ── Hızlı Kontrol ────────────────────────────── */}
        <Text style={styles.sectionTitle}>{t('quick_control')}</Text>
        <View style={styles.modeRow}>
          {(['auto', 'sleep', 'manual'] as DeviceMode[]).map((m) => {
            const isActive = mode === m;
            return (
              <TouchableOpacity
                key={m}
                style={[styles.modeBtn, isActive && styles.modeBtnActive]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setMode(m);
                }}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={MODE_ICONS[m]}
                  size={22}
                  color={isActive ? colors.coral : colors.textSecondary}
                />
                <Text style={[styles.modeBtnText, isActive && styles.modeBtnTextActive]}>
                  {t(MODE_LABEL_KEYS[m])}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Demo: alarm tetikle */}
        {!isAlertActive && (
          <TouchableOpacity style={styles.alertDemoButton} onPress={triggerAlert} activeOpacity={0.8}>
            <Ionicons name="warning-outline" size={16} color={colors.red} />
            <Text style={styles.alertDemoText}>{t('show_alert')}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  headerGreeting: { fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: 2 },
  headerAlertLabel: { fontSize: fontSize.sm, color: colors.coral, fontFamily: fonts.semiBold, marginBottom: 2 },
  headerRoom: { fontSize: fontSize.xl, fontFamily: fonts.semiBold, color: colors.textPrimary },
  avatar: {
    width: 44, height: 44,
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: fontSize.lg, fontFamily: fonts.semiBold, color: colors.textSecondary },

  // AQI Card
  aqiCard: {
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  aqiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  aqiLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  aqiIconCircle: {
    width: 52, height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(91,140,90,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  aqiValue: {
    fontSize: 40,
    fontFamily: fonts.medium,
    color: colors.textPrimary,
    lineHeight: 44,
  },
  aqiLabel: { fontSize: fontSize.sm, color: colors.textSecondary },
  aqiStatusText: { fontSize: fontSize.md, fontFamily: fonts.semiBold },

  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginVertical: spacing.md, opacity: 0.6 },

  metricsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  metricItem: { alignItems: 'center', flex: 1 },
  metricValue: { fontSize: fontSize.lg, fontFamily: fonts.regular, color: colors.textPrimary },
  metricLabel: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 },
  metricDivider: { width: 1, height: 32, backgroundColor: colors.border },

  alertIconCircle: {
    width: 52, height: 52, borderRadius: 26,
    borderWidth: 1.5, borderColor: colors.coral,
    backgroundColor: colors.redLight,
    alignItems: 'center', justifyContent: 'center',
  },
  alertSubtitle: { fontSize: fontSize.sm, color: colors.coral, marginBottom: spacing.md, fontFamily: fonts.medium },
  alertButtons: { flexDirection: 'row', gap: spacing.sm },
  alertMaxBtn: {
    flex: 1, backgroundColor: colors.coral, borderRadius: radius.md,
    paddingVertical: spacing.md, alignItems: 'center', minHeight: 44, justifyContent: 'center',
  },
  alertMaxBtnText: { fontSize: fontSize.sm, fontFamily: fonts.semiBold, color: colors.white },
  alertDismissBtn: {
    flex: 1, backgroundColor: colors.surface, borderRadius: radius.md,
    paddingVertical: spacing.md, alignItems: 'center',
    borderWidth: 1, borderColor: colors.border, minHeight: 44, justifyContent: 'center',
  },
  alertDismissBtnText: { fontSize: fontSize.sm, fontFamily: fonts.medium, color: colors.textSecondary },

  co2Card: {
    backgroundColor: colors.amberLight,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.xs,
  },
  co2Title: { fontSize: fontSize.md, fontFamily: fonts.semiBold, color: colors.amber },
  co2Desc: { fontSize: fontSize.sm, color: colors.textPrimary },
  co2Link: { fontSize: fontSize.sm, color: colors.coral, fontFamily: fonts.medium, marginTop: spacing.xs },

  // Info Grid — 2×2 tablo, kart yok
  infoGrid: { marginBottom: spacing.lg, paddingHorizontal: spacing.md },
  infoRow: { flexDirection: 'row', paddingVertical: spacing.lg },
  infoCell: { flex: 1, alignItems: 'center' },
  infoColDivider: { width: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginHorizontal: spacing.md },
  infoRowDivider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
  infoCellLabel: { fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: 4 },
  infoCellValue: { fontSize: fontSize.xxl, fontFamily: fonts.regular, color: colors.textPrimary, lineHeight: 30 },
  infoCellUnit: { fontSize: fontSize.md, fontFamily: fonts.regular, color: colors.textSecondary },
  infoCellSub: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 3 },

  // Hızlı Kontrol
  sectionTitle: { fontSize: fontSize.lg, fontFamily: fonts.medium, color: colors.textPrimary, marginBottom: spacing.md },
  modeRow: { flexDirection: 'row', gap: spacing.sm },
  modeBtn: {
    flex: 1,
    alignItems: 'center', justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border,
  },
  modeBtnActive: { backgroundColor: colors.coralLight, borderColor: colors.coral },
  modeBtnText: { fontSize: fontSize.sm, color: colors.textSecondary, fontFamily: fonts.medium },
  modeBtnTextActive: { color: colors.coral, fontFamily: fonts.semiBold },

  alertDemoButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.xs, marginTop: spacing.xl, minHeight: 44,
    borderRadius: radius.full, borderWidth: 1,
    borderColor: colors.red, backgroundColor: colors.redLight,
  },
  alertDemoText: { fontSize: fontSize.sm, color: colors.red, fontFamily: fonts.medium },
});
