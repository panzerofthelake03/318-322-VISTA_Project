import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import Svg, { Polyline, Polygon, Line as SvgLine, Circle } from 'react-native-svg';
import { weeklyAQI, monthlyAQI, hourlyPM25 } from '../../data/mockDevice';
import { useTranslation } from '../../i18n';
import { colors, spacing, fontSize, fontWeight, radius } from '../../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - spacing.lg * 2;
const BAR_CHART_HEIGHT = 170;
const LINE_CHART_HEIGHT = 150;

type AQIDatum = { day: string; value: number };

function getBarColor(value: number): { fill: string; cap: string } {
  if (value > 100) return { fill: colors.redLight, cap: colors.red };
  if (value > 50) return { fill: colors.amberLight, cap: colors.amber };
  return { fill: colors.greenLight, cap: colors.green };
}

function BarChart({ data }: { data: AQIDatum[] }) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <View style={barStyles.container}>
      <View style={barStyles.barsRow}>
        {data.map((item) => {
          const isPeak = item.value === maxValue;
          const barHeight = Math.max(
            8,
            (item.value / maxValue) * BAR_CHART_HEIGHT
          );
          const { fill, cap } = getBarColor(item.value);

          return (
            <View key={item.day} style={barStyles.barColumn}>
              <View style={barStyles.barTrack}>
                <Text style={[barStyles.valueLabel, isPeak && { color: cap }]}>
                  {item.value}
                </Text>
                <View
                  style={[
                    barStyles.bar,
                    { height: barHeight, backgroundColor: fill },
                  ]}
                >
                  <View style={[barStyles.barCap, { backgroundColor: cap }]} />
                </View>
              </View>
              <Text
                style={[
                  barStyles.dayLabel,
                  isPeak && { color: cap, fontWeight: fontWeight.semiBold },
                ]}
              >
                {item.day}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function LineChart() {
  const { t } = useTranslation();
  const threshold = 15;
  const maxValue = Math.max(...hourlyPM25.map((d) => d.value));
  const yMax = maxValue * 1.15; // headroom above the peak
  const w = CHART_WIDTH;
  const h = LINE_CHART_HEIGHT;

  const toY = (value: number) => h - (value / yMax) * h;

  const points = hourlyPM25.map((item, index) => ({
    x: (index / (hourlyPM25.length - 1)) * w,
    y: toY(item.value),
  }));

  const linePoints = points.map((p) => `${p.x},${p.y}`).join(' ');
  const areaPoints = `0,${h} ${linePoints} ${w},${h}`;

  const thresholdY = toY(threshold);
  const peak = points.reduce((a, b) => (a.y < b.y ? a : b));

  const xLabels = ['00:00', '06:00', '12:00', '18:00'];

  return (
    <View style={lineStyles.container}>
      {/* Max label, anchored above the peak */}
      <Text
        style={[
          lineStyles.maxLabelText,
          { position: 'absolute', top: Math.max(0, peak.y - 18), right: 0 },
        ]}
      >
        {t('max_label')} {maxValue}μg
      </Text>

      {/* Threshold label */}
      <Text
        style={[lineStyles.thresholdLabel, { top: thresholdY - 16 }]}
      >
        {t('threshold')}
      </Text>

      <Svg width={w} height={h}>
        {/* Area fill */}
        <Polygon points={areaPoints} fill={colors.amberLight} opacity={0.7} />
        {/* Threshold dashed line */}
        <SvgLine
          x1={0}
          y1={thresholdY}
          x2={w}
          y2={thresholdY}
          stroke={colors.amber}
          strokeWidth={1.5}
          strokeDasharray="6,4"
        />
        {/* Line */}
        <Polyline
          points={linePoints}
          fill="none"
          stroke={colors.amber}
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Dots */}
        {points.map((p, i) => (
          <Circle key={i} cx={p.x} cy={p.y} r={3.5} fill={colors.amber} />
        ))}
      </Svg>

      {/* X-axis labels */}
      <View style={lineStyles.xAxis}>
        {xLabels.map((label) => (
          <Text key={label} style={lineStyles.xLabel}>
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
}

export function GraphScreen() {
  const [aqiPeriod, setAqiPeriod] = useState<'week' | 'month'>('week');
  const { t, language } = useTranslation();

  const aqiData = aqiPeriod === 'week' ? weeklyAQI : monthlyAQI;
  const avgAQI = Math.round(
    aqiData.reduce((sum, d) => sum + d.value, 0) / aqiData.length
  );

  const LOCALES = { tr: 'tr-TR', en: 'en-US', de: 'de-DE' } as const;
  const now = new Date();
  const monthYear = now.toLocaleDateString(LOCALES[language], {
    month: 'long',
    year: 'numeric',
  });
  const periodLabel = aqiPeriod === 'week' ? monthYear : t('last_30_days');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.screenTitle}>{t('graph')}</Text>

        {/* AQI Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>AQI · {periodLabel}</Text>
              <Text style={styles.sectionSubtitle}>
                {t('avg_prefix')} {avgAQI} · {t('good_for_child')}
              </Text>
            </View>
            {/* Period toggle */}
            <View style={styles.periodToggle}>
              <TouchableOpacity
                style={[styles.periodPill, aqiPeriod === 'week' && styles.periodPillActive]}
                onPress={() => setAqiPeriod('week')}
              >
                <Text style={[styles.periodText, aqiPeriod === 'week' && styles.periodTextActive]}>
                  {t('week')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.periodPill, aqiPeriod === 'month' && styles.periodPillActive]}
                onPress={() => setAqiPeriod('month')}
              >
                <Text style={[styles.periodText, aqiPeriod === 'month' && styles.periodTextActive]}>
                  {t('month')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <BarChart data={aqiData} />
        </View>

        <View style={styles.divider} />

        {/* PM2.5 Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('pm25_24h')}</Text>
          <Text style={styles.sectionSubtitle}>{t('child_threshold')}</Text>

          <LineChart />
        </View>

        {/* Summary cards */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { borderLeftColor: colors.green }]}>
            <Text style={[styles.summaryValue, { color: colors.green }]}>87%</Text>
            <Text style={styles.summaryLabel}>{t('clean_day')}</Text>
          </View>
          <View style={[styles.summaryCard, { borderLeftColor: colors.amber }]}>
            <Text style={[styles.summaryValue, { color: colors.amber }]}>{avgAQI}</Text>
            <Text style={styles.summaryLabel}>{t('avg_aqi')}</Text>
          </View>
          <View style={[styles.summaryCard, { borderLeftColor: colors.textSecondary }]}>
            <Text style={styles.summaryValue}>312 s</Text>
            <Text style={styles.summaryLabel}>{t('runtime')}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    justifyContent: 'space-between',
  },
  screenTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    paddingTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semiBold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  periodToggle: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    padding: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  periodPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    minHeight: 32,
    justifyContent: 'center',
  },
  periodPillActive: {
    backgroundColor: colors.coralLight,
  },
  periodText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  periodTextActive: {
    color: colors.coral,
    fontWeight: fontWeight.semiBold,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.xl,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderLeftWidth: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  summaryLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
});

const barStyles = StyleSheet.create({
  container: {
    width: CHART_WIDTH,
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
  },
  barTrack: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  valueLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semiBold,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  bar: {
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barCap: {
    height: 4,
    width: '100%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  dayLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 6,
  },
});

const lineStyles = StyleSheet.create({
  container: {
    width: CHART_WIDTH,
    position: 'relative',
    paddingTop: spacing.sm,
  },
  maxLabelText: {
    fontSize: fontSize.xs,
    color: colors.amber,
    fontWeight: fontWeight.semiBold,
    zIndex: 2,
  },
  thresholdLabel: {
    position: 'absolute',
    right: 0,
    fontSize: fontSize.xs,
    color: colors.amber,
    zIndex: 2,
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  xLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
});
