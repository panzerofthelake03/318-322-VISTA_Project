import React, { useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Switch, ScrollView, PanResponder, Vibration,
} from 'react-native';
import { Colors } from '../theme/colors';

interface Props {
  onBack: () => void;
}

type ActiveMode = 'otomatik' | 'uyku' | 'bebek' | 'manuel';

const MODES: { id: ActiveMode; label: string }[] = [
  { id: 'otomatik', label: 'Otomatik' },
  { id: 'uyku',     label: 'Uyku'     },
  { id: 'bebek',    label: 'Bebek'    },
  { id: 'manuel',   label: 'Manuel'   },
];

const SCHEDULE = [
  {
    name: 'Sabah rutini', detail: '07:00 · Fan 2',
    titleColor: Colors.coralText,
    bg: 'rgba(224,120,96,0.14)',
    border: 'rgba(224,120,96,0.28)',
  },
  {
    name: 'Uyku', detail: '21:30 · Fan 1 · Orb söner',
    titleColor: Colors.purpleText,
    bg: 'rgba(168,160,224,0.14)',
    border: 'rgba(168,160,224,0.28)',
  },
  {
    name: 'Havalandırma', detail: '12:00 · Fan 3 · 20dk',
    titleColor: Colors.greenText,
    bg: 'rgba(111,207,154,0.14)',
    border: 'rgba(111,207,154,0.28)',
  },
];

// ─── Fan hızı slider (özel, 1-5 adım) ────────────────────────────────────────
const THUMB = 18; // thumb genişliği/yüksekliği

function FanSlider({ level, onChange }: { level: number; onChange: (n: number) => void }) {
  const [trackW, setTrackW] = useState(0);
  const trackWRef    = useRef(0);
  const trackXRef    = useRef(0);
  const prevLevelRef = useRef(level);  // adım takibi — titreşim için
  const onChangeRef  = useRef(onChange);
  const containerRef = useRef<View>(null);

  // onChange her render'da güncel kalsın
  onChangeRef.current = onChange;

  function clamp(pageX: number): number {
    const usable = trackWRef.current - THUMB;
    const rel    = Math.max(0, Math.min(usable, pageX - trackXRef.current));
    return Math.max(1, Math.min(5, Math.round((rel / usable) * 4) + 1));
  }

  // Adım değişiminde kısa titreşim
  function handleStep(pageX: number) {
    const next = clamp(pageX);
    if (next !== prevLevelRef.current) {
      Vibration.vibrate(35);
      prevLevelRef.current = next;
    }
    onChangeRef.current(next);
  }

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder:  () => true,
      onPanResponderGrant: (e) => handleStep(e.nativeEvent.pageX),
      onPanResponderMove:  (e) => handleStep(e.nativeEvent.pageX),
    })
  ).current;

  const usable   = trackW - THUMB;
  const thumbPos = usable > 0 ? ((level - 1) / 4) * usable : 0;

  return (
    <View>
      <View
        ref={containerRef}
        style={sl.wrap}
        onLayout={(e) => {
          const w = e.nativeEvent.layout.width;
          setTrackW(w);
          trackWRef.current = w;
          containerRef.current?.measure((_fx, _fy, _w, _h, px) => {
            trackXRef.current = px;
          });
        }}
        {...pan.panHandlers}
      >
        <View style={sl.track} />
        <View style={[sl.fill, { width: thumbPos + THUMB / 2 }]} />
        <View style={[sl.thumb, { left: thumbPos }]} />
      </View>
      <View style={sl.labels}>
        {[0, 1, 2, 3, 4].map((n) => (
          <Text
            key={n}
            style={[sl.labelText, n === level - 1 && sl.labelActive]}
          >
            {n}
          </Text>
        ))}
      </View>
    </View>
  );
}

const sl = StyleSheet.create({
  wrap: {
    height: THUMB + 10,
    justifyContent: 'center',
  },
  track: {
    position: 'absolute',
    left: 0, right: 0,
    height: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(237,232,223,0.15)',
  },
  fill: {
    position: 'absolute',
    left: 0,
    height: 2,
    borderRadius: 1,
    backgroundColor: Colors.greenText,
  },
  thumb: {
    position: 'absolute',
    width: THUMB, height: THUMB,
    borderRadius: 5,
    backgroundColor: Colors.greenText,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: THUMB / 2,
    marginTop: 3,
  },
  labelText: {
    color: 'rgba(237,232,223,0.28)',
    fontSize: 10,
    fontWeight: '500',
    width: 12,
    textAlign: 'center',
  },
  labelActive: {
    color: '#ffffff',
  },
});

// ─── Zamanlama görünümü ───────────────────────────────────────────────────────
function ScheduleView({ onBack }: { onBack: () => void }) {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: Colors.bgDefault }}
      contentContainerStyle={s.schContainer}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      <TouchableOpacity onPress={onBack} style={s.backRow}>
        <Text style={s.backText}>‹ Mod</Text>
      </TouchableOpacity>

      <Text style={s.schedTitle}>Günlük program</Text>

      {SCHEDULE.map((item) => (
        <TouchableOpacity
          key={item.name}
          activeOpacity={0.8}
          style={[s.schedCard, { backgroundColor: item.bg, borderColor: item.border }]}
        >
          <Text style={[s.schedName, { color: item.titleColor }]}>{item.name}</Text>
          <Text style={s.schedDetail}>{item.detail}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={s.addBtn} activeOpacity={0.7}>
        <Text style={s.addBtnText}>+ Program ekle</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ─── Mod görünümü ─────────────────────────────────────────────────────────────
export function ModeScreen({ onBack }: Props) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [mode, setMode]       = useState<ActiveMode>('otomatik');
  const [fanLevel, setFanLevel] = useState(2);
  const [nightMode, setNightMode] = useState(true);
  const [babyMode,  setBabyMode]  = useState(true);

  if (showSchedule) {
    return <ScheduleView onBack={() => setShowSchedule(false)} />;
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: Colors.bgDefault }}
      contentContainerStyle={s.container}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      {/* Üst bar: küçük ‹ + zamanlama butonu */}
      <View style={s.topBar}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={s.chevron}>‹</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowSchedule(true)} style={s.schedBtn} activeOpacity={0.75}>
          <Text style={s.schedBtnText}>Zamanlama ›</Text>
        </TouchableOpacity>
      </View>

      {/* "Mod" başlığı — solda, küçük/dim */}
      <Text style={s.pageTitle}>Mod</Text>

      {/* Mod kartları — yatay kaydırılabilir */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={s.modeContent}
        style={s.modeScroll}
      >
        {MODES.map(({ id, label }) => {
          const active = mode === id;
          return (
            <TouchableOpacity
              key={id}
              style={[s.modeCard, active && s.modeCardActive]}
              onPress={() => setMode(id)}
              activeOpacity={0.75}
            >
              <Text style={[s.modeCardText, active && s.modeCardTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Fan hızı */}
      <Text style={s.sectionLabel}>Fan hızı</Text>
      <FanSlider level={fanLevel} onChange={setFanLevel} />

      {/* Toggle satırları */}
      <View style={s.toggleRow}>
        <Text style={s.toggleLabel}>Gece (orb söner)</Text>
        <Switch
          value={nightMode}
          onValueChange={setNightMode}
          trackColor={{ false: Colors.border, true: Colors.greenBorder }}
          thumbColor={nightMode ? Colors.greenText : Colors.textDimmer}
          style={s.sw}
        />
      </View>
      <View style={s.toggleRow}>
        <Text style={s.toggleLabel}>Bebek hassasiyeti</Text>
        <Switch
          value={babyMode}
          onValueChange={setBabyMode}
          trackColor={{ false: Colors.border, true: Colors.greenBorder }}
          thumbColor={babyMode ? Colors.greenText : Colors.textDimmer}
          style={s.sw}
        />
      </View>
    </ScrollView>
  );
}

// ─── Stiller ─────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 14,
    gap: 12,
  },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: -6,
  },
  chevron:  { color: Colors.textDim, fontSize: 19, fontWeight: '400', lineHeight: 22 },
  backRow:  { marginBottom: -4 },
  backText: { color: Colors.textDim, fontSize: 13, fontWeight: '500' },

  schedBtn: {
    paddingHorizontal: 9, paddingVertical: 3,
    borderRadius: 9, borderWidth: 1,
    borderColor: Colors.border, backgroundColor: Colors.surface,
  },
  schedBtnText: { color: Colors.textDimmer, fontSize: 10, fontWeight: '500' },

  // "Mod" başlığı
  pageTitle: { color: Colors.textDimmer, fontSize: 12, fontWeight: '400' },

  // Yatay mod kartları
  modeScroll:   { marginHorizontal: -14 },
  modeContent:  { paddingHorizontal: 14, gap: 8 },
  modeCard: {
    width: 66, height: 44,
    borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#1C1C1E',
    borderWidth: 1.5, borderColor: 'rgba(237,232,223,0.10)',
  },
  modeCardActive: {
    borderColor: Colors.coralBorder,
    backgroundColor: 'rgba(224,120,96,0.10)',
  },
  modeCardText: {
    color: Colors.textDimmer, fontSize: 12, fontWeight: '500',
  },
  modeCardTextActive: { color: Colors.coralText },

  sectionLabel: {
    color: Colors.textDimmer, fontSize: 11,
    marginBottom: -6,
  },

  // Toggle
  toggleRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: -5,
    marginBottom: -15,
  },
  toggleLabel: {
    color: Colors.textPrimary, fontSize: 13, fontWeight: '400', flex: 1,
  },
  sw: { transform: [{ scaleX: 0.80 }, { scaleY: 0.80 }] },

  // Zamanlama ekranı container (daha geniş gap)
  schContainer: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 14,
    gap: 9,
  },

  schedTitle: {
    color: Colors.textDimmer, fontSize: 12, fontWeight: '400',
    marginBottom: 2,
  },
  schedCard: {
    borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12,
    borderWidth: 1,
    gap: 4,
  },
  // renk dışarıdan gelir — sadece yapı buraya
  schedName: {
    fontSize: 16, fontWeight: '500',
  },
  schedDetail: {
    color: Colors.textDimmer, fontSize: 11,
  },
  addBtn: {
    paddingVertical: 12, borderRadius: 12,
    borderWidth: 1, borderColor: 'rgba(237,232,223,0.18)',
    borderStyle: 'dashed', alignItems: 'center',
    flexDirection: 'row', justifyContent: 'center', gap: 6,
  },
  addBtnText: { color: 'rgba(237,232,223,0.35)', fontSize: 12 },
});
