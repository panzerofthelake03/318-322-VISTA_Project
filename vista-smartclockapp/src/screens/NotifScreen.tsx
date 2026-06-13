import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Animated, Vibration,
} from 'react-native';
import * as Speech from 'expo-speech';
import { Colors } from '../theme/colors';

export type NotifView = 'pm25' | 'co2' | 'center';

interface Props {
  view: NotifView;
  onBack: () => void;
  onAction?: (action: 'maxPower' | 'ventilate' | 'filter') => void;
}

const CENTER_NOTIFS = [
  {
    title: 'PM2.5 alarm · Ada',
    detail: '14:32 · 24µg · Max güce geçildi',
    link: 'Cihazı kontrol et →',
    titleColor: Colors.coralText,
    bg: 'rgba(224,120,96,0.13)',
    border: 'rgba(224,120,96,0.24)',
  },
  {
    title: 'Sabah raporu',
    detail: '08:00 · Gece boyunca temiz · AQI 28',
    titleColor: Colors.greenText,
    bg: 'rgba(111,207,154,0.13)',
    border: 'rgba(111,207,154,0.24)',
  },
  {
    title: 'Filtre bildirimi',
    detail: 'Ön filtre %45 · yakında sipariş',
    titleColor: Colors.textPrimary,
    bg: 'rgba(237,232,223,0.06)',
    border: 'rgba(237,232,223,0.12)',
  },
];

// ─── PM2.5 Alarmı — yanıp sönen kırmızı ışık + ses ──────────────────────────
function Pm25View({ onAction, onDismiss }: { onAction?: Props['onAction']; onDismiss: () => void }) {
  const pulse    = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Yanıp sönen kırmızı overlay
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.55, duration: 500, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.05, duration: 700, useNativeDriver: true }),
      ])
    );
    anim.start();

    // Tekrarlayan alarm titreşimi
    Vibration.vibrate([450, 200, 450, 200, 450], true);

    // Sesli alarm — expo-speech ile TTS
    const speak = () => {
      Speech.speak('PM 2.5 alarm! Acil durum!', {
        language: 'tr-TR',
        rate: 0.85,
        pitch: 1.1,
      });
    };
    speak();
    timerRef.current = setInterval(async () => {
      const isSpeaking = await Speech.isSpeakingAsync();
      if (!isSpeaking) speak();
    }, 3500);

    return () => {
      anim.stop();
      Vibration.cancel();
      if (timerRef.current) clearInterval(timerRef.current);
      Speech.stop();
    };
  }, []);

  return (
    <View style={[styles.base, { backgroundColor: '#1e0c08' }]}>
      {/* Yanıp sönen kırmızı ışık katmanı */}
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: '#C01A10', opacity: pulse },
        ]}
      />

      <View style={styles.alarmBody}>
        <View style={[styles.iconRing, { borderColor: 'rgba(224,120,96,0.55)' }]}>
          <Text style={[styles.iconSymbol, { color: Colors.coralText }]}>⚠</Text>
        </View>
        <Text style={styles.alarmTitle}>PM2.5 yüksek!</Text>
        <Text style={styles.alarmDesc}>
          Ada'nın odasında toz seviyesi{'\n'}eşik değeri aştı (24µg)
        </Text>
        <View style={styles.btnSpacer} />
        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: 'rgba(184, 64, 48, 0.33)' }]}
          onPress={() => onAction?.('maxPower')}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryBtnText}>Max güce geç</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn} onPress={onDismiss} activeOpacity={0.7}>
          <Text style={styles.secondaryBtnText}>Yoksay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── CO₂ Uyarısı ─────────────────────────────────────────────────────────────
function Co2View({ onAction, onDismiss }: { onAction?: Props['onAction']; onDismiss: () => void }) {
  return (
    <View style={[styles.base, { backgroundColor: '#1a160a' }]}>
      <View style={styles.alarmBody}>
        <View style={[styles.iconRing, { borderColor: 'rgba(245,200,122,0.55)' }]}>
          <Text style={[styles.iconSymbol, { color: Colors.amberText, fontSize: 23, fontWeight: '600' }]}>!</Text>
        </View>
        <Text style={[styles.alarmTitle, { color: Colors.amberText }]}>CO₂ yüksek</Text>
        <Text style={styles.alarmDesc}>
          1.100 ppm{'\n'}Havalandırma önerilir
        </Text>
        <View style={styles.btnSpacer} />
        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: '#E0786029' }]}
          onPress={() => onAction?.('ventilate')}
          activeOpacity={0.8}
        >
          <Text style={[styles.primaryBtnText, { color: '#E07860' }]}>Havalandırma modu</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn} onPress={onDismiss} activeOpacity={0.7}>
          <Text style={styles.secondaryBtnText}>Pencere aç hatırlatıcısı</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Bildirim Merkezi ─────────────────────────────────────────────────────────
function CenterView() {
  return (
    <ScrollView
      style={[styles.base, { backgroundColor: Colors.bgDefault }]}
      contentContainerStyle={styles.centerContainer}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      <Text style={styles.centerTitle}>Bildirimler</Text>
      {CENTER_NOTIFS.map((n, i) => (
        <TouchableOpacity
          key={i}
          activeOpacity={0.8}
          style={[styles.notifCard, { backgroundColor: n.bg, borderColor: n.border }]}
        >
          <Text style={[styles.notifCardTitle, { color: n.titleColor }]}>{n.title}</Text>
          <Text style={styles.notifCardDetail}>{n.detail}</Text>
          {n.link && (
            <Text style={[styles.notifCardLink, { color: n.titleColor }]}>{n.link}</Text>
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

// ─── Dışa açık bileşen ───────────────────────────────────────────────────────
export function NotifScreen({ view, onBack, onAction }: Props) {
  if (view === 'pm25')   return <Pm25View   onAction={onAction} onDismiss={onBack} />;
  if (view === 'co2')    return <Co2View    onAction={onAction} onDismiss={onBack} />;
  return <CenterView />;
}

// ─── Stiller ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  base: { flex: 1 },

  // Alarm ekranları ortak
  alarmBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 7,
  },
  iconRing: {
    width: 52, height: 52, borderRadius: 26,
    borderWidth: 1.5,
    backgroundColor: '#B840301F',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 1,
    marginTop: 5,
  },
  iconSymbol: { fontSize: 21, fontWeight: '500' },

  alarmTitle: {
    color: Colors.textPrimary,
    fontSize: 17, fontWeight: '600',
    textAlign: 'center',
  },
  alarmDesc: {
    color: Colors.textDim,
    fontSize: 11, textAlign: 'center', lineHeight: 15,
  },

  btnSpacer: { height: 6 },

  primaryBtn: {
    width: '100%', paddingVertical: 9,
    borderRadius: 10, alignItems: 'center',
    marginTop: -5,
  },
  primaryBtnText: { color: '#E07860', fontSize: 14, fontWeight: '600' },

  secondaryBtn: {
    width: '100%', paddingVertical: 10,
    borderRadius: 10, alignItems: 'center',
    backgroundColor: 'rgba(237,232,223,0.07)',
    borderWidth: 1, borderColor: 'rgba(237,232,223,0.12)',
  },
  secondaryBtnText: { color: Colors.textDim, fontSize: 12 },

  // Bildirim merkezi
  centerContainer: {
    paddingHorizontal: 12, paddingTop: 14,
    paddingBottom: 10, gap: 8,
  },
  centerTitle: {
    color: Colors.textDimmer, fontSize: 15, fontWeight: '500',
    marginBottom: 2,
  },
  notifCard: {
    borderRadius: 12, padding: 11,
    borderWidth: 1, gap: 4,
  },
  notifCardTitle:  { fontSize: 14, fontWeight: '600' },
  notifCardDetail: { color: Colors.textDimmer, fontSize: 10, lineHeight: 13 },
  notifCardLink:   { fontSize: 11, fontWeight: '500', marginTop: 2 },
});
