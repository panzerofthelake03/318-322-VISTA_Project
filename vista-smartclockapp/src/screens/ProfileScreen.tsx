import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../theme/colors';

export type ProfileTab = 'genel' | 'bugun' | 'aylik';

interface Props {
  tab: ProfileTab;
  onBack: () => void;
}

function ProgressBar({ pct, color }: { pct: number; color: string }) {
  return (
    <View style={bar.track}>
      <View style={[bar.fill, { width: `${Math.min(100, pct)}%` as any, backgroundColor: color }]} />
    </View>
  );
}
const bar = StyleSheet.create({
  track: { height: 4, backgroundColor: Colors.surface, borderRadius: 2, overflow: 'hidden', flex: 1 },
  fill:  { height: '100%', borderRadius: 2 },
});

function StatBox({
  value, label, valueColor, bg, borderColor,
}: {
  value: string; label: string;
  valueColor: string; bg: string; borderColor: string;
}) {
  return (
    <View style={[statStyle.box, { backgroundColor: bg, borderColor }]}>
      <Text style={[statStyle.value, { color: valueColor }]}>{value}</Text>
      <Text style={statStyle.label}>{label}</Text>
    </View>
  );
}
const statStyle = StyleSheet.create({
  box:   { flex: 1, borderRadius: 14, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  value: { fontSize: 27, fontWeight: '600', lineHeight: 30 },
  label: { color: Colors.textDimmer, fontSize: 10, marginTop: 5, textAlign: 'center' },
});

export function ProfileScreen({ tab, onBack }: Props) {
  return (
    <View style={styles.container}>

      {/* ── Profil genel ── */}
      {tab === 'genel' && (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false} bounces={false}>
          {/* Avatar + isim */}
          <View style={styles.avatarRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>A</Text>
            </View>
            <View style={{ gap: 3 }}>
              <Text style={styles.profileName}>Ada</Text>
              <Text style={styles.profileSub}>4 yaş · bebek hassas</Text>
            </View>
          </View>

          {/* Hassasiyet profili kartı */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Hassasiyet profili</Text>
            <View style={styles.chipRow}>
              <Text style={styles.chipCoral}>Astım riski</Text>
              <Text style={styles.chipAmber}>Polen</Text>
              <Text style={styles.chipDim}>Toz</Text>
            </View>
          </View>

          {/* Ayar satırları — alt çizgisiz */}
          {[
            { label: 'HEPA seviyesi', value: 'H13',     valueColor: Colors.greenText  },
            { label: 'PM eşik',       value: '15µg',    valueColor: Colors.textPrimary },
            { label: 'CO₂ alarmı',    value: '800 ppm', valueColor: Colors.textPrimary },
          ].map((row) => (
            <View key={row.label} style={styles.settingRow}>
              <Text style={styles.settingLabel}>{row.label}</Text>
              <Text style={[styles.settingValue, { color: row.valueColor }]}>{row.value}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      {/* ── Bugün · Ada ── */}
      {tab === 'bugun' && (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Ada · bugün</Text>
          {[
            { label: 'Ort. AQI', value: '38', pct: 38, color: Colors.greenText },
            { label: 'Maks PM2.5', value: '24µg', pct: 70, color: Colors.amberText },
            { label: 'Temiz hava', value: '18s 32dk', pct: 78, color: Colors.greenText },
          ].map((m) => (
            <View key={m.label} style={styles.metricBlock}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricLabel}>{m.label}</Text>
                <Text style={[styles.metricVal, { color: m.color }]}>{m.value}</Text>
              </View>
              <ProgressBar pct={m.pct} color={m.color} />
            </View>
          ))}
          <View style={styles.messageBox}>
            <Text style={styles.messageTitle}>Bugün iyi gidiyor!</Text>
            <Text style={styles.messageSub}>Limit altında kaldı</Text>
          </View>
        </ScrollView>
      )}

      {/* ── Aylık özet ── */}
      {tab === 'aylik' && (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false} bounces={false}>
          <Text style={styles.aylikTitle}>Nisan · Ada</Text>
          <View style={{ gap: 7 }}>
            <View style={styles.statsRow}>
              <StatBox
                value="87%" label="temiz gün"
                valueColor={Colors.greenText}
                bg="rgba(111, 207, 154, 0.1)"
                borderColor="rgba(111, 207, 154, 0)"
              />
              <View style={{ width: 7 }} />
              <StatBox
                value="36" label="ort. AQI"
                valueColor={Colors.amberText}
                bg="rgba(245,200,122,0.16)"
                borderColor="rgba(245, 200, 122, 0)"
              />
            </View>
            <View style={styles.statsRow}>
              <StatBox
                value="4" label="alarm günü"
                valueColor={Colors.coralText}
                bg="rgba(224,120,96,0.16)"
                borderColor="rgba(224, 119, 96, 0)"
              />
              <View style={{ width: 7 }} />
              <StatBox
                value="312s" label="çalışma"
                valueColor={Colors.purpleText}
                bg="rgba(168,160,224,0.16)"
                borderColor="rgba(168, 160, 224, 0)"
              />
            </View>
          </View>
          <Text style={styles.improvementText}>Geçen aya göre %12 iyileşme</Text>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgDefault,
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 10,
  },
  content: { flex: 1 },
  // Avatar satırı
  avatarRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 12, marginBottom: 12,
  },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(224,120,96,0.85)',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText:  { color: '#fff', fontSize: 19, fontWeight: '600' },
  profileName: { color: Colors.textPrimary, fontSize: 18, fontWeight: '600' },
  profileSub:  { color: Colors.textDimmer, fontSize: 11 },

  // Hassasiyet kartı
  card: {
    backgroundColor: 'rgba(237,232,223,0.06)',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(237,232,223,0.10)',
    marginBottom: 10,
    gap: 7,
  },
  cardLabel:  { color: Colors.textDimmer, fontSize: 11 },
  chipRow:    { flexDirection: 'row', gap: 12, alignItems: 'center' },
  // Renkli metin etiketleri (chip kutusu yok)
  chipCoral:  { color: Colors.coralText,  fontSize: 13, fontWeight: '500' },
  chipAmber:  { color: Colors.amberText,  fontSize: 13, fontWeight: '500' },
  chipDim:    { color: Colors.textPrimary, fontSize: 13, fontWeight: '400' },

  // Ayar satırları — alt çizgi yok, geniş dikey boşluk
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  settingLabel: { color: Colors.textDimmer, fontSize: 13, fontWeight: '400' },
  settingValue: { fontSize: 14, fontWeight: '500' },
  // Bugün sekmesi
  sectionTitle:  { color: Colors.textPrimary, fontSize: 14, fontWeight: '500', marginBottom: 12 },
  metricBlock:   { marginBottom: 10, gap: 5 },
  metricHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metricLabel:   { color: Colors.textDim, fontSize: 11, fontWeight: '400' },
  metricVal:     { fontSize: 11, fontWeight: '500' },
  messageBox: {
    backgroundColor: 'rgba(74, 158, 115, 0.05)',
    borderRadius: 8, padding: 10, borderWidth: 1,
    borderColor: 'rgba(74, 158, 115, 0.04)',
    marginTop: 4, alignItems: 'center', gap: 3,
  },
  messageTitle: { color: Colors.greenText, fontSize: 14, fontWeight: '500' },
  messageSub:   { color: Colors.textDimmer, fontSize: 10 },

  // Aylık özet sekmesi
  aylikTitle: {
    color: Colors.textPrimary, fontSize: 18, fontWeight: '500',
    textAlign: 'center', marginBottom: 8,
  },
  statsRow: { flexDirection: 'row' },
  improvementText: {
    color: Colors.greenText, fontSize: 11, fontWeight: '500',
    textAlign: 'center', marginTop: 4.5,
  },
});
