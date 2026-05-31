import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PrimaryButton, SecondaryButton } from '../components';
import { colors, fontSize, fontWeight, radius, spacing } from '../theme';
import { OnboardingStackParamList } from '../navigation/OnboardingNavigator';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Welcome'>;

export function WelcomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.top}>
          <View style={styles.logoPlaceholder} />
          <Text style={styles.title}>{'VISTA\'ya.\nHoş geldiniz,'}</Text>
        </View>
        <View style={styles.buttons}>
          <PrimaryButton title="Başlayalım" onPress={() => navigation.navigate('Step1')} />
          <SecondaryButton title="Şimdi atla" onPress={() => navigation.navigate('SetupComplete')} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'space-between',
    paddingBottom: spacing.xxxl,
  },
  top: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xxl,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: radius.xl,
    backgroundColor: colors.coralLight,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  buttons: {
    gap: spacing.md,
  },
});
