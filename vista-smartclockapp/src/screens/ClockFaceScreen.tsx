import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AqiLevel, getLevelColors, getAqiLabel } from '../theme/colors';

interface Props {
  aqi: number;
  temp: number;
  humidity: number;
  fan: number;
  level: AqiLevel;
}

function getTime() {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

function getDate() {
  const d = new Date();
  const days    = ['PAZ', 'PZT', 'SAL', 'ÇAR', 'PER', 'CUM', 'CMT'];
  const months  = ['OCA', 'ŞUB', 'MAR', 'NİS', 'MAY', 'HAZ', 'TEM', 'AĞU', 'EYL', 'EKİ', 'KAS', 'ARA'];
  return `${days[d.getDay()]}  ${d.getDate()} ${months[d.getMonth()]}`;
}

// Küçük dairesel komplikasyon
function CircleComp({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color?: string;
}) {
  return (
    <View style={[cc.wrap, color ? { borderColor: color + '70' } : {}]}>
      <Text style={[cc.value, color ? { color } : {}]}>{value}</Text>
      <Text style={cc.label}>{label}</Text>
    </View>
  );
}

const cc = StyleSheet.create({
  wrap: {
    width: 38, height: 38, borderRadius: 19,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },
  value: { color: '#fff', fontSize: 11, fontWeight: '600', lineHeight: 13 },
  label: { color: 'rgba(255,255,255,0.40)', fontSize: 7, fontWeight: '500', marginTop: 1 },
});

// Küçük dikdörtgen komplikasyon
function RectComp({
  top,
  bottom,
  color,
  fill,
}: {
  top: string;
  bottom: string;
  color?: string;
  fill?: number; // 0-1 arası doluluk oranı (fan çubuğu için)
}) {
  return (
    <View style={rc.wrap}>
      <Text style={[rc.top, color ? { color } : {}]}>{top}</Text>
      {fill !== undefined ? (
        <View style={rc.bar}>
          <View style={[rc.barFill, { width: `${Math.round(fill * 100)}%` as any, backgroundColor: color ?? '#fff' }]} />
        </View>
      ) : null}
      <Text style={rc.bottom}>{bottom}</Text>
    </View>
  );
}

const rc = StyleSheet.create({
  wrap: {
    flex: 1, height: 32,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.07)',
    paddingHorizontal: 7, paddingVertical: 4,
    justifyContent: 'space-between',
  },
  top:    { color: '#fff', fontSize: 11, fontWeight: '600' },
  bottom: { color: 'rgba(255,255,255,0.40)', fontSize: 7, fontWeight: '500' },
  bar: {
    height: 2, borderRadius: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
  },
  barFill: { height: 2, borderRadius: 1 },
});

export function ClockFaceScreen({ aqi, temp, humidity, fan, level }: Props) {
  const [time, setTime] = useState(getTime());
  const [date, setDate] = useState(getDate());
  const { accent } = getLevelColors(level);

  useEffect(() => {
    const id = setInterval(() => {
      setTime(getTime());
      setDate(getDate());
    }, 10_000);
    return () => clearInterval(id);
  }, []);

  return (
    <View style={cf.root}>
      {/* Üst komplikasyon satırı */}
      <View style={cf.topRow}>
        <CircleComp value={String(aqi)} label="AQI" color={accent} />

        <View style={cf.dateWrap}>
          <Text style={cf.dateText}>{date}</Text>
        </View>

        <CircleComp value={`${temp}°`} label="SICAK" />
      </View>

      {/* Büyük saat */}
      <Text style={cf.time}>{time}</Text>

      {/* Durum çizgisi */}
      <Text style={[cf.status, { color: accent }]}>
        {getAqiLabel(aqi, level)}
      </Text>

      {/* Alt komplikasyon satırı */}
      <View style={cf.bottomRow}>
        <RectComp top={`Fan ${fan}`} bottom="VISTA" color={accent} fill={fan / 5} />
        <View style={{ width: 6 }} />
        <RectComp top={`${humidity}%`} bottom="NEM" />
      </View>

      {/* Swipe ipucu */}
      <View style={cf.swipeHint}>
        <View style={cf.swipeLine} />
      </View>
    </View>
  );
}

const cf = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
    justifyContent: 'space-between',
  },

  // Üst satır
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateWrap: {
    flex: 1, alignItems: 'center',
  },
  dateText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 1,
  },

  // Saat
  time: {
    color: '#ffffff',
    fontSize: 60,
    fontWeight: '100',
    textAlign: 'center',
    letterSpacing: -1,
    marginVertical: -4,
  },

  // AQI durum
  status: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: 4,
  },

  // Alt satır
  bottomRow: {
    flexDirection: 'row',
  },

  // Aşağı kaydır ipucu
  swipeHint: {
    alignItems: 'center',
    marginTop: 2,
  },
  swipeLine: {
    width: 28, height: 2, borderRadius: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
});
