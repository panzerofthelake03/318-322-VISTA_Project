import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { useOnboardingStore } from '../../store/onboardingStore';
import {
  useDeviceStore,
  ProfileId,
  PROFILE_ROOM_MAP,
} from '../../store/deviceStore';
import { ROOM_DEVICE_MAP } from '../../data/mockDevice';
import { useTranslation, TranslationKey } from '../../i18n';
import { colors, spacing, fontSize, fontWeight, radius } from '../../theme';

interface ProfileDef {
  id: ProfileId;
  name: string;
  age: number;
  roleKey: TranslationKey;
}

interface HealthToggleProps {
  labelKey: TranslationKey;
  value: boolean;
  onToggle: () => void;
}

export function ProfilesScreen() {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const childName = useOnboardingStore((s) => s.childName);
  const childAge = useOnboardingStore((s) => s.childAge);
  const setRoomType = useOnboardingStore((s) => s.setRoomType);
  const aqi = useDeviceStore((s) => s.aqi);
  const pm25 = useDeviceStore((s) => s.pm25);
  const fanSpeed = useDeviceStore((s) => s.fanSpeed);
  const isAlertActive = useDeviceStore((s) => s.isAlertActive);
  const activeProfile = useDeviceStore((s) => s.activeProfile);
  const switchProfile = useDeviceStore((s) => s.switchProfile);

  const [asthmaMode, setAsthmaMode] = useState(true);
  const [pollenFilter, setPollenFilter] = useState(true);
  const [dustSensitivity, setDustSensitivity] = useState(true);

  const profiles: ProfileDef[] = [
    { id: 'ada', name: childName, age: childAge, roleKey: 'role_child' },
    { id: 'emre', name: 'Emre', age: 36, roleKey: 'role_parent' },
  ];

  const active = profiles.find((p) => p.id === activeProfile)!;
  const others = profiles.filter((p) => p.id !== activeProfile);

  const handleSwitch = (p: ProfileDef) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    switchProfile(p.id);
    // Keep the dashboard header room name in sync with the new device
    setRoomType(PROFILE_ROOM_MAP[p.id]);
  };

  const healthToggles: HealthToggleProps[] = [
    {
      labelKey: 'asthma_risk_mode',
      value: asthmaMode,
      onToggle: () => setAsthmaMode((v) => !v),
    },
    {
      labelKey: 'pollen_filter',
      value: pollenFilter,
      onToggle: () => setPollenFilter((v) => !v),
    },
    {
      labelKey: 'dust_sensitivity',
      value: dustSensitivity,
      onToggle: () => setDustSensitivity((v) => !v),
    },
  ];

  // AQI 0–150 scale mapped to the progress bar
  const aqiProgress = Math.min(1, aqi / 150);
  const statusColor = isAlertActive ? colors.red : colors.green;
  const statusBg = isAlertActive ? colors.redLight : colors.greenLight;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={18} color={colors.textSecondary} />
            <Text style={styles.backText}>{t('back')}</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>{t('profiles')}</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Active profile card (bound device) */}
        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {active.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <View style={styles.profileNameRow}>
                <Text style={styles.profileName}>{active.name}</Text>
                <View style={[styles.onlineDot, { backgroundColor: statusColor }]} />
              </View>
              <Text style={styles.profileSub}>
                {active.age} {t('age_suffix')} · {t('active_profile')}
              </Text>
              <Text style={styles.profileMetrics}>
                AQI {aqi} · Fan {fanSpeed} · PM2.5 {pm25}μg
              </Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: statusBg, borderColor: statusColor },
              ]}
            >
              <Text style={[styles.statusBadgeText, { color: statusColor }]}>
                {isAlertActive ? t('unhealthy') : t('clean_badge')}
              </Text>
            </View>
          </View>

          {/* AQI progress bar */}
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${aqiProgress * 100}%` as any,
                  backgroundColor: statusColor,
                },
              ]}
            />
          </View>

          {/* Health toggles */}
          <Text style={styles.healthLabel}>{t('health_profile')}</Text>
          {healthToggles.map((toggle, i) => (
            <View
              key={toggle.labelKey}
              style={[
                styles.toggleRow,
                i === healthToggles.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              <Text style={styles.toggleLabel}>{t(toggle.labelKey)}</Text>
              <Switch
                value={toggle.value}
                onValueChange={toggle.onToggle}
                trackColor={{ false: colors.border, true: colors.green }}
                thumbColor={colors.white}
              />
            </View>
          ))}
        </View>

        {/* Other profiles — tap to switch profile + device */}
        {others.map((profile) => {
          const room = ROOM_DEVICE_MAP[PROFILE_ROOM_MAP[profile.id]];
          return (
            <TouchableOpacity
              key={profile.id}
              style={styles.secondaryCard}
              onPress={() => handleSwitch(profile)}
              activeOpacity={0.7}
            >
              <View style={[styles.avatar, { backgroundColor: colors.bg }]}>
                <Text style={styles.avatarText}>
                  {profile.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{profile.name}</Text>
                <Text style={styles.profileSub}>
                  {profile.age} {t('age_suffix')} · {t(profile.roleKey)}
                </Text>
                <Text style={styles.profileMetrics}>
                  {room.name} · AQI {room.aqi}
                </Text>
              </View>
              <Ionicons
                name="swap-horizontal-outline"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          );
        })}

        {/* Add device → QR pairing */}
        <TouchableOpacity
          style={styles.addDeviceRow}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('QRPair', { standalone: true })}
        >
          <Ionicons name="add" size={20} color={colors.textSecondary} />
          <Text style={styles.addDeviceText}>{t('add_device')}</Text>
        </TouchableOpacity>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: 44,
    minWidth: 60,
  },
  backText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  screenTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  headerSpacer: {
    minWidth: 60,
  },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  profileNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    backgroundColor: colors.bg,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textSecondary,
  },
  onlineDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semiBold,
    color: colors.textPrimary,
  },
  profileSub: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  profileMetrics: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semiBold,
  },
  progressTrack: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  healthLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    minHeight: 48,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  toggleLabel: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  secondaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addDeviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    minHeight: 56,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addDeviceText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
});
