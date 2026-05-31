import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fontSize, fontWeight, radius, spacing } from '../theme';
import { weeklyPM25, weeklyHumidity } from '../data/mockDevice';

type Tab = 'pm25' | 'humidity';

const MAX_PM25 = 75;
const MAX_HUMIDITY = 100;

export function StatisticsScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('pm25');

  const data = activeTab === 'pm25' ? weeklyPM25 : weeklyHumidity;
  const maxVal = activeTab === 'pm25' ? MAX_PM25 : MAX_HUMIDITY;
  const unit = activeTab === 'pm25' ? 'μg/m³' : '%';
  const label = activeTab === 'pm25' ? 'PM2.5' : 'Nem';

  const avg = Math.round(data.reduce((s, d) => s + d.value, 0) / data.length);
  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));

  const barColor = (val: number) => {
    if (activeTab === 'pm25') {
      return val <= 12 ? colors.green : val <= 35 ? colors.amber : colors.red;
    }
    return val <= 40 || val >= 70 ? colors.amber : colors.green;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>İstatistik</Text>
        <Text style={styles.subtitle}>Son 7 günlük çevre verileri</Text>

        {/* Tab seçici */}
        <View style={styles.tabs}>
          {(['pm25', 'humidity'] as Tab[]).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tab, activeTab === t && styles.tabActive]}
              onPress={() => setActiveTab(t)}
            >
              <Text style={[styles.tabLabel, activeTab === t && styles.tabLabelActive]}>
                {t === 'pm25' ? 'PM2.5' : 'Nem'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Özet kartlar */}
        <View style={styles.summaryRow}>
          <SummaryCard title="Ortalama" value={`${avg}`} unit={unit} color={barColor(avg)} />
          <SummaryCard title="En yüksek" value={`${max}`} unit={unit} color={colors.red} />
          <SummaryCard title="En düşük" value={`${min}`} unit={unit} color={colors.green} />
        </View>

        {/* Bar grafik */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>{label} — Haftalık grafik</Text>
          <View style={styles.chart}>
            {data.map((d) => {
              const heightPct = (d.value / maxVal) * 100;
              return (
                <View key={d.day} style={styles.barCol}>
                  <Text style={styles.barValue}>{d.value}</Text>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.bar,
                        { height: `${Math.min(heightPct, 100)}%`, backgroundColor: barColor(d.value) },
                      ]}
                    />
                  </View>
                  <Text style={styles.barDay}>{d.day}</Text>
                </View>
              );
            })}
          </View>

          {/* Renk efsanesi */}
          <View style={styles.legend}>
            <LegendItem color={colors.green} label={activeTab === 'pm25' ? 'İyi (≤12)' : 'Normal (40–70%)'} />
            <LegendItem color={colors.amber} label={activeTab === 'pm25' ? 'Orta (12–35)' : 'Düşük/Yüksek'} />
            <LegendItem color={colors.red} label={activeTab === 'pm25' ? 'Kötü (>35)' : '—'} />
          </View>
        </View>

        {/* Hava kalitesi referansı */}
        {activeTab === 'pm25' && (
          <View style={styles.referenceCard}>
            <Text style={styles.referenceTitle}>PM2.5 referans değerleri</Text>
            <ReferenceRow color={colors.green} range="0–12 μg/m³" label="İyi" />
            <ReferenceRow color={colors.amber} range="12–35 μg/m³" label="Orta" />
            <ReferenceRow color={colors.red} range=">35 μg/m³" label="Sağlıksız" />
            <Text style={styles.referenceNote}>
              Ada'nın PM2.5 eşiği: 10 μg/m³ (hassas profil)
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function SummaryCard({ title, value, unit, color }: { title: string; value: string; unit: string; color: string }) {
  return (
    <View style={[summaryStyles.card, { borderTopColor: color }]}>
      <Text style={summaryStyles.cardTitle}>{title}</Text>
      <Text style={[summaryStyles.cardValue, { color }]}>{value}</Text>
      <Text style={summaryStyles.cardUnit}>{unit}</Text>
    </View>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <View style={legendStyles.row}>
      <View style={[legendStyles.dot, { backgroundColor: color }]} />
      <Text style={legendStyles.label}>{label}</Text>
    </View>
  );
}

function ReferenceRow({ color, range, label }: { color: string; range: string; label: string }) {
  return (
    <View style={refStyles.row}>
      <View style={[refStyles.dot, { backgroundColor: color }]} />
      <Text style={refStyles.range}>{range}</Text>
      <Text style={[refStyles.label, { color }]}>{label}</Text>
    </View>
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
  title: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.textPrimary },
  subtitle: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: -spacing.sm },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.border,
    borderRadius: radius.md,
    padding: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: radius.sm,
  },
  tabActive: { backgroundColor: colors.white },
  tabLabel: { fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: colors.textSecondary },
  tabLabelActive: { color: colors.coral, fontWeight: fontWeight.semiBold },
  summaryRow: { flexDirection: 'row', gap: spacing.sm },
  chartCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  chartTitle: { fontSize: fontSize.md, fontWeight: fontWeight.semiBold, color: colors.textPrimary },
  chart: { flexDirection: 'row', alignItems: 'flex-end', height: 160, gap: spacing.xs },
  barCol: { flex: 1, alignItems: 'center', gap: spacing.xs, height: '100%', justifyContent: 'flex-end' },
  barValue: { fontSize: 10, color: colors.textSecondary, textAlign: 'center' },
  barTrack: { flex: 1, width: '70%', justifyContent: 'flex-end' },
  bar: { width: '100%', borderRadius: radius.sm, minHeight: 4 },
  barDay: { fontSize: fontSize.xs, color: colors.textSecondary, textAlign: 'center' },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  referenceCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.xl,
    gap: spacing.md,
  },
  referenceTitle: { fontSize: fontSize.md, fontWeight: fontWeight.semiBold, color: colors.textPrimary },
  referenceNote: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: spacing.xs },
});

const summaryStyles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
    borderTopWidth: 3,
    alignItems: 'center',
    gap: 2,
  },
  cardTitle: { fontSize: fontSize.xs, color: colors.textSecondary },
  cardValue: { fontSize: fontSize.xl, fontWeight: fontWeight.bold },
  cardUnit: { fontSize: fontSize.xs, color: colors.textSecondary },
});

const legendStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  dot: { width: 8, height: 8, borderRadius: 4 },
  label: { fontSize: fontSize.xs, color: colors.textSecondary },
});

const refStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  dot: { width: 10, height: 10, borderRadius: 5 },
  range: { flex: 1, fontSize: fontSize.sm, color: colors.textPrimary },
  label: { fontSize: fontSize.sm, fontWeight: fontWeight.semiBold },
});
