import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingProgressBar, ChipSelector, SelectedChipsFeedback, PrimaryButton } from '../components';
import { colors, fontSize, fontWeight, spacing } from '../theme';
import { useOnboardingStore } from '../store/onboardingStore';
import { OnboardingStackParamList } from '../navigation/OnboardingNavigator';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Step2'>;

const CONDITIONS = ['Astım', 'Alerji', 'KOAH', 'Polen has.', 'Toz alerjisi', 'Deri hassas.', 'Kalp hastalığı', 'Hiçbiri'];

export function OnboardingStep2Screen({ navigation }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const setHealthConditions = useOnboardingStore((s) => s.setHealthConditions);

  const toggle = (label: string) => {
    if (label === 'Hiçbiri') {
      setSelected(['Hiçbiri']);
      return;
    }
    setSelected((prev) => {
      const without = prev.filter((x) => x !== 'Hiçbiri');
      return without.includes(label)
        ? without.filter((x) => x !== label)
        : [...without, label];
    });
  };

  const handleContinue = () => {
    setHealthConditions(selected);
    navigation.navigate('Step3');
  };

  const feedbackItems = selected.filter((s) => s !== 'Hiçbiri');

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <OnboardingProgressBar currentStep={2} totalSteps={4} />
        <Text style={styles.title}>Sağlık durumu var mı?</Text>
        <Text style={styles.subtitle}>Filtre hassasiyetini buna göre ayarlayacağız.</Text>
        <View style={styles.chips}>
          {CONDITIONS.map((c) => (
            <ChipSelector
              key={c}
              label={c}
              selected={selected.includes(c)}
              onPress={() => toggle(c)}
            />
          ))}
        </View>
        <SelectedChipsFeedback selected={feedbackItems} />
        <View style={styles.buttonWrap}>
          <PrimaryButton title="Devam" onPress={handleContinue} />
        </View>
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
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  buttonWrap: {
    marginTop: spacing.xl,
  },
});
