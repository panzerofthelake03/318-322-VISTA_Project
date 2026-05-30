import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { PrimaryButton } from '../components';
import { colors, fontSize, fontWeight, radius, spacing } from '../theme';
import { useOnboardingStore } from '../store/onboardingStore';
import { OnboardingStackParamList } from '../navigation/OnboardingNavigator';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'SetupComplete'>;

export function SetupCompleteScreen({ navigation }: Props) {
  const { profileName, filterType, pmThreshold, roomType } = useOnboardingStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const nav = useNavigation();

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const handleGoToApp = async () => {
    await AsyncStorage.setItem('onboardingCompleted', 'true');
    // getParent() ile RootNavigator'a ulaşıp 'App' route'una reset yapıyoruz
    nav.getParent()?.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'App' }] }));
  };

  const roomLabel = roomType === 'baby_room' ? 'Çocuk odası'
    : roomType === 'living' ? 'Oturma odası'
    : roomType === 'kitchen' ? 'Mutfak'
    : roomType === 'office' ? 'Ofis'
    : 'Çocuk odası';

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.top}>
          <Animated.View style={[styles.iconWrap, { opacity: fadeAnim }]}>
            <Ionicons name="checkmark" size={40} color={colors.green} />
          </Animated.View>
          <Text style={styles.title}>Hazır, {profileName}!</Text>
        </View>
        <View style={styles.summary}>
          <SummaryRow label="Filtre tipi" value={filterType} />
          <SummaryRow label="PM eşiği" value={`${pmThreshold} μg/m³`} />
          <SummaryRow label="Oda" value={roomLabel} />
          <SummaryRow label="Profil" value={`${profileName} · 4 yaş`} isHighlight />
        </View>
        <PrimaryButton title="Ana ekrana git" onPress={handleGoToApp} />
      </View>
    </SafeAreaView>
  );
}

function SummaryRow({ label, value, isHighlight }: { label: string; value: string; isHighlight?: boolean }) {
  return (
    <View style={summaryStyles.row}>
      <Text style={summaryStyles.label}>{label}</Text>
      <Text style={[summaryStyles.value, isHighlight && summaryStyles.highlight]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxxl,
    justifyContent: 'space-between',
  },
  top: {
    alignItems: 'center',
    gap: spacing.xl,
    flex: 1,
    justifyContent: 'center',
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.greenLight,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  summary: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginBottom: spacing.xxxl,
    gap: spacing.md,
  },
});

const summaryStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  value: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    fontWeight: fontWeight.medium,
  },
  highlight: {
    color: colors.coral,
  },
});
