import React, { useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Platform, ScrollView, useWindowDimensions, PanResponder, Animated, Easing,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { WatchFrame } from './src/components/WatchFrame';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { WatchFaceScreen, WatchData } from './src/screens/WatchFaceScreen';
import { ModeScreen } from './src/screens/ModeScreen';
import { ProfileScreen, ProfileTab } from './src/screens/ProfileScreen';
import { NotifScreen, NotifView } from './src/screens/NotifScreen';
import { FilterScreen, FilterState } from './src/screens/FilterScreen';
import { Colors, AqiLevel, getLevelColors } from './src/theme/colors';

type Screen = 'onboarding' | 'face' | 'mode' | 'profile' | 'notif' | 'filter';

const PRESETS: (WatchData & { label: string })[] = [
  { label: 'İyi',  aqi: 32,  pm25: 8,  co2: 612,  humidity: 58, temp: 22, filter: 87, fan: 4, profile: 'Ada', room: 'çocuk odası', level: 'good' },
  { label: 'Orta', aqi: 74,  pm25: 24, co2: 980,  humidity: 65, temp: 24, filter: 87, fan: 3, profile: 'Ada', room: 'çocuk odası', level: 'moderate' },
  { label: 'Kötü', aqi: 142, pm25: 68, co2: 1100, humidity: 65, temp: 24, filter: 35, fan: 5, profile: 'Ada', room: 'acil mod',    level: 'bad' },
  { label: 'Uyku', aqi: 28,  pm25: 5,  co2: 450,  humidity: 55, temp: 21, filter: 87, fan: 1, profile: 'Ada', room: 'çocuk odası', level: 'sleep' },
];

const NAV_ITEMS: { id: Screen; label: string }[] = [
  { id: 'face',    label: 'Saat' },
  { id: 'mode',    label: 'Mod' },
  { id: 'profile', label: 'Profil' },
  { id: 'notif',   label: 'Bildirim' },
  { id: 'filter',  label: 'Filtre' },
];

const SWIPE_FLOW: Screen[] = ['face', 'mode', 'profile', 'notif', 'filter'];
const SWIPE_THRESHOLD = 42;

export default function App() {
  const [screen, setScreen]           = useState<Screen>('onboarding');
  const [presetIdx, setPresetIdx]     = useState(0);
  const [notifView, setNotifView]     = useState<NotifView>('pm25');
  const [filterView, setFilterView]   = useState<FilterState>('healthy');
  const [profileTab, setProfileTab]   = useState<ProfileTab>('genel');
  const { height: winH } = useWindowDimensions();
  const slideX = useRef(new Animated.Value(0)).current;

  const preset = PRESETS[presetIdx];
  const { accent, border } = getLevelColors(preset.level as AqiLevel);

  function transitionTo(nextScreen: Screen, enterFrom: 'left' | 'right' = 'right') {
    if (nextScreen === screen) return;

    // Klasik push hissi: yeni ekran sağdan/ soldan içeri kayar.
    const startX = enterFrom === 'right' ? 56 : -56;
    slideX.stopAnimation();
    slideX.setValue(startX);
    setScreen(nextScreen);

    Animated.timing(slideX, {
      toValue: 0,
      duration: 240,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }

  function goTo(s: Screen) {
    transitionTo(s, 'right');
  }

  function moveInSwipeFlow(direction: 'left' | 'right') {
    const currentIdx = SWIPE_FLOW.indexOf(screen);
    if (currentIdx === -1) return;

    // Kullanıcı isteği: sola kaydırma ileri, sağa kaydırma geri
    const targetIdx = direction === 'left' ? currentIdx + 1 : currentIdx - 1;
    if (targetIdx < 0 || targetIdx >= SWIPE_FLOW.length) return;

    const enterFrom: 'left' | 'right' = direction === 'left' ? 'right' : 'left';
    transitionTo(SWIPE_FLOW[targetIdx], enterFrom);
  }

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      const isHorizontal = Math.abs(gestureState.dx) > 12 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      return screen !== 'onboarding' && isHorizontal;
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx > SWIPE_THRESHOLD) {
        // Sağ kaydırma: geri
        moveInSwipeFlow('right');
        return;
      }

      if (gestureState.dx < -SWIPE_THRESHOLD) {
        // Sola kaydırma: ileri
        moveInSwipeFlow('left');
      }
    },
  });

  const watchContent = (
    <View style={styles.watchGestureArea}>
      <WatchFrame accentColor={border}>
        <Animated.View
          style={[styles.screenTransitionLayer, { transform: [{ translateX: slideX }] }]}
          {...panResponder.panHandlers}
        >
          {screen === 'onboarding' && <OnboardingScreen onDone={() => transitionTo('face', 'right')} />}
          {screen === 'face'    && <WatchFaceScreen {...preset} onNavigate={goTo} />}
          {screen === 'mode'    && <ModeScreen onBack={() => transitionTo('face', 'left')} />}
          {screen === 'profile' && <ProfileScreen tab={profileTab} onBack={() => transitionTo('face', 'left')} />}
          {screen === 'notif'   && (
            <NotifScreen
              view={notifView}
              onBack={() => transitionTo('face', 'left')}
              onAction={(a) => {
                if (a === 'maxPower') transitionTo('mode', 'right');
                if (a === 'filter')   transitionTo('filter', 'right');
              }}
            />
          )}
          {screen === 'filter'  && <FilterScreen view={filterView} onBack={() => transitionTo('face', 'left')} />}
        </Animated.View>
      </WatchFrame>
    </View>
  );

  const controls = (
    <View style={styles.controls}>
      {screen === 'face' && (
        <>
          <Text style={styles.controlsLabel}>Hava Kalitesi Simülatörü</Text>
          <View style={styles.presetRow}>
            {PRESETS.map((p, i) => {
              const col = getLevelColors(p.level as AqiLevel).accent;
              const isActive = i === presetIdx;
              return (
                <TouchableOpacity
                  key={p.label}
                  style={[styles.presetBtn, { borderColor: col }, isActive && { backgroundColor: col + '22' }]}
                  onPress={() => setPresetIdx(i)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.presetLabel, { color: col }]}>{p.label}</Text>
                  <Text style={styles.presetAqi}>AQI {p.aqi}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}
      {screen === 'profile' && (
        <>
          <Text style={styles.controlsLabel}>Profil Sayfası</Text>
          <View style={styles.notifTabRow}>
            {([
              { id: 'genel', label: 'Profil genel' },
              { id: 'bugun', label: 'Bugün · Ada'  },
              { id: 'aylik', label: 'Aylık özet'   },
            ] as const).map((t) => {
              const active = profileTab === t.id;
              return (
                <TouchableOpacity
                  key={t.id}
                  style={[styles.notifTab, active && styles.notifTabActive]}
                  onPress={() => setProfileTab(t.id)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.notifTabText, active && { color: Colors.textPrimary }]}>
                    {t.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}
      {screen === 'notif' && (
        <>
          <Text style={styles.controlsLabel}>Bildirim Ekranı</Text>
          <View style={styles.notifTabRow}>
            {([
              { id: 'pm25',   label: 'PM2.5 alarmı' },
              { id: 'co2',    label: 'CO₂ uyarısı'  },
              { id: 'center', label: 'Bildirimler'   },
            ] as const).map((t) => {
              const active = notifView === t.id;
              return (
                <TouchableOpacity
                  key={t.id}
                  style={[styles.notifTab, active && styles.notifTabActive]}
                  onPress={() => setNotifView(t.id)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.notifTabText, active && { color: Colors.textPrimary }]}>
                    {t.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}
      {screen === 'filter' && (
        <>
          <Text style={styles.controlsLabel}>Filtre Durumu</Text>
          <View style={styles.notifTabRow}>
            {([
              { id: 'healthy', label: 'Sağlıklı'  },
              { id: 'warning', label: 'Uyarı'      },
              { id: 'empty',   label: 'Tükendi'    },
              { id: 'reset',   label: 'Sıfırlama'  },
            ] as const).map((t) => {
              const active = filterView === t.id;
              return (
                <TouchableOpacity
                  key={t.id}
                  style={[styles.notifTab, active && styles.notifTabActive]}
                  onPress={() => setFilterView(t.id)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.notifTabText, active && { color: Colors.textPrimary }]}>
                    {t.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}
      {screen !== 'onboarding' && (
        <View style={styles.controlsSlot}>
          <View style={styles.navRow}>
            {NAV_ITEMS.map((item) => {
              const isActive = screen === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.navBtn, isActive && { borderColor: accent }]}
                  onPress={() => {
                    const currentIdx = SWIPE_FLOW.indexOf(screen);
                    const nextIdx = SWIPE_FLOW.indexOf(item.id);
                    const enterFrom: 'left' | 'right' =
                      nextIdx !== -1 && currentIdx !== -1 && nextIdx < currentIdx ? 'left' : 'right';
                    transitionTo(item.id, enterFrom);
                  }}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.navLabel, isActive && { color: accent }]}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
      {screen === 'onboarding' && (
        <Text style={styles.hint}>Onboarding adımlarını tamamla → Ana saat ekranına geç</Text>
      )}
    </View>
  );

  // Saat gövdesi + bantlar ~400px, kontroller ~160px → 560px eşiği
  const mustScroll = winH < 580;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <Text style={styles.header}>VISTA · Watch Simulator</Text>

      {mustScroll ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {watchContent}
          {controls}
        </ScrollView>
      ) : (
        <View style={styles.staticContent}>
          <View style={styles.watchArea}>{watchContent}</View>
          {controls}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#050505',
    paddingTop: Platform.OS === 'android' ? 32 : 0,
  },
  header: {
    color: Colors.textDimmer,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2,
    textAlign: 'center',
    paddingTop: 10,
    paddingBottom: 4,
    textTransform: 'uppercase',
  },
  // Büyük ekran: saati ortalı tut
  staticContent: {
    flex: 1,
  },
  watchArea: {
    height: 390,
    alignItems: 'center',
    justifyContent: 'center',
  },
  watchGestureArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenTransitionLayer: {
    flex: 1,
  },
  // Küçük ekran: ScrollView içeriği
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 16,
  },
  controls: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 12,
    gap: 10,
    alignItems: 'center',
  },
  controlsSlot: {
    minHeight: 44,
    justifyContent: 'flex-start',
  },
  controlsLabel: {
    color: Colors.textDimmer,
    fontSize: 11,
    letterSpacing: 1,
  },
  presetRow: {
    flexDirection: 'row',
    gap: 8,
  },
  presetBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 9,
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  presetLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  presetAqi: {
    color: Colors.textDimmer,
    fontSize: 10,
  },
  navRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  navBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  navLabel: {
    color: Colors.textDimmer,
    fontSize: 12,
    fontWeight: '500',
  },
  hint: {
    color: '#444',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
  // Bildirim ekran seçici (frame dışında)
  notifTabRow: {
    flexDirection: 'row',
    gap: 6,
  },
  notifTab: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  notifTabActive: {
    borderColor: Colors.textDimmer,
    backgroundColor: 'rgba(237,232,223,0.10)',
  },
  notifTabText: {
    color: Colors.textDimmer,
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
});
