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
import { weeklyAQI, hourlyPM25 } from '../../data/mockDevice';
import { colors, spacing, fontSize, fontWeight, radius } from '../../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_PADDING = spacing.lg * 2;
const CHART_WIDTH = SCREEN_WIDTH - CHART_PADDING;
const BAR_CHART_HEIGHT = 160;
const LINE_CHART_HEIGHT = 120;

function getBarColor(value: number): string {
  if (value > 100) return colors.red;
  if (value > 50) return colors.amber;
  return colors.green;
}

function BarChart() {
  const maxValue = Math.max(...weeklyAQI.map((d) => d.value));
  const selectedDay = 'Çrş'; // Wednesday is selected by default

  return (
    <View style={barStyles.container}>
      <View style={barStyles.barsRow}>
        {weeklyAQI.map((item) => {
          const isSelected = item.day === selectedDay;
          const barHeight = (item.value / maxValue) * (BAR_CHART_HEIGHT - 32);
          const barColor = getBarColor(item.value);

          return (
            <View key={item.day} style={barStyles.barColumn}>
              {isSelected && (
                <Text style={barStyles.valueLabel}>{item.value}</Text>
              )}
              <View style={barStyles.barTrack}>
                <View
                  style={[
                    barStyles.bar,
                    {
                      height: barHeight,
                      backgroundColor: isSelected
                        ? darkenColor(barColor)
                        : barColor,
                      opacity: isSelected ? 1 : 0.75,
                    },
                  ]}
                />
              </View>
              <Text style={[barStyles.dayLabel, isSelected && barStyles.dayLabelSelected]}>
                {item.day}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function darkenColor(hex: string): string {
  // Simple darkening: just return the color with full opacity
  return hex;
}

function LineChart() {
  const maxValue = Math.max(...hourlyPM25.map((d) => d.value));
  const threshold = 15;
  const thresholdY = LINE_CHART_HEIGHT - (threshold / maxValue) * LINE_CHART_HEIGHT;
  const maxY = LINE_CHART_HEIGHT - (maxValue / maxValue) * LINE_CHART_HEIGHT;

  // Calculate point positions
  const points = hourlyPM25.map((item, index) => {
    const x = (index / (hourlyPM25.length - 1)) * CHART_WIDTH;
    const y = LINE_CHART_HEIGHT - (item.value / (maxValue + 5)) * LINE_CHART_HEIGHT;
    return { x, y, value: item.value };
  });

  // Create line segments between consecutive points
  const segments: Array<{
    x: number;
    y: number;
    length: number;
    angle: number;
  }> = [];

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    segments.push({
      x: p1.x,
      y: p1.y,
      length,
      angle,
    });
  }

  // X-axis labels (every other hour)
  const xLabels = ['00:00', '06:00', '12:00', '18:00'];

  return (
    <View style={lineStyles.container}>
      {/* Max label */}
      <View style={[lineStyles.maxLabel, { top: maxY - 16 }]}>
        <Text style={lineStyles.maxLabelText}>maks {maxValue}μg</Text>
      </View>

      {/* Threshold line */}
      <View style={[lineStyles.thresholdLine, { top: thresholdY }]}>
        <Text style={lineStyles.thresholdLabel}>eşik</Text>
      </View>

      {/* Chart area */}
      <View style={lineStyles.chartArea}>
        {/* Area fill approximation */}
        {points.map((pt, i) => {
          if (i === points.length - 1) return null;
          const nextPt = points[i + 1];
          return (
            <View
              key={i}
              style={[
                lineStyles.areaFill,
                {
                  left: pt.x,
                  top: Math.min(pt.y, nextPt.y),
                  width: nextPt.x - pt.x,
                  height: LINE_CHART_HEIGHT - Math.min(pt.y, nextPt.y),
                },
              ]}
            />
          );
        })}

        {/* Line segments */}
        {segments.map((seg, i) => (
          <View
            key={i}
            style={[
              lineStyles.segment,
              {
                left: seg.x,
                top: seg.y,
                width: seg.length,
                transform: [{ rotate: `${seg.angle}deg` }],
              },
            ]}
          />
        ))}

        {/* Dots */}
        {points.map((pt, i) => (
          <View
            key={i}
            style={[lineStyles.dot, { left: pt.x - 4, top: pt.y - 4 }]}
          />
        ))}
      </View>

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

  const avgAQI = Math.round(
    weeklyAQI.reduce((sum, d) => sum + d.value, 0) / weeklyAQI.length
  );

  const now = new Date();
  const monthYear = now.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.screenTitle}>Grafik</Text>

        {/* AQI Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>AQI · {monthYear}</Text>
              <Text style={styles.sectionSubtitle}>
                ort. {avgAQI} · Ada için iyi
              </Text>
            </View>
            {/* Period toggle */}
            <View style={styles.periodToggle}>
              <TouchableOpacity
                style={[styles.periodPill, aqiPeriod === 'week' && styles.periodPillActive]}
                onPress={() => setAqiPeriod('week')}
              >
                <Text style={[styles.periodText, aqiPeriod === 'week' && styles.periodTextActive]}>
                  Hafta
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.periodPill, aqiPeriod === 'month' && styles.periodPillActive]}
                onPress={() => setAqiPeriod('month')}
              >
                <Text style={[styles.periodText, aqiPeriod === 'month' && styles.periodTextActive]}>
                  Ay
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.chartContainer}>
            <BarChart />
          </View>
        </View>

        {/* PM2.5 Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PM2.5 · 24 saat</Text>
          <Text style={styles.sectionSubtitle}>Ada eşiği: 15μg</Text>

          <View style={styles.chartContainer}>
            <LineChart />
          </View>
        </View>

        {/* Summary cards */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { borderLeftColor: colors.green }]}>
            <Text style={[styles.summaryValue, { color: colors.green }]}>87%</Text>
            <Text style={styles.summaryLabel}>Temiz gün</Text>
          </View>
          <View style={[styles.summaryCard, { borderLeftColor: colors.amber }]}>
            <Text style={[styles.summaryValue, { color: colors.amber }]}>{avgAQI}</Text>
            <Text style={styles.summaryLabel}>Ort. AQI</Text>
          </View>
          <View style={[styles.summaryCard, { borderLeftColor: colors.textSecondary }]}>
            <Text style={styles.summaryValue}>312 s</Text>
            <Text style={styles.summaryLabel}>Çalışma</Text>
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
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
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
    marginBottom: spacing.md,
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
    backgroundColor: colors.coral,
  },
  periodText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  periodTextActive: {
    color: colors.white,
    fontWeight: fontWeight.semiBold,
  },
  chartContainer: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: spacing.sm,
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
    height: BAR_CHART_HEIGHT,
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: BAR_CHART_HEIGHT - 24,
    gap: 4,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    height: BAR_CHART_HEIGHT - 24,
    justifyContent: 'flex-end',
  },
  valueLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  barTrack: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    paddingHorizontal: 2,
  },
  bar: {
    borderRadius: 3,
    width: '100%',
  },
  dayLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 4,
  },
  dayLabelSelected: {
    color: colors.coral,
    fontWeight: fontWeight.semiBold,
  },
});

const lineStyles = StyleSheet.create({
  container: {
    height: LINE_CHART_HEIGHT + 24,
    position: 'relative',
  },
  maxLabel: {
    position: 'absolute',
    right: 0,
    zIndex: 2,
  },
  maxLabelText: {
    fontSize: fontSize.xs,
    color: colors.amber,
    fontWeight: fontWeight.medium,
  },
  thresholdLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    borderWidth: 1,
    borderColor: colors.amber,
    borderStyle: 'dashed',
    zIndex: 1,
  },
  thresholdLabel: {
    position: 'absolute',
    right: 0,
    top: -14,
    fontSize: fontSize.xs,
    color: colors.amber,
  },
  chartArea: {
    height: LINE_CHART_HEIGHT,
    position: 'relative',
    overflow: 'hidden',
  },
  areaFill: {
    position: 'absolute',
    backgroundColor: colors.coralLight,
    opacity: 0.4,
  },
  segment: {
    position: 'absolute',
    height: 2,
    backgroundColor: colors.amber,
    transformOrigin: '0 50%',
  },
  dot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.amber,
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
