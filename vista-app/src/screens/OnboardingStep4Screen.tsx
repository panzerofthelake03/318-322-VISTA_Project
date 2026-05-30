import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingProgressBar, ToggleRow, PrimaryButton } from '../components';
import { colors, fontSize, fontWeight, spacing } from '../theme';
import { useOnboardingStore } from '../store/onboardingStore';
import { OnboardingStackParamList } from '../navigation/OnboardingNavigator';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Step4'>;

export function OnboardingStep4Screen({ navigation }: Props) {
  const [routines, setRoutines] = useState({
    morning: true,
    noon: true,
    night: true,
    weeklyReport: false,
  });
  const setStoreRoutines = useOnboardingStore((s) => s.setRoutines);

  const toggle = (key: keyof typeof routines) => {
    setRoutines((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleComplete = () => {
    setStoreRoutines(routines);
    navigation.navigate('SetupComplete');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <OnboardingProgressBar currentStep={4} totalSteps={4} />
        <Text style={styles.title}>Günlük rutin nasıl?</Text>
        <Text style={styles.subtitle}>Otomatik program buna göre oluşturulacak.</Text>
        <View style={styles.list}>
          <ToggleRow
            title="Sabah rutini"
            subtitle="07:00'de Fan 2, yüksek taze hava"
            value={routines.morning}
            onToggle={() => toggle('morning')}
          />
          <View style={styles.divider} />
          <ToggleRow
            title="Öğle havalandırması"
            subtitle="12:00'de Fan 3, 20 dk"
            value={routines.noon}
            onToggle={() => toggle('noon')}
          />
          <View style={styles.divider} />
          <ToggleRow
            title="Gece sessiz modu"
            subtitle="21:30'da Fan 1, orb söner"
            value={routines.night}
            onToggle={() => toggle('night')}
          />
          <View style={styles.divider} />
          <ToggleRow
            title="Haftalık rapor"
            subtitle="Her Pazartesi özet bildirim"
            value={routines.weeklyReport}
            onToggle={() => toggle('weeklyReport')}
          />
        </View>
        <PrimaryButton title="Kurulumu tamamla" onPress={handleComplete} />
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
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  list: {
    marginBottom: spacing.xxxl,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
});
