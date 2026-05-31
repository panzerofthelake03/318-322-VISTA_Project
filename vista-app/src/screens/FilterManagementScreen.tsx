import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ProgressBar, PrimaryButton } from '../components';
import { colors, fontSize, fontWeight, radius, spacing } from '../theme';
import { useDeviceStore } from '../store/deviceStore';

export function FilterManagementScreen() {
  const { filters } = useDeviceStore();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Main filter status */}
        <View style={styles.mainCard}>
          <View style={styles.circleWrap}>
            <Text style={styles.circlePercent}>{filters.hepa}%</Text>
            <Text style={styles.circleLabel}>kalan</Text>
          </View>
          <View style={styles.mainInfo}>
            <Text style={styles.filterName}>HEPA H13</Text>
            <Text style={styles.filterStatus}>Filtre sağlıklı</Text>
            <Text style={styles.filterSub}>~4 ay kaldı · Ada profili için yeterli</Text>
          </View>
        </View>

        {/* Detail */}
        <View style={styles.detailCard}>
          <Text style={styles.detailTitle}>Filtre detayı</Text>
          <ProgressBar label="HEPA H13" value={filters.hepa} color={colors.green} />
          <ProgressBar label="Aktif karbon" value={filters.carbon} color={colors.green} />
          <ProgressBar label="Ön filtre" value={filters.preFilter} />
        </View>

        {/* Warning */}
        {filters.preFilter <= 50 && (
          <View style={styles.warningBox}>
            <Ionicons name="cube-outline" size={18} color={colors.amber} />
            <Text style={styles.warningText}>Ön filtre yakında bitiyor</Text>
          </View>
        )}

        <PrimaryButton title="Şimdi sipariş ver" onPress={() => {}} />
      </ScrollView>
    </SafeAreaView>
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
  mainCard: {
    backgroundColor: colors.greenLight,
    borderRadius: radius.lg,
    padding: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
    borderWidth: 1,
    borderColor: colors.green,
  },
  circleWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: colors.green,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circlePercent: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.green,
  },
  circleLabel: {
    fontSize: fontSize.xs,
    color: colors.green,
  },
  mainInfo: {
    flex: 1,
    gap: 2,
  },
  filterName: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  filterStatus: {
    fontSize: fontSize.sm,
    color: colors.green,
    fontWeight: fontWeight.medium,
  },
  filterSub: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  detailCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.xl,
  },
  detailTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.amberLight,
    borderRadius: radius.md,
    padding: spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: colors.amber,
  },
  warningText: {
    fontSize: fontSize.sm,
    color: colors.amber,
    fontWeight: fontWeight.medium,
  },
});
