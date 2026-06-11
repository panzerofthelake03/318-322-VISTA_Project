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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useOnboardingStore } from '../../store/onboardingStore';
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

  const [locationPermission, setLocationPermission] = useState(true);
  const [pm25Alarm, setPm25Alarm] = useState(true);
  const [co2Warning, setCo2Warning] = useState(true);
  const [filterChange, setFilterChange] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Ayarlar</Text>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {childName.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>

        {/* UYGULAMA Section */}
        <Text style={styles.sectionHeader}>UYGULAMA</Text>
        <View style={styles.sectionCard}>
          <SettingRow
            icon="language-outline"
            label="Dil"
            value="Türkçe"
            hasChevron
          />
          <SettingRow
            icon="thermometer-outline"
            label="Birimler"
            value="Celsius"
            hasChevron
          />
          <SettingRow
            icon="lock-closed-outline"
            label="Gizlilik & Güvenlik"
            hasChevron
          />
          <SettingRow
            icon="location-outline"
            label="Konum İzni"
            switchValue={locationPermission}
            onSwitchChange={setLocationPermission}
          />
          <View style={[rowStyles.row, { borderBottomWidth: 0 }]}>
            <View style={rowStyles.iconContainer}>
              <Ionicons name="share-outline" size={18} color={colors.textSecondary} />
            </View>
            <Text style={rowStyles.label}>Veri Paylaşımı</Text>
            <View style={rowStyles.right}>
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
            </View>
          </View>
        </View>

        {/* BİLDİRİMLER Section */}
        <Text style={styles.sectionHeader}>BİLDİRİMLER</Text>
        <View style={styles.sectionCard}>
          <TouchableOpacity
            style={notifStyles.notifRow}
            onPress={() => navigation.navigate('Notifications')}
            activeOpacity={0.7}
          >
            <View style={rowStyles.iconContainer}>
              <Ionicons name="notifications-outline" size={18} color={colors.textSecondary} />
            </View>
            <Text style={[rowStyles.label, { flex: 1 }]}>Bildirimler</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.toggleSection}>
            <View style={toggleRowStyles.row}>
              <View style={styles.toggleTextContainer}>
                <Text style={toggleRowStyles.title}>PM2.5 Alarmı</Text>
                <Text style={toggleRowStyles.subtitle}>Eşik aşıldında bildir</Text>
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
                <Text style={toggleRowStyles.title}>CO₂ Uyarısı</Text>
                <Text style={toggleRowStyles.subtitle}>1000 ppm üzerinde</Text>
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
                <Text style={toggleRowStyles.title}>Filtre Değişimi</Text>
                <Text style={toggleRowStyles.subtitle}>%20 altına düştüğünde</Text>
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
        <Text style={styles.sectionHeader}>CİHAZ</Text>
        <View style={styles.sectionCard}>
          <SettingRow
            icon="hardware-chip-outline"
            label="Cihaz Bilgileri"
            value="Vista Air"
            hasChevron
          />
          <View style={[rowStyles.row, { borderBottomWidth: 0 }]}>
            <View style={rowStyles.iconContainer}>
              <Ionicons name="help-circle-outline" size={18} color={colors.textSecondary} />
            </View>
            <Text style={rowStyles.label}>Yardım ve Destek</Text>
            <View style={rowStyles.right}>
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
            </View>
          </View>
        </View>
      </ScrollView>
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
