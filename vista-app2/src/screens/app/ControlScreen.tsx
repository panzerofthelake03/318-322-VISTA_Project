import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Dimensions,
  Platform,
  Linking,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as IntentLauncher from 'expo-intent-launcher';
import { useDeviceStore } from '../../store/deviceStore';
import { useTranslation, TranslationKey } from '../../i18n';
import { colors, spacing, fontSize, fontWeight, radius } from '../../theme';

type DeviceMode = 'auto' | 'sleep' | 'manual';
type LightPreset = 'Sunrise' | 'Sunset' | 'Moonlight';

const MODE_CONFIG: Array<{
  key: DeviceMode;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  labelKey: TranslationKey;
}> = [
  { key: 'auto', icon: 'radio-button-on-outline', labelKey: 'mode_auto' },
  { key: 'sleep', icon: 'moon-outline', labelKey: 'mode_sleep' },
  { key: 'manual', icon: 'square-outline', labelKey: 'mode_manual' },
];

// Gradient fills for the light preset buttons (per Figma)
const PRESET_GRADIENTS: Record<LightPreset, [string, string]> = {
  Sunrise: ['#FBE7A2', '#F2C94C'],
  Sunset: ['#F2784B', '#4A6FA5'],
  Moonlight: ['#4A5699', '#2C3565'],
};

const PRESET_TEXT_COLORS: Record<LightPreset, string> = {
  Sunrise: '#8A6D1A',
  Sunset: colors.white,
  Moonlight: colors.white,
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_INNER_WIDTH = SCREEN_WIDTH - spacing.lg * 2 - spacing.md * 2;
const COLOR_WELL_SIZE = Math.min(CARD_INNER_WIDTH - spacing.lg * 2, 240);

async function openWeatherApp() {
  try {
    if (Platform.OS === 'ios') {
      // Apple Weather
      await Linking.openURL('weather://');
    } else {
      // Google app's weather screen — must be launched as an explicit intent
      await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
        data: 'dynact://velour/weather/ProxyActivity',
        packageName: 'com.google.android.googlequicksearchbox',
        className: 'com.google.android.apps.gsa.velour.DynamicActivityTrampoline',
      });
    }
  } catch {
    // No native weather app available — fall back to web forecast
    Linking.openURL('https://www.google.com/search?q=hava+durumu').catch(
      () => {}
    );
  }
}

// Selectable color dots around the wheel's edge (per Figma)
const DOT_COLORS = [
  '#E07A2F',
  '#F2C94C',
  '#FDF6E3',
  '#9BC4F8',
  '#4A6FD0',
  '#1F2A6B',
];
const DOT_SIZE = 26;
const DOT_RADIUS = COLOR_WELL_SIZE / 2 + DOT_SIZE / 2 + 6;
const FAN_HEIGHT = DOT_RADIUS + DOT_SIZE;

// Top half of the color well image, shown as a semicircle,
// with selectable color dots placed along its edge
function ColorFan() {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const cx = CARD_INNER_WIDTH / 2;

  return (
    <View style={fanStyles.container}>
      <Image
        source={require('../../../assets/Color Well.png')}
        style={[
          fanStyles.image,
          { left: cx - COLOR_WELL_SIZE / 2, top: FAN_HEIGHT - COLOR_WELL_SIZE / 2 },
        ]}
        resizeMode="contain"
      />
      {DOT_COLORS.map((color, i) => {
        const angleDeg = 165 - (i * 150) / (DOT_COLORS.length - 1);
        const angleRad = (angleDeg * Math.PI) / 180;
        const x = cx + DOT_RADIUS * Math.cos(angleRad) - DOT_SIZE / 2;
        const y = FAN_HEIGHT - DOT_RADIUS * Math.sin(angleRad) - DOT_SIZE / 2;
        const isSelected = selectedColor === color;
        return (
          <TouchableOpacity
            key={color}
            style={[
              fanStyles.dot,
              {
                backgroundColor: color,
                left: x,
                top: y,
                transform: [
                  { rotate: `${90 - angleDeg}deg` },
                  ...(isSelected ? [{ scale: 1.15 }] : []),
                ],
              },
              isSelected && fanStyles.dotSelected,
            ]}
            onPress={() => setSelectedColor(color)}
            activeOpacity={0.8}
          />
        );
      })}
    </View>
  );
}

const fanStyles = StyleSheet.create({
  container: {
    height: FAN_HEIGHT,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  image: {
    position: 'absolute',
    width: COLOR_WELL_SIZE,
    height: COLOR_WELL_SIZE,
  },
  dot: {
    position: 'absolute',
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  dotSelected: {
    borderWidth: 3,
    borderColor: colors.coral,
  },
});

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
  const { t } = useTranslation();

  const FAN_LABELS: Record<number, string> = {
    1: t('fan_quiet'),
    2: t('fan_normal'),
    3: t('fan_strong'),
    4: t('fan_max'),
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.screenTitle}>{t('control')}</Text>

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
                  size={22}
                  color={isActive ? colors.white : colors.textSecondary}
                />
                <Text style={[styles.modeButtonText, isActive && styles.modeButtonTextActive]}>
                  {t(cfg.labelKey)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Fan hızı */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>{t('fan_speed')}</Text>
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
            <Text style={styles.sectionLabel}>{t('water_level')}</Text>
            <View style={styles.waterTank}>
              <Text style={styles.waterPercent}>{waterLevel}%</Text>
              <LinearGradient
                colors={['#CFE6F8', '#7FB3E8']}
                style={[styles.waterFill, { height: `${waterLevel}%` as any }]}
              />
            </View>
          </View>

          {/* Humidity */}
          <View style={[styles.sectionCard, styles.halfCard]}>
            <Text style={styles.sectionLabel}>{t('humidity_level')}</Text>
            <View style={styles.humidityBody}>
              <View style={styles.humidityRow}>
                <Ionicons name="water" size={30} color="#5B9BE0" />
                <Text style={styles.humidityValue}>{humidity}%</Text>
              </View>
              <TouchableOpacity onPress={openWeatherApp}>
                <Text style={styles.controlLink}>{t('check_it')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Hava Akışı */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>{t('air_flow')}</Text>
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
            <Text style={styles.sectionLabel}>{t('light')}</Text>
            <Switch
              value={lightOn}
              onValueChange={toggleLight}
              trackColor={{ false: colors.border, true: colors.green }}
              thumbColor={colors.white}
            />
          </View>

          {lightOn && (
            <>
              {/* Semicircular color fan */}
              <ColorFan />

              {/* Presets */}
              <View style={styles.presetRow}>
                {(['Sunrise', 'Sunset', 'Moonlight'] as LightPreset[]).map((preset) => {
                  const isActive = lightPreset === preset;
                  return (
                    <TouchableOpacity
                      key={preset}
                      style={[styles.presetButton, isActive && styles.presetButtonActive]}
                      onPress={() => setLightPreset(preset)}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={PRESET_GRADIENTS[preset]}
                        style={styles.presetGradient}
                      >
                        <Text
                          style={[
                            styles.presetText,
                            { color: PRESET_TEXT_COLORS[preset] },
                          ]}
                        >
                          {preset}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}
        </View>

        {/* Ayarlar toggles */}
        <View style={styles.sectionCard}>
          <Text style={[styles.sectionLabel, { marginBottom: spacing.xs }]}>{t('settings')}</Text>

          <ToggleRow
            icon="moon-outline"
            title={t('night_mode')}
            subtitle={t('night_mode_sub')}
            value={nightMode}
            onToggle={toggleNightMode}
          />
          <ToggleRow
            icon="heart-outline"
            title={t('baby_sensitivity')}
            subtitle={t('baby_sensitivity_sub')}
            value={babySensitivity}
            onToggle={toggleBabySensitivity}
          />
          <ToggleRow
            icon="alert-circle-outline"
            title={t('voc_alarm')}
            subtitle={t('voc_alarm_sub')}
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
              <Text style={toggleStyles.title}>{t('auto_program')}</Text>
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
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 80,
    justifyContent: 'center',
  },
  modeButtonActive: {
    backgroundColor: colors.coral,
    borderColor: colors.coral,
  },
  modeButtonText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  modeButtonTextActive: {
    color: colors.white,
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
  waterTank: {
    height: 110,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  waterFill: {
    width: '100%',
  },
  waterPercent: {
    position: 'absolute',
    top: spacing.sm,
    alignSelf: 'center',
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semiBold,
    color: colors.textPrimary,
    zIndex: 1,
  },
  humidityBody: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
  },
  humidityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  humidityValue: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
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
  presetRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  presetButton: {
    flex: 1,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  presetButtonActive: {
    borderColor: colors.coral,
  },
  presetGradient: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
  presetText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semiBold,
  },
});
