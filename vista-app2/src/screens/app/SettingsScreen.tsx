import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useOnboardingStore } from '../../store/onboardingStore';
import { useSettingsStore, Language, TempUnit } from '../../store/settingsStore';
import { useTranslation, LANGUAGE_LABELS, UNIT_LABELS } from '../../i18n';
import { SettingsStackParamList } from '../../navigation/AppNavigator';
import { colors, spacing, fontSize, fontWeight, radius } from '../../theme';

type SettingsNavProp = NativeStackNavigationProp<SettingsStackParamList, 'Settings'>;

interface SettingRowProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value?: string;
  hasChevron?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (v: boolean) => void;
  onPress?: () => void;
}

function SettingRow({
  icon,
  label,
  value,
  hasChevron,
  switchValue,
  onSwitchChange,
  onPress,
}: SettingRowProps) {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper
      style={rowStyles.row}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={rowStyles.iconContainer}>
        <Ionicons name={icon} size={18} color={colors.textSecondary} />
      </View>
      <Text style={rowStyles.label}>{label}</Text>
      <View style={rowStyles.right}>
        {value ? <Text style={rowStyles.value}>{value}</Text> : null}
        {hasChevron && (
          <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
        )}
        {switchValue !== undefined && onSwitchChange && (
          <Switch
            value={switchValue}
            onValueChange={onSwitchChange}
            trackColor={{ false: colors.border, true: colors.green }}
            thumbColor={colors.white}
          />
        )}
      </View>
    </Wrapper>
  );
}

const LANGUAGE_OPTIONS: Language[] = ['tr', 'en', 'de'];
const UNIT_OPTIONS: TempUnit[] = ['C', 'F', 'K'];

interface OptionPickerProps {
  visible: boolean;
  title: string;
  options: Array<{ value: string; label: string }>;
  selected: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}

function OptionPicker({
  visible,
  title,
  options,
  selected,
  onSelect,
  onClose,
}: OptionPickerProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={pickerStyles.backdrop} onPress={onClose}>
        <Pressable style={pickerStyles.sheet} onPress={() => {}}>
          <Text style={pickerStyles.title}>{title}</Text>
          {options.map((option, i) => {
            const isSelected = option.value === selected;
            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  pickerStyles.option,
                  i === options.length - 1 && { borderBottomWidth: 0 },
                ]}
                onPress={() => {
                  onSelect(option.value);
                  onClose();
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    pickerStyles.optionText,
                    isSelected && pickerStyles.optionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
                {isSelected && (
                  <Ionicons name="checkmark" size={20} color={colors.coral} />
                )}
              </TouchableOpacity>
            );
          })}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const pickerStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  sheet: {
    backgroundColor: colors.bg,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semiBold,
    color: colors.textPrimary,
    paddingVertical: spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    minHeight: 52,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionText: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  optionTextSelected: {
    color: colors.coral,
    fontWeight: fontWeight.semiBold,
  },
});

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    minHeight: 52,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.md,
  },
  iconContainer: {
    width: 32,
    height: 32,
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  value: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});

export function SettingsScreen() {
  const navigation = useNavigation<SettingsNavProp>();
  const childName = useOnboardingStore((s) => s.childName);
  const { t } = useTranslation();

  const [locationPermission, setLocationPermission] = useState(true);
  const [pm25Alarm, setPm25Alarm] = useState(true);
  const [co2Warning, setCo2Warning] = useState(true);
  const [filterChange, setFilterChange] = useState(false);

  const language = useSettingsStore((s) => s.language);
  const setLanguage = useSettingsStore((s) => s.setLanguage);
  const unit = useSettingsStore((s) => s.unit);
  const setUnit = useSettingsStore((s) => s.setUnit);
  const [activePicker, setActivePicker] = useState<'language' | 'unit' | null>(
    null
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.screenTitle}>{t('settings')}</Text>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {childName.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>

        {/* UYGULAMA Section */}
        <Text style={styles.sectionHeader}>{t('app_section')}</Text>
        <View style={styles.sectionCard}>
          <SettingRow
            icon="language-outline"
            label={t('language')}
            value={LANGUAGE_LABELS[language]}
            hasChevron
            onPress={() => setActivePicker('language')}
          />
          <SettingRow
            icon="thermometer-outline"
            label={t('units')}
            value={UNIT_LABELS[unit]}
            hasChevron
            onPress={() => setActivePicker('unit')}
          />
          <SettingRow
            icon="lock-closed-outline"
            label={t('privacy')}
            hasChevron
          />
          <SettingRow
            icon="location-outline"
            label={t('location_permission')}
            switchValue={locationPermission}
            onSwitchChange={setLocationPermission}
          />
          <View style={[rowStyles.row, { borderBottomWidth: 0 }]}>
            <View style={rowStyles.iconContainer}>
              <Ionicons name="share-outline" size={18} color={colors.textSecondary} />
            </View>
            <Text style={rowStyles.label}>{t('data_sharing')}</Text>
            <View style={rowStyles.right}>
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
            </View>
          </View>
        </View>

        {/* BİLDİRİMLER Section */}
        <Text style={styles.sectionHeader}>{t('notifications_section')}</Text>
        <View style={styles.sectionCard}>
          <TouchableOpacity
            style={notifStyles.notifRow}
            onPress={() => navigation.navigate('Notifications')}
            activeOpacity={0.7}
          >
            <View style={rowStyles.iconContainer}>
              <Ionicons name="notifications-outline" size={18} color={colors.textSecondary} />
            </View>
            <Text style={[rowStyles.label, { flex: 1 }]}>{t('notifications')}</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.toggleSection}>
            <View style={toggleRowStyles.row}>
              <View style={styles.toggleTextContainer}>
                <Text style={toggleRowStyles.title}>{t('pm25_alarm')}</Text>
                <Text style={toggleRowStyles.subtitle}>{t('pm25_alarm_sub')}</Text>
              </View>
              <Switch
                value={pm25Alarm}
                onValueChange={setPm25Alarm}
                trackColor={{ false: colors.border, true: colors.green }}
                thumbColor={colors.white}
              />
            </View>
            <View style={toggleRowStyles.row}>
              <View style={styles.toggleTextContainer}>
                <Text style={toggleRowStyles.title}>{t('co2_warning')}</Text>
                <Text style={toggleRowStyles.subtitle}>{t('co2_warning_sub')}</Text>
              </View>
              <Switch
                value={co2Warning}
                onValueChange={setCo2Warning}
                trackColor={{ false: colors.border, true: colors.green }}
                thumbColor={colors.white}
              />
            </View>
            <View style={[toggleRowStyles.row, { borderBottomWidth: 0 }]}>
              <View style={styles.toggleTextContainer}>
                <Text style={toggleRowStyles.title}>{t('filter_change')}</Text>
                <Text style={toggleRowStyles.subtitle}>{t('filter_change_sub')}</Text>
              </View>
              <Switch
                value={filterChange}
                onValueChange={setFilterChange}
                trackColor={{ false: colors.border, true: colors.green }}
                thumbColor={colors.white}
              />
            </View>
          </View>
        </View>

        {/* Device Info */}
        <Text style={styles.sectionHeader}>{t('device_section')}</Text>
        <View style={styles.sectionCard}>
          <SettingRow
            icon="hardware-chip-outline"
            label={t('device_info')}
            value="Vista Air"
            hasChevron
          />
          <View style={[rowStyles.row, { borderBottomWidth: 0 }]}>
            <View style={rowStyles.iconContainer}>
              <Ionicons name="help-circle-outline" size={18} color={colors.textSecondary} />
            </View>
            <Text style={rowStyles.label}>{t('help_support')}</Text>
            <View style={rowStyles.right}>
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
            </View>
          </View>
        </View>
      </ScrollView>

      <OptionPicker
        visible={activePicker === 'language'}
        title={t('language')}
        options={LANGUAGE_OPTIONS.map((l) => ({
          value: l,
          label: LANGUAGE_LABELS[l],
        }))}
        selected={language}
        onSelect={(v) => setLanguage(v as Language)}
        onClose={() => setActivePicker(null)}
      />
      <OptionPicker
        visible={activePicker === 'unit'}
        title={t('units')}
        options={UNIT_OPTIONS.map((u) => ({
          value: u,
          label: UNIT_LABELS[u],
        }))}
        selected={unit}
        onSelect={(v) => setUnit(v as TempUnit)}
        onClose={() => setActivePicker(null)}
      />
    </SafeAreaView>
  );
}

const notifStyles = StyleSheet.create({
  notifRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    minHeight: 52,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.md,
  },
});

const toggleRowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    minHeight: 52,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    fontWeight: fontWeight.medium,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});

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
    marginBottom: spacing.xl,
  },
  screenTitle: {
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
  sectionHeader: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semiBold,
    color: colors.textSecondary,
    letterSpacing: 1,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toggleSection: {
    paddingTop: spacing.xs,
  },
  toggleTextContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
});
