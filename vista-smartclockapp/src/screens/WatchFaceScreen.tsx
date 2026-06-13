import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Colors, AqiLevel, getLevelColors, getAqiLabel } from '../theme/colors';
import { AqiOrb } from '../components/AqiOrb';
import { MetricTile } from '../components/MetricTile';

export interface WatchData {
  aqi: number;
  pm25: number;
  co2: number;
  humidity: number;
  temp: number;
  filter: number;
  fan: number;
  profile: string;
  room: string;
  level: AqiLevel;
}

interface Props extends WatchData {
  onNavigate: (screen: 'mode' | 'profile' | 'notif' | 'filter') => void;
}

function getTime(): string {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

function MetricDots({ filled, total = 5, accentColor }: { filled: number; total?: number; accentColor: string }) {
  return (
    <View style={dotsStyle.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[dotsStyle.dot, { backgroundColor: i < filled ? accentColor : 'rgba(237,232,223,0.18)' }]}
        />
      ))}
    </View>
  );
}
const dotsStyle = StyleSheet.create({
  row: { flexDirection: 'row', gap: 3, flex: 1, paddingHorizontal: 6 },
  dot: { width: 5, height: 8, borderRadius: 2 },
});

// ─── Uyku Modu — Figma 34:127 ─────────────────────────────────────────────────
// İçerik frame'den uzun olduğu için ScrollView ile kaydırılabilir
// Sıra: row1 = lavender, coral, amber | row2 = cream, green, teal
const LIGHT_COLORS = [
  '#A8A0E0',
  '#E07860',
  '#F5C87A',
  '#EEEAE4',
  '#6FCF9A',
  '#5EC8C8',
];

function SleepFace({ aqi, humidity, temp, filter, fan, profile, onNavigate }: Props) {
  const [time, setTime]         = useState(getTime());
  const [selectedLight, setSelectedLight] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTime(getTime()), 10_000);
    return () => clearInterval(id);
  }, []);

  const lightColor = LIGHT_COLORS[selectedLight];

  // Seçili rengin 2 basamaklı hex opacity değerleri
  const moonBg     = lightColor + '22'; // ~13% opacity
  const moonBorder = lightColor + '70'; // ~44% opacity
  const moonCenter = lightColor + 'AA'; // ~67% opacity

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: Colors.bgSleep }}
      contentContainerStyle={sl.container}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      {/* Header */}
      <Text style={sl.header}>{profile} uyuyor · sessiz</Text>

      {/* Ay ikonu — seçili ışık rengiyle boyalı */}
      <View style={[sl.moonCircle, { backgroundColor: moonBg, borderColor: moonBorder }]}>
        <View style={[sl.moonDot, { backgroundColor: moonCenter }]} />
      </View>

      {/* Uyku modu (seçili renkle) */}
      <Text style={[sl.modeText, { color: lightColor }]}>Uyku modu</Text>
      {/* Saat */}
      <Text style={sl.timeText}>{time}</Text>

      {/* AQI özeti */}
      <Text style={sl.aqiLine}>AQI {aqi} · mükemmel</Text>

      {/* Fan satırı — sadece dots, sönük yok */}
      <View style={sl.statRow}>
        <Text style={sl.statLabel}>Fan</Text>
        <MetricDots filled={Math.min(fan, 5)} accentColor={lightColor} />
      </View>

      {/* Orb ışığı satırı */}
      <View style={sl.statRow}>
        <Text style={sl.statLabel}>Orb ışığı</Text>
        <View style={{ flex: 1 }} />
        <Text style={sl.statDim}>sönük</Text>
      </View>

      <View style={sl.divider} />

      {/* Işık rengi */}
      <Text style={sl.sectionLabel}>Işık rengi</Text>

      {/* Row 1: lavender, coral, amber */}
      <View style={sl.lightsRow}>
        {LIGHT_COLORS.slice(0, 3).map((c, i) => (
          <TouchableOpacity
            key={i}
            style={[sl.lightSwatch, { backgroundColor: c }, selectedLight === i && sl.lightSwatchActive]}
            onPress={() => setSelectedLight(i)}
            activeOpacity={0.8}
          />
        ))}
      </View>
      <View style={{ height: 7 }} />
      {/* Row 2: cream, green, teal */}
      <View style={sl.lightsRow}>
        {LIGHT_COLORS.slice(3, 6).map((c, i) => (
          <TouchableOpacity
            key={i + 3}
            style={[sl.lightSwatch, { backgroundColor: c }, selectedLight === i + 3 && sl.lightSwatchActive]}
            onPress={() => setSelectedLight(i + 3)}
            activeOpacity={0.8}
          />
        ))}
      </View>

      <View style={{ height: 8 }} />
      <View style={sl.divider} />

      {/* 2×2 kutucuklar — kaydırarak görünür */}
      <View style={sl.tilesRow}>
        <MetricTile value={`${humidity}%`} label="nem" />
        <View style={{ width: 4 }} />
        <MetricTile value={`${temp}°`} label="sıcak" />
      </View>
      <View style={{ height: 4 }} />
      <View style={sl.tilesRow}>
        <TouchableOpacity style={{ flex: 1 }} onPress={() => onNavigate('filter')} activeOpacity={0.7}>
          <MetricTile value={`${filter}%`} label="filtre" />
        </TouchableOpacity>
        <View style={{ width: 4 }} />
        <TouchableOpacity style={{ flex: 1 }} onPress={() => onNavigate('mode')} activeOpacity={0.7}>
          <MetricTile value={`${fan}`} label="fan" />
        </TouchableOpacity>
      </View>

      <View style={{ height: 10 }} />
    </ScrollView>
  );
}

// ─── Normal Saat Yüzü ─────────────────────────────────────────────────────────
function NormalFace({ aqi, pm25, co2, humidity, temp, filter, fan, profile, room, level, onNavigate }: Props) {
  const [time, setTime] = useState(getTime());
  const { bg, accent, border } = getLevelColors(level);

  useEffect(() => {
    const id = setInterval(() => setTime(getTime()), 10_000);
    return () => clearInterval(id);
  }, []);

  const pm25Dots = Math.min(5, Math.round((pm25 / 35) * 5));
  const co2Dots  = Math.min(5, Math.round((co2 / 1200) * 5));

  return (
    // Dış View: arka plan + sabit konumlu affordance çizgileri
    <View style={[styles.outer, { backgroundColor: bg }]}>
      <View style={styles.affordanceA} />
      <View style={styles.affordanceB} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <Text style={styles.header}>{profile} · {room}</Text>

        <View style={styles.orbWrap}>
          <AqiOrb value={aqi} accentColor={accent} borderColor={border} size={58} />
        </View>

        <Text style={[styles.status, { color: accent }]}>{getAqiLabel(aqi, level)}</Text>
        <Text style={styles.time}>{time}</Text>

        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>PM2.5</Text>
          <MetricDots filled={pm25Dots} accentColor={accent} />
          <Text style={styles.metricValue}>{pm25}µg</Text>
        </View>

        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>CO₂</Text>
          <MetricDots filled={co2Dots} accentColor={accent} />
          <Text style={styles.metricValue}>{co2}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.tilesRow}>
          <MetricTile value={`${humidity}%`} label="nem" />
          <View style={{ width: 4 }} />
          <MetricTile value={`${temp}°`} label="sıcak" />
        </View>
        <View style={{ height: 4 }} />
        <View style={styles.tilesRow}>
          <TouchableOpacity style={styles.tileTouchable} onPress={() => onNavigate('filter')} activeOpacity={0.7}>
            <MetricTile value={`${filter}%`} label="filtre" />
          </TouchableOpacity>
          <View style={{ width: 4 }} />
          <TouchableOpacity style={styles.tileTouchable} onPress={() => onNavigate('mode')} activeOpacity={0.7}>
            <MetricTile value={`${fan}`} label="fan" />
          </TouchableOpacity>
        </View>

        <View style={{ height: 8 }} />
      </ScrollView>
    </View>
  );
}

// Dışa açık giriş noktası — mod'a göre doğru bileşeni seçer
export function WatchFaceScreen(props: Props) {
  return props.level === 'sleep' ? <SleepFace {...props} /> : <NormalFace {...props} />;
}

// ─── Stiller — Normal Ekran ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Dış sarmalayıcı: affordance çizgileri buna göre konumlanır
  outer: {
    flex: 1,
  },
  // ScrollView contentContainerStyle
  container: {
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 4,
  },
  // Sağ kenar saat butonu efektleri — dış View'a göre sabit konumlu
  affordanceA: {
    position: 'absolute', right: 0, top: '19%', zIndex: 1,
    width: 4, height: 28,
    backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: 2,
  },
  affordanceB: {
    position: 'absolute', right: 0, top: '29%', zIndex: 1,
    width: 4, height: 16,
    backgroundColor: 'rgba(255,255,255,0.09)', borderRadius: 2,
  },
  header: {
    color: Colors.textDimmer, fontSize: 11, fontWeight: '400',
    textAlign: 'center', marginBottom: 5,
  },
  orbWrap: { alignItems: 'center', marginBottom: 2 },
  status:  { fontSize: 15, fontWeight: '500', textAlign: 'center', marginTop: 4 },
  time:    { color: Colors.textPrimary, fontSize: 14, fontWeight: '400', textAlign: 'center', marginTop: 1, marginBottom: 5 },
  metricRow:   { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
  metricLabel: { color: Colors.textDim, fontSize: 13, fontWeight: '400', width: 42 },
  metricValue: { color: Colors.textPrimary, fontSize: 13, fontWeight: '400', textAlign: 'right', minWidth: 36 },
  divider:     { height: 1, backgroundColor: Colors.border, marginVertical: 5 },
  tilesRow:    { flexDirection: 'row' },
  tileTouchable: { flex: 1 },
});

// ─── Stiller — Uyku Modu ─────────────────────────────────────────────────────
const sl = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 4,
  },

  // Üst başlık
  header: {
    color: Colors.textDimmer, fontSize: 11, fontWeight: '400',
    textAlign: 'center', marginBottom: 10,
  },

  // Ay ikonu — ince halka + merkez nokta, renk seçimle değişir
  moonCircle: {
    width: 54, height: 54, borderRadius: 27,
    borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
    alignSelf: 'center', marginBottom: 10,
  },
  moonDot: {
    width: 6, height: 6, borderRadius: 3,
  },

  // "Uyku modu" (büyük, seçili renkle) + saat (ayrı satır)
  modeText: { fontSize: 16, fontWeight: '600', textAlign: 'center', marginBottom: 1 },
  timeText:  { color: Colors.textPrimary, fontSize: 15, fontWeight: '400', textAlign: 'center', marginBottom: 8 },

  // AQI özet
  aqiLine: { color: Colors.textDimmer, fontSize: 12, marginBottom: 5 },

  // Fan / Orb satırları
  statRow:   { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  statLabel: { color: Colors.textDim, fontSize: 12, fontWeight: '400', width: 54 },
  statDim:   { color: Colors.textDimmer, fontSize: 11 },

  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 7 },

  // Işık rengi — DİKDÖRTGEN swatchlar (görüntüdeki gibi)
  sectionLabel: { color: Colors.textPrimary, fontSize: 14, fontWeight: '500', marginBottom: 8 },
  lightsRow:    { flexDirection: 'row', gap: 8 },
  lightSwatch: {
    flex: 1,
    height: 30,
    borderRadius: 8,
    opacity: 0.80,
  },
  lightSwatchActive: {
    opacity: 1,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.75)',
  },

  // Kutucuklar
  tilesRow: { flexDirection: 'row' },
});
