import React from 'react';
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
import { useDeviceStore } from '../../store/deviceStore';
import { colors, spacing, fontSize, fontWeight, radius } from '../../theme';

type DeviceMode = 'auto' | 'sleep' | 'manual';
type LightPreset = 'Sunrise' | 'Sunset' | 'Moonlight';

const MODE_CONFIG: Array<{
  key: DeviceMode;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
}> = [
  { key: 'auto', icon: 'radio-button-on-outline', label: 'Otomatik' },
  { key: 'sleep', icon: 'moon-outline', label: 'Uyku' },
  { key: 'manual', icon: 'square-outline', label: 'Manuel' },
];

const PRESET_COLORS: Record<LightPreset, string> = {
  Sunrise: colors.amber,
  Sunset: colors.coral,
  Moonlight: '#2C3E50',
};

interface ToggleRowProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  subtitle: string;
  value: boolean;
  onToggle: () => void;
}

function ToggleRow({ icon, title, subtitle, value, onToggle }: ToggleRowProps) {
  return (
    <View style={toggleStyles.row}>
      <View style={toggleStyles.iconContainer}>
        <Ionicons name={icon} size={20} color={value ? colors.coral : colors.textSecondary} />
      </View>
      <View style={toggleStyles.textContainer}>
        <Text style={toggleStyles.title}>{title}</Text>
        <Text style={toggleStyles.subtitle}>{subtitle}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.border, true: colors.green }}
        thumbColor={colors.white}
      />
    </View>
  );
}

const toggleStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    minHeight: 64,
    gap: spacing.md,
  },
  iconContainer: {
    width: 36,
    height: 36,
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});

export function ControlScreen() {
  const mode = useDeviceStore((s) => s.mode);
  const setMode = useDeviceStore((s) => s.setMode);
  const fanSpeed = useDeviceStore((s) => s.fanSpeed);
  const setFanSpeed = useDeviceStore((s) => s.setFanSpeed);
  const airFlow = useDeviceStore((s) => s.airFlow);
  const setAirFlow = useDeviceStore((s) => s.setAirFlow);
  const lightOn = useDeviceStore((s) => s.lightOn);
  const toggleLight = useDeviceStore((s) => s.toggleLight);
  const lightPreset = useDeviceStore((s) => s.lightPreset);
  const setLightPreset = useDeviceStore((s) => s.setLightPreset);
  const nightMode = useDeviceStore((s) => s.nightMode);
  const toggleNightMode = useDeviceStore((s) => s.toggleNightMode);
  const babySensitivity = useDeviceStore((s) => s.babySensitivity);
  const toggleBabySensitivity = useDeviceStore((s) => s.toggleBabySensitivity);
  const vocAlarm = useDeviceStore((s) => s.vocAlarm);
  const toggleVocAlarm = useDeviceStore((s) => s.toggleVocAlarm);
  const autoProgram = useDeviceStore((s) => s.autoProgram);
  const toggleAutoProgram = useDeviceStore((s) => s.toggleAutoProgram);
  const waterLevel = useDeviceStore((s) => s.waterLevel);
  const humidity = useDeviceStore((s) => s.humidity);

  const FAN_LABELS: Record<number, string> = {
    1: 'Sessiz',
    2: 'Normal',
    3: 'Güçlü',
    4: 'Max',
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.screenTitle}>Kontrol</Text>

        {/* Mode selector */}
        <View style={styles.modeRow}>
          {MODE_CONFIG.map((cfg) => {
            const isActive = mode === cfg.key;
            return (
              <TouchableOpacity
                key={cfg.key}
                style={[styles.modeButton, isActive && styles.modeButtonActive]}
                onPress={() => setMode(cfg.key)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={cfg.icon}
                  size={20}
                  color={isActive ? colors.coral : colors.textSecondary}
                />
                <Text style={[styles.modeButtonText, isActive && styles.modeButtonTextActive]}>
                  {cfg.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Fan hızı */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>Fan hızı</Text>
          <View style={styles.segmentRow}>
            {([1, 2, 3, 4] as const).map((speed) => {
              const isActive = fanSpeed === speed;
              return (
                <TouchableOpacity
                  key={speed}
                  style={[styles.segment, isActive && styles.segmentActive]}
                  onPress={() => setFanSpeed(speed)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.segmentValue, isActive && styles.segmentValueActive]}>
                    {speed}
                  </Text>
                  <Text style={[styles.segmentLabel, isActive && styles.segmentLabelActive]}>
                    {FAN_LABELS[speed]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Water Level + Humidity */}
        <View style={styles.twoColRow}>
          {/* Water Level */}
          <View style={[styles.sectionCard, styles.halfCard]}>
            <Text style={styles.sectionLabel}>Su Seviyesi</Text>
            <View style={styles.waterContainer}>
              <View style={styles.waterTrack}>
                <View style={[styles.waterFill, { height: `${waterLevel}%` as any }]} />
              </View>
              <Text style={styles.waterPercent}>{waterLevel}%</Text>
            </View>
          </View>

          {/* Humidity */}
          <View style={[styles.sectionCard, styles.halfCard]}>
            <Text style={styles.sectionLabel}>Nem Seviyesi</Text>
            <Ionicons name="water-outline" size={28} color={colors.coral} />
            <Text style={styles.humidityValue}>{humidity}%</Text>
            <TouchableOpacity>
              <Text style={styles.controlLink}>Kontrol et →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Hava Akışı */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>Hava Akışı</Text>
          <View style={styles.segmentRow}>
            {([1, 2, 3, 4] as const).map((flow) => {
              const isActive = airFlow === flow;
              return (
                <TouchableOpacity
                  key={flow}
                  style={[styles.segment, isActive && styles.segmentActive]}
                  onPress={() => setAirFlow(flow)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.segmentValue, isActive && styles.segmentValueActive]}>
                    {flow}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Işık */}
        <View style={styles.sectionCard}>
          <View style={styles.lightHeader}>
            <Text style={styles.sectionLabel}>Işık</Text>
            <Switch
              value={lightOn}
              onValueChange={toggleLight}
              trackColor={{ false: colors.border, true: colors.green }}
              thumbColor={colors.white}
            />
          </View>

          {lightOn && (
            <>
              {/* Color swatch */}
              <View style={styles.colorSwatch}>
                <View style={[styles.colorBlock, { backgroundColor: '#FF6B35' }]} />
                <View style={[styles.colorBlock, { backgroundColor: '#FFD700' }]} />
                <View style={[styles.colorBlock, { backgroundColor: '#4A90E2' }]} />
              </View>

              {/* Presets */}
              <View style={styles.presetRow}>
                {(['Sunrise', 'Sunset', 'Moonlight'] as LightPreset[]).map((preset) => {
                  const isActive = lightPreset === preset;
                  return (
                    <TouchableOpacity
                      key={preset}
                      style={[
                        styles.presetPill,
                        {
                          backgroundColor: isActive
                            ? PRESET_COLORS[preset]
                            : colors.surface,
                        },
                      ]}
                      onPress={() => setLightPreset(preset)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.presetText,
                          isActive && styles.presetTextActive,
                        ]}
                      >
                        {preset}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}
        </View>

        {/* Ayarlar toggles */}
        <View style={styles.sectionCard}>
          <Text style={[styles.sectionLabel, { marginBottom: spacing.xs }]}>Ayarlar</Text>

          <ToggleRow
            icon="moon-outline"
            title="Gece modu"
            subtitle="Orb söner, fan 1 kademe"
            value={nightMode}
            onToggle={toggleNightMode}
          />
          <ToggleRow
            icon="heart-outline"
            title="Bebek hassasiyeti"
            subtitle="PM1.0 algılama aktif"
            value={babySensitivity}
            onToggle={toggleBabySensitivity}
          />
          <ToggleRow
            icon="alert-circle-outline"
            title="VOC alarmı"
            subtitle="Kimyasal gaz bildirimi"
            value={vocAlarm}
            onToggle={toggleVocAlarm}
          />
          <View style={[toggleStyles.row, { borderBottomWidth: 0 }]}>
            <View style={toggleStyles.iconContainer}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={autoProgram ? colors.coral : colors.textSecondary}
              />
            </View>
            <View style={toggleStyles.textContainer}>
              <Text style={toggleStyles.title}>Otomatik program</Text>
            </View>
            <Switch
              value={autoProgram}
              onValueChange={toggleAutoProgram}
              trackColor={{ false: colors.border, true: colors.green }}
              thumbColor={colors.white}
            />
          </View>
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
  screenTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    paddingTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  modeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  modeButton: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    minHeight: 70,
    justifyContent: 'center',
  },
  modeButtonActive: {
    backgroundColor: colors.coralLight,
    borderColor: colors.coral,
  },
  modeButtonText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  modeButtonTextActive: {
    color: colors.coral,
    fontWeight: fontWeight.semiBold,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semiBold,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  segmentRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 52,
  },
  segmentActive: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },
  segmentValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textSecondary,
  },
  segmentValueActive: {
    color: colors.white,
  },
  segmentLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  segmentLabelActive: {
    color: colors.white,
  },
  twoColRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: 0,
  },
  halfCard: {
    flex: 1,
    marginBottom: spacing.md,
  },
  waterContainer: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  waterTrack: {
    width: 40,
    height: 80,
    backgroundColor: colors.bg,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  waterFill: {
    backgroundColor: '#4A90E2',
    width: '100%',
    borderRadius: 4,
  },
  waterPercent: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semiBold,
    color: colors.textPrimary,
  },
  humidityValue: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  controlLink: {
    fontSize: fontSize.sm,
    color: colors.coral,
    fontWeight: fontWeight.medium,
  },
  lightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  colorSwatch: {
    flexDirection: 'row',
    height: 32,
    borderRadius: radius.md,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  colorBlock: {
    flex: 1,
  },
  presetRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  presetPill: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 36,
    justifyContent: 'center',
  },
  presetText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  presetTextActive: {
    color: colors.white,
    fontWeight: fontWeight.semiBold,
  },
});
