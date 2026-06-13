import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

export type FilterState = 'healthy' | 'warning' | 'empty' | 'reset';

interface Props {
  view: FilterState;
  onBack: () => void;
}

// ─── Dot-ring bileşeni (trigonometrik yerleşim) ───────────────────────────────
const SZ       = 84;   // kapsayıcı boyutu
const R        = 34;   // nokta merkezlerinin yarıçapı
const DOT_SZ   = 5.5; // her noktanın çapı
const N_DOTS   = 40;   // çevredeki toplam nokta sayısı
const CX       = SZ / 2;
const DIM_DOT  = 'rgba(237,232,223,0.14)';

function FilterRing({ pct, color, check }: { pct: number; color: string; check?: boolean }) {
  return (
    <View style={{ width: SZ, height: SZ }}>
      {/* Çevre noktaları — saat 12'den başlayıp saat yönünde */}
      {Array.from({ length: N_DOTS }).map((_, i) => {
        const angle  = (i / N_DOTS) * 2 * Math.PI - Math.PI / 2;
        const left   = CX + R * Math.cos(angle) - DOT_SZ / 2;
        const top    = CX + R * Math.sin(angle) - DOT_SZ / 2;
        const filled = i / N_DOTS < pct / 100;
        return (
          <View
            key={i}
            style={{
              position: 'absolute', left, top,
              width: DOT_SZ, height: DOT_SZ,
              borderRadius: DOT_SZ / 2,
              backgroundColor: filled ? color : DIM_DOT,
            }}
          />
        );
      })}

      {/* Merkez içerik */}
      <View style={{
        position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
        alignItems: 'center', justifyContent: 'center',
      }}>
        {check ? (
          <Text style={{ color, fontSize: 27, lineHeight: 30 }}>✓</Text>
        ) : (
          <>
            <Text style={{ color, fontSize: 19, fontWeight: '700', lineHeight: 22 }}>{pct}%</Text>
            <Text style={{ color: Colors.textDimmer, fontSize: 9, marginTop: 1 }}>kalan</Text>
          </>
        )}
      </View>
    </View>
  );
}

// ─── Filtre çubuğu ────────────────────────────────────────────────────────────
function FilterBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <View style={fb.row}>
      <Text style={fb.label}>{label}</Text>
      <View style={fb.track}>
        <View style={[fb.fill, { width: `${pct}%` as any, backgroundColor: color }]} />
      </View>
      <Text style={[fb.pct, { color }]}>{pct}%</Text>
    </View>
  );
}
const fb = StyleSheet.create({
  row:   { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 6 },
  label: { color: Colors.textDim, fontSize: 10, width: 66 },
  track: { flex: 1, height: 4, borderRadius: 2, backgroundColor: 'rgba(237,232,223,0.10)', overflow: 'hidden' },
  fill:  { height: '100%', borderRadius: 2 },
  pct:   { fontSize: 10, textAlign: 'right', width: 30 },
});

// ─── Ortak CTA butonu ─────────────────────────────────────────────────────────
function CtaButton({ label, onPress }: { label: string; onPress?: () => void }) {
  return (
    <TouchableOpacity
      style={styles.ctaBtn}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.ctaBtnText}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Ekran 1: Filtre sağlıklı ────────────────────────────────────────────────
function HealthyView() {
  return (
    <View style={[styles.base, { backgroundColor: Colors.bgGood }]}>
      <View style={styles.upper}>
        <FilterRing pct={87} color={Colors.greenText} />
        <Text style={[styles.stateTitle, { color: Colors.greenText }]}>Filtre sağlıklı</Text>
      </View>
      <View style={styles.lower}>
        <FilterBar label="HEPA H13"     pct={87} color={Colors.greenText} />
        <FilterBar label="Aktif karbon" pct={72} color={Colors.greenText} />
        <FilterBar label="Ön filtre"    pct={45} color={Colors.coralText} />
        <Text style={styles.hint}>~4 ay kaldı tahmini</Text>
      </View>
    </View>
  );
}

// ─── Ekran 2: Filtre uyarısı ──────────────────────────────────────────────────
function WarningView() {
  return (
    <View style={[styles.base, { backgroundColor: Colors.bgModerate }]}>
      <View style={styles.upper}>
        <FilterRing pct={22} color={Colors.amberText} />
        <Text style={[styles.stateTitle, { color: Colors.amberText }]}>Filtre azalıyor</Text>
        <Text style={[styles.subText, { color: Colors.amberText }]}>~18 gün kaldı</Text>
        <Text style={styles.subDim}>Ada için H13 gerekli</Text>
      </View>
      <View style={styles.lower}>
        <CtaButton label="Sipariş ver" />
      </View>
    </View>
  );
}

// ─── Ekran 3: Filtre tükendi ─────────────────────────────────────────────────
function EmptyView() {
  return (
    <View style={[styles.base, { backgroundColor: Colors.bgBad }]}>
      <View style={styles.upper}>
        <FilterRing pct={5} color={Colors.coralText} />
        <Text style={[styles.stateTitle, { color: Colors.coralText }]}>Filtre tükendi!</Text>
        <Text style={styles.subDim}>
          Ada'nın sağlığı için{'\n'}hemen değiştirin
        </Text>
      </View>
      <View style={styles.lower}>
        <CtaButton label="Hemen sipariş" />
      </View>
    </View>
  );
}

// ─── Ekran 4: Sıfırlama onayı ────────────────────────────────────────────────
function ResetView({ onBack }: { onBack: () => void }) {
  return (
    <View style={[styles.base, { backgroundColor: Colors.bgGood }]}>
      <View style={styles.upper}>
        <FilterRing pct={100} color={Colors.greenText} check />
        <Text style={styles.stateTitle}>Filtre sıfırlandı!</Text>
        <Text style={styles.subDim}>HEPA H13 · Yeni filtre{'\n'}Ada profili güncellendi</Text>
      </View>
      <View style={styles.lower}>
        <FilterBar label="HEPA H13" pct={100} color={Colors.greenText} />
        <CtaButton label="Ana ekrana dön" onPress={onBack} />
      </View>
    </View>
  );
}

// ─── Dışa açık bileşen ───────────────────────────────────────────────────────
export function FilterScreen({ view, onBack }: Props) {
  if (view === 'healthy') return <HealthyView />;
  if (view === 'warning') return <WarningView />;
  if (view === 'empty')   return <EmptyView />;
  return <ResetView onBack={onBack} />;
}

// ─── Stiller ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  base: { flex: 1, paddingHorizontal: 14 },

  // Halka + yazı — dikey ortada
  upper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 10,
  },

  // Barlar + buton — alt kısım
  lower: {
    paddingBottom: 14,
    gap: 10,
  },

  stateTitle: {
    color: Colors.textPrimary,
    fontSize: 17, fontWeight: '600',
    textAlign: 'center',
  },
  subText: {
    fontSize: 13, fontWeight: '500',
    textAlign: 'center',
  },
  subDim: {
    color: Colors.textDimmer,
    fontSize: 11, textAlign: 'center', lineHeight: 15,
  },
  hint: {
    color: Colors.textDimmer, fontSize: 10,
    textAlign: 'center', marginTop: 2,
  },

  // CTA butonu — koyu coral
  ctaBtn: {
    paddingVertical: 7, borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#e0776032',
    borderWidth: 0.5, borderColor: '#e077607d',
  },
  ctaBtnText: {
    color: Colors.coralText, fontSize: 14, fontWeight: '600',
  },
});
