import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Svg, { Circle } from 'react-native-svg';
import { useDeviceStore } from '../../store/deviceStore';
import { useOnboardingStore } from '../../store/onboardingStore';
import { useTranslation } from '../../i18n';
import { colors, spacing, fontSize, fontWeight, radius } from '../../theme';

const RING_SIZE = 160;
const RING_STROKE = 10;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function FilterRing({ percent }: { percent: number }) {
  const { t } = useTranslation();
  const progress = (percent / 100) * RING_CIRCUMFERENCE;

  return (
    <View style={ringStyles.container}>
      <Svg width={RING_SIZE} height={RING_SIZE}>
        <Circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RING_RADIUS}
          stroke={colors.border}
          strokeWidth={RING_STROKE}
          fill="none"
        />
        <Circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RING_RADIUS}
          stroke={colors.green}
          strokeWidth={RING_STROKE}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${progress} ${RING_CIRCUMFERENCE - progress}`}
          strokeDashoffset={RING_CIRCUMFERENCE / 4}
        />
      </Svg>
      <View style={ringStyles.center}>
        <Text style={ringStyles.percent}>{percent}%</Text>
        <Text style={ringStyles.label}>{t('remaining')}</Text>
      </View>
    </View>
  );
}

const ringStyles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    marginVertical: spacing.lg,
  },
  center: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  percent: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});

export function FilterScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const filterLife = useDeviceStore((s) => s.filterLife);
  const totalRuntime = useDeviceStore((s) => s.totalRuntime);
  const childName = useOnboardingStore((s) => s.childName);

  const preFilterColor =
    filterLife.preFilter < 50 ? colors.amber : colors.green;

  const summaryItems = [
    { value: filterLife.hepa, label: 'HEPA H13', color: colors.green },
    { value: filterLife.preFilter, label: t('pre_filter'), color: preFilterColor },
    { value: filterLife.carbon, label: t('carbon'), color: colors.green },
  ];

  const infoRows = [
    {
      label: `HEPA H13 (${childName})`,
      value: `${filterLife.hepa}%`,
      color: colors.green,
    },
    {
      label: t('active_carbon'),
      value: `${filterLife.carbon}%`,
      color: colors.green,
    },
    {
      label: t('pre_filter'),
      value: `${filterLife.preFilter}%`,
      color: preFilterColor,
    },
    {
      label: t('total_runtime'),
      value: `${totalRuntime} ${t('hours')}`,
      color: colors.textPrimary,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={18} color={colors.textSecondary} />
            <Text style={styles.backText}>{t('back')}</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>{t('filter')}</Text>
          <TouchableOpacity style={styles.historyButton} activeOpacity={0.7}>
            <Text style={styles.historyText}>{t('history')}</Text>
          </TouchableOpacity>
        </View>

        {/* Circular progress */}
        <FilterRing percent={filterLife.hepa} />

        <Text style={styles.healthyText}>{t('filter_healthy')}</Text>

        {/* 3-column summary */}
        <View style={styles.summaryRow}>
          {summaryItems.map((item) => (
            <View key={item.label} style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: item.color }]}>
                {item.value}%
              </Text>
              <Text style={styles.summaryLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Filter info list */}
        <Text style={styles.sectionLabel}>{t('filter_info')}</Text>
        <View style={styles.infoCard}>
          {infoRows.map((row, i) => (
            <View
              key={row.label}
              style={[
                styles.infoRow,
                i === infoRows.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              <Text style={styles.infoLabel}>{row.label}</Text>
              <Text style={[styles.infoValue, { color: row.color }]}>
                {row.value}
              </Text>
            </View>
          ))}
        </View>

        {/* Order CTA */}
        <TouchableOpacity style={styles.orderButton} activeOpacity={0.85}>
          <Text style={styles.orderButtonText}>{t('order_filter')}</Text>
        </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.lg,
    marginBottom: spacing.md,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: 44,
    minWidth: 60,
  },
  backText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  screenTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  historyButton: {
    minHeight: 44,
    minWidth: 60,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  historyText: {
    fontSize: fontSize.sm,
    color: colors.coral,
    fontWeight: fontWeight.medium,
  },
  healthyText: {
    fontSize: fontSize.md,
    color: colors.green,
    fontWeight: fontWeight.medium,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    marginBottom: 2,
  },
  summaryLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  sectionLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    minHeight: 52,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  infoValue: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semiBold,
  },
  orderButton: {
    backgroundColor: colors.coral,
    borderRadius: radius.full,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semiBold,
    color: colors.white,
  },
});
