import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  NativeSyntheticEvent, NativeScrollEvent, Animated, Vibration, Image,
} from 'react-native';
import { Colors } from '../theme/colors';

const LOGO      = require('../../assets/vista-logo.png');
const WORDMARK  = require('../../assets/vista-wordmark.png');

interface Props {
  onDone: () => void;
}

// Dots çubuğunun sabit yüksekliği — ScrollView bu kadar daha kısa olur
const DOTS_BAR_H = 30;

// ─── Pagination dots — OnboardingScreen içinde SABİT render edilir ────────────
function Dots({ active }: { active: number }) {
  return (
    <View style={ds.row}>
      {[0, 1, 2, 3].map((i) => (
        <View key={i} style={[ds.dot, i === active && ds.dotActive]} />
      ))}
    </View>
  );
}
const ds = StyleSheet.create({
  row: { flexDirection: 'row', gap: 6, justifyContent: 'center' },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: 'rgba(237,232,223,0.18)' },
  dotActive: { backgroundColor: Colors.coralText },
});

// ─── Adım 0 · Karşılama ───────────────────────────────────────────────────────
function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <View style={s.page}>
      <View style={s.flex2} />

      <Image source={LOGO} style={s.logoImg} resizeMode="contain" />
      <Image source={WORDMARK} style={s.wordmarkImg} resizeMode="contain" />
      <Text style={s.brandSub}>Temiz hava, güvenli büyüme</Text>

      <View style={s.flex4} />

      <TouchableOpacity style={s.startBtn} onPress={onNext} activeOpacity={0.75}>
        <Text style={s.startBtnText}>Başla →</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Adım 1 · Bağlanıyor ──────────────────────────────────────────────────────
function SignalIcon({ color = 'rgba(237,232,223,0.45)' }: { color?: string }) {
  return (
    <View style={sig.wrap}>
      <View style={[sig.dot, { backgroundColor: color }]} />
      <View style={[sig.arc, { width: 10, height: 6, borderTopLeftRadius: 8, borderTopRightRadius: 8, borderColor: color }]} />
      <View style={[sig.arc, { width: 18, height: 10, borderTopLeftRadius: 14, borderTopRightRadius: 14, borderColor: color }]} />
    </View>
  );
}
const sig = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 3 },
  dot:  { width: 4, height: 4, borderRadius: 2 },
  arc:  { borderTopWidth: 1.5, borderLeftWidth: 1.5, borderRightWidth: 1.5, borderBottomWidth: 0, backgroundColor: 'transparent' },
});

function PairingStep({ onNext, isActive }: { onNext: () => void; isActive: boolean }) {
  const [phase, setPhase] = useState<'connecting' | 'connected'>('connecting');

  const rippleAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    if (!isActive) {
      setPhase('connecting');
      rippleAnims.forEach((a) => a.setValue(0));
      return;
    }

    const loops = rippleAnims.map((a) => {
      a.setValue(0);
      return Animated.loop(
        Animated.timing(a, { toValue: 1, duration: 1800, useNativeDriver: true })
      );
    });
    loops[0].start();
    const t1 = setTimeout(() => loops[1].start(), 600);
    const t2 = setTimeout(() => loops[2].start(), 1200);

    const tConn = setTimeout(() => {
      loops.forEach((l) => l.stop());
      rippleAnims.forEach((a) => a.setValue(0));
      setPhase('connected');
      Vibration.vibrate([0, 120, 80, 180]);
    }, 2600);

    const tNext = setTimeout(onNext, 3600);

    return () => {
      [t1, t2, tConn, tNext].forEach(clearTimeout);
      loops.forEach((l) => l.stop());
      rippleAnims.forEach((a) => a.setValue(0));
      setPhase('connecting');
    };
  }, [isActive]);

  const connected = phase === 'connected';
  const outerBorderColor = connected ? 'rgba(111,207,154,0.55)' : 'rgba(237,232,223,0.22)';
  const innerBorderColor = connected ? 'rgba(111,207,154,0.30)' : 'rgba(237,232,223,0.14)';
  const rippleColor      = connected ? Colors.greenBorder        : 'rgba(237,232,223,0.35)';

  return (
    <View style={s.page}>
      <View style={s.flex1} />

      <View style={s.pairIconWrap}>
        {rippleAnims.map((anim, i) => (
          <Animated.View
            key={i}
            style={[
              s.ripple,
              {
                borderColor: rippleColor,
                transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 2.8] }) }],
                opacity:    anim.interpolate({ inputRange: [0, 0.25, 1], outputRange: [0.45, 0.20, 0] }),
              },
            ]}
          />
        ))}
        <View style={[s.pairOuterRing, { borderColor: outerBorderColor }]}>
          <View style={[s.pairInnerRing, { borderColor: innerBorderColor }]}>
            {connected
              ? <Text style={{ color: Colors.greenText, fontSize: 19 }}>✓</Text>
              : <SignalIcon />}
          </View>
        </View>
      </View>

      <Text style={[s.pairTitle, connected && { color: Colors.greenText }]}>
        {connected ? 'Bağlandı!' : 'Bağlanıyor...'}
      </Text>
      {connected ? (
        <Text style={s.dimText}>VISTA cihazı hazır</Text>
      ) : (
        <>
          <Text style={s.dimText}>VISTA cihazınızı</Text>
          <Text style={s.dimText}>telefona yaklaştırın</Text>
        </>
      )}
      <View style={s.chip}>
        <View style={[s.chipDot, connected && { backgroundColor: Colors.greenText }]} />
        <Text style={s.chipText}>Çocuk Odası</Text>
      </View>

      <View style={s.flex1} />
    </View>
  );
}

// ─── Adım 2 · Profil seç ─────────────────────────────────────────────────────
function ProfileStep({ onNext }: { onNext: () => void }) {
  return (
    <View style={s.page}>
      <Text style={s.sectionLabel}>Kim için?</Text>

      <TouchableOpacity style={s.profileRowSelected} onPress={onNext} activeOpacity={0.7}>
        <View style={s.avatarCoral}>
          <Text style={s.avatarTextCoral}>A</Text>
        </View>
        <View style={s.flex1}>
          <Text style={s.profileNameCoral}>Ada · 4 yaş</Text>
          <Text style={s.profileDetailCoral}>Bebek hassas · astım</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={s.profileRow} onPress={onNext} activeOpacity={0.7}>
        <View style={s.avatarGreen}>
          <Text style={s.avatarTextGreen}>K</Text>
        </View>
        <View style={s.flex1}>
          <Text style={s.profileNameDim}>Kerem · 8 yaş</Text>
          <Text style={s.profileDetailDim}>Standart · alerji yok</Text>
        </View>
      </TouchableOpacity>

      <View style={s.addRow}>
        <View style={s.addIcon}>
          <Text style={s.addIconText}>+</Text>
        </View>
        <Text style={s.addText}>Profil ekle</Text>
      </View>

      <View style={s.flex1} />
    </View>
  );
}

// ─── Adım 3 · Hazır! — 2.5 sn sonra otomatik ana ekrana geçer ────────────────
function ReadyStep({ onDone, isActive }: { onDone: () => void; isActive: boolean }) {
  useEffect(() => {
    if (!isActive) return;
    const t = setTimeout(onDone, 1500);
    return () => clearTimeout(t);
  }, [isActive]);

  return (
    <TouchableOpacity style={s.page} activeOpacity={0.9} onPress={onDone}>
      <View style={s.flex1} />

      <View style={s.checkCircle}>
        <Text style={s.checkMark}>✓</Text>
      </View>

      <Text style={s.readyTitle}>Hazır!</Text>
      <Text style={s.readySub}>Ada için özel filtre aktif</Text>
      <Text style={s.readyTags}>{'Bebek modu\nHEPA H12\nPM1.0'}</Text>

      <View style={s.flex1} />
    </TouchableOpacity>
  );
}

// ─── Ana bileşen ──────────────────────────────────────────────────────────────
export function OnboardingScreen({ onDone }: Props) {
  const [step, setStep] = useState(0);
  const [dims, setDims] = useState({ width: 0, height: 0 });
  const scrollRef = useRef<ScrollView>(null);

  function goToPage(page: number) {
    if (!dims.width) return;
    scrollRef.current?.scrollTo({ x: page * dims.width, animated: true });
    setStep(page);
  }

  function onMomentumEnd(e: NativeSyntheticEvent<NativeScrollEvent>) {
    if (!dims.width) return;
    const page = Math.round(e.nativeEvent.contentOffset.x / dims.width);
    setStep(page);
  }

  const W = dims.width;
  // Sayfa yüksekliği = toplam yükseklik eksi sabit dots çubuğu
  const pageH = dims.height - DOTS_BAR_H;

  return (
    <View
      style={{ flex: 1, backgroundColor: Colors.bgDefault }}
      onLayout={(e) => setDims(e.nativeEvent.layout)}
    >
      {W > 0 && (
        <>
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            bounces={false}
            onMomentumScrollEnd={onMomentumEnd}
            // ScrollView, dots çubuğu kadar kısa — dots kaydetmez
            style={{ height: pageH }}
          >
            <View style={{ width: W, height: pageH }}>
              <WelcomeStep onNext={() => goToPage(1)} />
            </View>
            <View style={{ width: W, height: pageH }}>
              <PairingStep onNext={() => goToPage(2)} isActive={step === 1} />
            </View>
            <View style={{ width: W, height: pageH }}>
              <ProfileStep onNext={() => goToPage(3)} />
            </View>
            <View style={{ width: W, height: pageH }}>
              <ReadyStep onDone={onDone} isActive={step === 3} />
            </View>
          </ScrollView>

          {/* Sabit dots çubuğu — ScrollView'ın dışında, hiç kaymaz */}
          <View style={s.dotsBar}>
            <Dots active={step} />
          </View>
        </>
      )}
    </View>
  );
}

// ─── Stiller ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: Colors.bgDefault,
    alignItems: 'center',
    paddingHorizontal: 11,
  },
  flex1:  { flex: 1 },
  flex2:  { flex: 2 },
  flex4:  { flex: 4 },

  // Sabit dots çubuğu
  dotsBar: {
    height: DOTS_BAR_H,
    backgroundColor: Colors.bgDefault,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Karşılama
  logoImg: {
    width: 72, height: 72, marginBottom: -19,
  },
  wordmarkImg: {
    width: 200, height: 72,
    marginTop: 6,
  },
  brandSub: { color: Colors.textDimmer, fontSize: 10, marginTop: -24, marginBottom: 12, textAlign: 'center' },

  startBtn: {
    width: '100%', paddingVertical: 6, borderRadius: 11,
    borderWidth: 1, borderColor: 'rgba(224,120,96,0.55)',
    backgroundColor: 'rgba(224,120,96,0.08)',
    alignItems: 'center',
  },
  startBtnText: { color: Colors.coralText, fontSize: 15, fontWeight: '400' },

  // Bağlanıyor
  pairIconWrap: {
    width: 68, height: 68,
    alignItems: 'center', justifyContent: 'center',
  },
  ripple: {
    position: 'absolute',
    width: 68, height: 68, borderRadius: 34,
    borderWidth: 1,
  },
  pairOuterRing: {
    width: 68, height: 68, borderRadius: 34,
    borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  pairInnerRing: {
    width: 54, height: 54, borderRadius: 27,
    borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  pairTitle: { color: Colors.textPrimary, fontSize: 15, fontWeight: '400', marginTop: 10, marginBottom: 3 },
  dimText:   { color: Colors.textDimmer, fontSize: 11, lineHeight: 15 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 10,
    backgroundColor: '#E0786012', borderRadius: 10,
    paddingHorizontal: 26, paddingVertical: 5,
  },
  chipDot:  { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.coralText },
  chipText: { color: 'rgba(237,232,223,0.45)', fontSize: 13 },

  // Profil seçimi
  sectionLabel: {
    color: Colors.textDimmer, fontSize: 11,
    alignSelf: 'flex-start', marginTop: 12, marginBottom: 8,
  },
  profileRowSelected: {
    width: '100%', flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: 'rgba(224,120,96,0.10)', borderRadius: 8,
    padding: 8, marginBottom: 5,
    borderWidth: 1, borderColor: 'rgba(224,120,96,0.30)',
  },
  profileRow: {
    width: '100%', flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: 'rgba(237,232,223,0.05)', borderRadius: 8,
    padding: 8, marginBottom: 5,
    borderWidth: 1, borderColor: 'rgba(237,232,223,0.10)',
  },
  avatarCoral: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: 'rgba(224,120,96,0.18)',
    borderWidth: 1, borderColor: Colors.coralBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarTextCoral: { color: Colors.coralText, fontSize: 12, fontWeight: '500' },
  avatarGreen: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: 'rgba(111,207,154,0.12)',
    borderWidth: 1, borderColor: Colors.greenBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarTextGreen:    { color: Colors.greenText, fontSize: 12, fontWeight: '500' },
  profileNameCoral:   { color: Colors.coralText,         fontSize: 13 },
  profileDetailCoral: { color: 'rgba(224,120,96,0.50)',   fontSize: 11, marginTop: 1 },
  profileNameDim:     { color: 'rgba(237,232,223,0.48)',  fontSize: 13 },
  profileDetailDim:   { color: 'rgba(237,232,223,0.25)',  fontSize: 11, marginTop: 1 },
  addRow: {
    width: '100%', flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: 'rgba(237, 232, 223, 0.03)', borderRadius: 8,
    padding: 8, borderWidth: 1, borderColor: 'rgba(237,232,223,0.08)', borderStyle: 'dashed',
  },
  addIcon: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 1, borderColor: 'rgba(237,232,223,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },
  addIconText: { color: 'rgba(237,232,223,0.18)', fontSize: 15, lineHeight: 18 },
  addText:     { color: 'rgba(237,232,223,0.18)', fontSize: 11 },

  // Hazır!
  checkCircle: {
    width: 50, height: 50, borderRadius: 25,
    borderWidth: 2, borderColor: Colors.greenBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  checkMark:  { color: Colors.greenText, fontSize: 23 },
  readyTitle: { color: Colors.textPrimary, fontSize: 15, marginTop: 10, marginBottom: 4 },
  readySub:   { color: Colors.textDimmer,  fontSize: 11, textAlign: 'center' },
  readyTags:  { color: 'rgba(224,120,96,0.70)', fontSize: 13, textAlign: 'center', lineHeight: 18, marginTop: 10 },
});
