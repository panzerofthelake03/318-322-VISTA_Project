import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, fontSize, fontWeight, radius, spacing } from '../theme';
import { useOnboardingStore } from '../store/onboardingStore';
import { useDeviceStore } from '../store/deviceStore';
import { RipplePressable, SelectionModal, ModalOption } from '../components';
import { RoomKey } from '../data/mockDevice';

// ─── Popup seçenek listeleri ────────────────────────────────────────────────

const ROOM_OPTIONS: ModalOption[] = [
  { label: 'Çocuk odası', subtitle: 'Otomatik gece modu, düşük ses', value: 'baby_room' },
  { label: 'Oturma odası', subtitle: 'Yüksek sirkülasyon kapasitesi', value: 'living' },
  { label: 'Mutfak', subtitle: 'VOC ve CO₂ öncelikli', value: 'kitchen' },
  { label: 'Ofis', subtitle: 'CO₂ ve konsantrasyon modu', value: 'office' },
];

const FILTER_OPTIONS: ModalOption[] = [
  { label: 'HEPA H13', subtitle: 'Tıbbi sınıf — %99.95 partikül tutma', value: 'HEPA H13' },
  { label: 'HEPA H11', subtitle: 'Standart sınıf — %95 partikül tutma', value: 'HEPA H11' },
  { label: 'Aktif Karbon', subtitle: 'Koku ve VOC giderimi öncelikli', value: 'Aktif Karbon' },
  { label: 'Kombine (H13 + Karbon)', subtitle: 'Tam koruma paketi', value: 'Kombine H13+Karbon' },
];

const PM_OPTIONS: ModalOption[] = [
  { label: '5 μg/m³', subtitle: 'Çok hassas — WHO tavsiyesi (bebek)', value: '5' },
  { label: '10 μg/m³', subtitle: 'Hassas — bebek/alerji profili (varsayılan)', value: '10' },
  { label: '15 μg/m³', subtitle: 'Orta hassasiyet', value: '15' },
  { label: '25 μg/m³', subtitle: 'Standart — yetişkin profili', value: '25' },
];

// ─── Yardımcı ────────────────────────────────────────────────────────────────

const roomLabel = (id: string) =>
  ROOM_OPTIONS.find((o) => o.value === id)?.label ?? 'Çocuk odası';

// ─── Ekran ───────────────────────────────────────────────────────────────────

type ActiveModal = 'room' | 'filter' | 'pm' | null;

export function ProfileScreen() {
  const {
    profileName, filterType, pmThreshold, roomType,
    healthConditions, userProfiles,
    resetOnboarding, setRoomType, setPmThreshold,
  } = useOnboardingStore();
  const switchRoom = useDeviceStore((s) => s.switchRoom);

  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  const handleRoomSelect = (value: string) => {
    setRoomType(value);           // filtre tipini de otomatik günceller
    switchRoom(value as RoomKey); // dashboard verisini yeni odaya geçirir
  };

  const handleReset = async () => {
    await AsyncStorage.removeItem('onboardingCompleted');
    resetOnboarding();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{profileName.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.profileName}>{profileName}</Text>
          <Text style={styles.profileSub}>4 yaş · Hassas profil</Text>
        </View>

        {/* Cihaz Ayarları */}
        <SectionCard title="Cihaz ayarları">
          <SettableRow
            icon="home-outline"
            label="Oda"
            value={roomLabel(roomType)}
            onPress={() => setActiveModal('room')}
          />
          <InfoRow
            icon="cube-outline"
            label="Filtre tipi"
            value={filterType}
            note="Odaya göre otomatik"
          />
          <SettableRow
            icon="speedometer-outline"
            label="PM2.5 eşiği"
            value={`${pmThreshold} μg/m³`}
            onPress={() => setActiveModal('pm')}
            isLast
          />
        </SectionCard>

        {/* Sağlık Profili — bilgi gösterimi */}
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
            isLast
          />
        </SectionCard>

        {/* Uygulama */}
        <SectionCard title="Uygulama">
          <SettingRow icon="notifications-outline" label="Bildirimler" />
          <SettingRow icon="language-outline" label="Dil" value="Türkçe" />
          <SettingRow icon="shield-outline" label="Gizlilik politikası" />
          <SettingRow icon="information-circle-outline" label="Versiyon" value="1.0.0" isLast />
        </SectionCard>

        {/* Reset */}
        <RipplePressable
          style={styles.resetBtn}
          onPress={handleReset}
          rippleColor="rgba(224, 123, 106, 0.25)"
        >
          <Ionicons name="refresh-outline" size={18} color={colors.coral} />
          <Text style={styles.resetText}>Kurulumu yeniden başlat</Text>
        </RipplePressable>
      </ScrollView>

      {/* Popuplar */}
      <SelectionModal
        visible={activeModal === 'room'}
        title="Cihaz konumu"
        options={ROOM_OPTIONS}
        selected={roomType || 'baby_room'}
        onSelect={handleRoomSelect}
        onClose={() => setActiveModal(null)}
      />
      <SelectionModal
        visible={activeModal === 'pm'}
        title="PM2.5 uyarı eşiği"
        options={PM_OPTIONS}
        selected={String(pmThreshold)}
        onSelect={(val) => setPmThreshold(Number(val))}
        onClose={() => setActiveModal(null)}
      />
    </SafeAreaView>
  );
}

// ─── Alt Bileşenler ───────────────────────────────────────────────────────────

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={sectionStyles.wrap}>
      <Text style={sectionStyles.title}>{title}</Text>
      <View style={sectionStyles.card}>{children}</View>
    </View>
  );
}

function SettableRow({
  icon, label, value, onPress, isLast = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  onPress: () => void;
  isLast?: boolean;
}) {
  const style: StyleProp<ViewStyle> = [rowStyles.row, !isLast && rowStyles.border];
  return (
    <RipplePressable style={style} onPress={onPress}>
      <View style={rowStyles.left}>
        <Ionicons name={icon} size={18} color={colors.textSecondary} />
        <Text style={rowStyles.label}>{label}</Text>
      </View>
      <View style={rowStyles.right}>
        <Text style={rowStyles.value} numberOfLines={1}>{value}</Text>
        <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
      </View>
    </RipplePressable>
  );
}

function InfoRow({
  icon, label, value, note, isLast = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  note?: string;
  isLast?: boolean;
}) {
  const style: StyleProp<ViewStyle> = [rowStyles.row, !isLast && rowStyles.border];
  return (
    <View style={style}>
      <View style={rowStyles.left}>
        <Ionicons name={icon} size={18} color={colors.textSecondary} />
        <Text style={rowStyles.label}>{label}</Text>
      </View>
      <View style={rowStyles.valueWrap}>
        <Text style={rowStyles.value} numberOfLines={1}>{value}</Text>
        {note && <Text style={rowStyles.note}>{note}</Text>}
      </View>
    </View>
  );
}

function SettingRow({
  icon, label, value, isLast = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  isLast?: boolean;
}) {
  const style: StyleProp<ViewStyle> = [rowStyles.row, !isLast && rowStyles.border];
  return (
    <RipplePressable style={style}>
      <View style={rowStyles.left}>
        <Ionicons name={icon} size={18} color={colors.textSecondary} />
        <Text style={rowStyles.label}>{label}</Text>
      </View>
      <View style={rowStyles.right}>
        {value && <Text style={rowStyles.value}>{value}</Text>}
        <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
      </View>
    </RipplePressable>
  );
}

// ─── Stiller ─────────────────────────────────────────────────────────────────

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
    overflow: 'hidden',
  },
  resetText: { fontSize: fontSize.sm, color: colors.coral, fontWeight: fontWeight.medium },
});

const sectionStyles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  title: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semiBold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
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
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  label: { fontSize: fontSize.md, color: colors.textPrimary },
  value: { fontSize: fontSize.sm, color: colors.textSecondary, maxWidth: 160 },
  valueWrap: { alignItems: 'flex-end' },
  note: { fontSize: 10, color: colors.textSecondary, opacity: 0.7 },
  right: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
});
