import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, fontSize, fontWeight, radius, spacing } from '../theme';
import { useOnboardingStore } from '../store/onboardingStore';

export function ProfileScreen() {
  const { profileName, filterType, pmThreshold, roomType, healthConditions, userProfiles, resetOnboarding } =
    useOnboardingStore();

  const roomLabel =
    roomType === 'baby_room' ? 'Çocuk odası'
    : roomType === 'living' ? 'Oturma odası'
    : roomType === 'kitchen' ? 'Mutfak'
    : roomType === 'office' ? 'Ofis'
    : 'Çocuk odası';

  const handleReset = async () => {
    await AsyncStorage.removeItem('onboardingCompleted');
    // Store'u resetle → RootNavigator reaktif olarak Onboarding'e geçer
    resetOnboarding();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profileName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.profileName}>{profileName}</Text>
          <Text style={styles.profileSub}>4 yaş · Hassas profil</Text>
        </View>

        {/* Cihaz Bilgileri */}
        <SectionCard title="Cihaz ayarları">
          <InfoRow icon="home-outline" label="Oda" value={roomLabel} />
          <InfoRow icon="cube-outline" label="Filtre tipi" value={filterType} />
          <InfoRow icon="speedometer-outline" label="PM2.5 eşiği" value={`${pmThreshold} μg/m³`} />
        </SectionCard>

        {/* Sağlık Profili */}
        <SectionCard title="Sağlık profili">
          <InfoRow
            icon="heart-outline"
            label="Kullanıcı türü"
            value={userProfiles.length > 0 ? userProfiles.join(', ') : 'Belirtilmedi'}
          />
          <InfoRow
            icon="medical-outline"
            label="Sağlık durumu"
            value={healthConditions.length > 0 ? healthConditions.join(', ') : 'Belirtilmedi'}
          />
        </SectionCard>

        {/* Uygulama */}
        <SectionCard title="Uygulama">
          <SettingRow icon="notifications-outline" label="Bildirimler" />
          <SettingRow icon="language-outline" label="Dil" value="Türkçe" />
          <SettingRow icon="shield-outline" label="Gizlilik politikası" />
          <SettingRow icon="information-circle-outline" label="Versiyon" value="1.0.0" />
        </SectionCard>

        {/* Yeniden kurulum */}
        <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
          <Ionicons name="refresh-outline" size={18} color={colors.coral} />
          <Text style={styles.resetText}>Kurulumu yeniden başlat</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={sectionStyles.wrap}>
      <Text style={sectionStyles.title}>{title}</Text>
      <View style={sectionStyles.card}>{children}</View>
    </View>
  );
}

function InfoRow({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return (
    <View style={rowStyles.row}>
      <View style={rowStyles.left}>
        <Ionicons name={icon} size={18} color={colors.textSecondary} />
        <Text style={rowStyles.label}>{label}</Text>
      </View>
      <Text style={rowStyles.value} numberOfLines={1}>{value}</Text>
    </View>
  );
}

function SettingRow({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value?: string }) {
  return (
    <TouchableOpacity style={rowStyles.row} activeOpacity={0.7}>
      <View style={rowStyles.left}>
        <Ionicons name={icon} size={18} color={colors.textSecondary} />
        <Text style={rowStyles.label}>{label}</Text>
      </View>
      <View style={rowStyles.right}>
        {value && <Text style={rowStyles.value}>{value}</Text>}
        <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
      </View>
    </TouchableOpacity>
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
  avatarSection: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.md },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.coralLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 32, fontWeight: fontWeight.bold, color: colors.coral },
  profileName: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.textPrimary },
  profileSub: { fontSize: fontSize.sm, color: colors.textSecondary },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.coralLight,
    backgroundColor: colors.white,
    minHeight: 44,
  },
  resetText: { fontSize: fontSize.sm, color: colors.coral, fontWeight: fontWeight.medium },
});

const sectionStyles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  title: { fontSize: fontSize.sm, fontWeight: fontWeight.semiBold, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  card: { backgroundColor: colors.white, borderRadius: radius.lg, overflow: 'hidden' },
});

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 52,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  label: { fontSize: fontSize.md, color: colors.textPrimary },
  value: { fontSize: fontSize.sm, color: colors.textSecondary, maxWidth: 160 },
  right: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
});
