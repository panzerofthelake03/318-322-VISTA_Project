import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import {
  AQICard, MetricGrid, FanSpeedSelector, RoomListItem, AlertBanner, ActionCard,
} from '../components';
import { colors, fontSize, fontWeight, radius, spacing } from '../theme';
import { useDeviceStore } from '../store/deviceStore';
import { useOnboardingStore } from '../store/onboardingStore';
import { AppTabParamList } from '../navigation/AppNavigator';
import { ROOM_DEVICE_MAP, RoomKey } from '../data/mockDevice';

export function DashboardScreen() {
  const {
    aqi, pm25, co2, humidity, voc, fanSpeed,
    isAlertActive, isAutoModeActive,
    rooms, setFanSpeed, toggleAutoMode, clearAlert, switchRoom,
  } = useDeviceStore();
  const { roomType, profileName, setRoomType } = useOnboardingStore();
  const navigation = useNavigation<BottomTabNavigationProp<AppTabParamList>>();

  const activeRoomKey = (roomType || 'baby_room') as RoomKey;
  const activeRoomName = ROOM_DEVICE_MAP[activeRoomKey]?.name ?? "Ada'nın odası";
  const profileInitial = profileName.charAt(0).toUpperCase();

  const aqiStatus = aqi <= 50 ? 'Temiz' : aqi <= 100 ? 'Orta' : 'Sağlıksız';
  const today = new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' });

  const normalMetrics = [
    { label: 'PM2.5', value: pm25, unit: 'μg' },
    { label: 'CO₂ ppm', value: co2, unit: '' },
    { label: 'Nem', value: humidity, unit: '%' },
  ];

  const alertMetrics = [
    { label: 'PM2.5', value: pm25, unit: 'μg', highlight: true, highlightColor: colors.redLight },
    { label: 'VOC', value: voc, unit: '', highlight: true, highlightColor: colors.amberLight },
    { label: 'Nem', value: humidity, unit: '%' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.date}>{today}</Text>
            <Text style={styles.roomTitle}>{activeRoomName}</Text>
          </View>
          <TouchableOpacity
            style={styles.avatar}
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.8}
          >
            <Text style={styles.avatarText}>{profileInitial}</Text>
          </TouchableOpacity>
        </View>

        {/* Alert Banner */}
        {isAlertActive && (
          <AlertBanner message={`${activeRoomName} için PM2.5 alarmı!`} />
        )}

        {/* AQI Card */}
        <AQICard
          aqi={aqi}
          status={aqiStatus as any}
          mode={isAlertActive ? 'Max güç' : 'Otomatik mod'}
          isAlert={isAlertActive}
          isAutoModeActive={isAutoModeActive}
          onModePress={toggleAutoMode}
        />

        {/* Metrics */}
        <MetricGrid metrics={isAlertActive ? alertMetrics : normalMetrics} />

        {/* Alert Action Cards ya da Fan Hızı */}
        {isAlertActive ? (
          <View style={styles.actionRow}>
            <ActionCard icon="flash-outline" title="Max güç" subtitle="Aktif" active />
            <ActionCard icon="storefront-outline" title="Pencere kapat" subtitle="Hatırlatıcı kur" />
            <ActionCard icon="close-outline" title="Yoksay" subtitle="1 saat için" onPress={clearAlert} />
          </View>
        ) : (
          <FanSpeedSelector
            value={fanSpeed}
            onChange={setFanSpeed}
            speedLabel={fanSpeed === 1 ? 'Hız 1 · sessiz' : fanSpeed === 2 ? 'Hız 2 · sessiz' : fanSpeed === 3 ? 'Hız 3' : 'Max'}
          />
        )}

        {/* Tüm odalar — her zaman görünür */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tüm odalar</Text>
          {rooms.map((r) => (
            <RoomListItem
              key={r.key}
              roomName={r.name}
              aqi={r.key === activeRoomKey ? aqi : r.aqi}
              statusLabel={r.key === activeRoomKey
                ? (aqi <= 50 ? 'İyi' : aqi <= 100 ? 'Orta' : 'Sağlıksız')
                : r.status}
              statusColor={r.key === activeRoomKey
                ? (aqi <= 50 ? '#4CAF7D' : aqi <= 100 ? '#F5A623' : '#D0021B')
                : r.statusColor}
              isActive={r.key === activeRoomKey}
              isAlert={r.isAlert}
              onPress={() => {
                if (r.key !== activeRoomKey) {
                  setRoomType(r.key);
                  switchRoom(r.key);
                }
              }}
            />
          ))}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  roomTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.coralLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.coral,
  },
  section: {
    gap: 0,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  devBtn: {
    marginTop: spacing.xl,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.border,
    alignItems: 'center',
  },
  devBtnText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});
