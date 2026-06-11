import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { useOnboardingStore } from '../../store/onboardingStore';
import { ROOM_DEVICE_MAP, RoomKey } from '../../data/mockDevice';
import { colors, spacing, fontSize, fontWeight, radius } from '../../theme';

type Props = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'SetupComplete'>;
};

export function SetupCompleteScreen({ navigation }: Props) {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);
  const childName = useOnboardingStore((s) => s.childName);
  const childAge = useOnboardingStore((s) => s.childAge);
  const filterType = useOnboardingStore((s) => s.filterType);
  const pmThreshold = useOnboardingStore((s) => s.pmThreshold);
  const roomType = useOnboardingStore((s) => s.roomType);

  const roomName = ROOM_DEVICE_MAP[roomType as RoomKey]?.name ?? roomType;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 80,
      friction: 8,
    }).start();
  }, []);

  const handleComplete = async () => {
    await AsyncStorage.setItem('onboardingCompleted', 'true');
    completeOnboarding();
  };

  const summaryRows = [
    { label: 'Filtre tipi', value: filterType },
    { label: 'PM eşiği', value: `${pmThreshold} μg/m³` },
    { label: 'Oda', value: roomName },
    {
      label: 'Profil',
      value: `${childName} · ${childAge} yaş`,
      valueColor: colors.coral,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Animated checkmark */}
        <Animated.View style={[styles.checkCircle, { transform: [{ scale: scaleAnim }] }]}>
          <Ionicons name="checkmark-outline" size={40} color={colors.white} />
        </Animated.View>

        {/* Title */}
        <Text style={styles.title}>Hazır, {childName}!</Text>
        <Text style={styles.subtitle}>Kurulum tamamlandı</Text>

        {/* Summary */}
        <View style={styles.summaryContainer}>
          {summaryRows.map((row, index) => (
            <View key={row.label} style={[styles.summaryRow, index < summaryRows.length - 1 && styles.summaryRowBorder]}>
              <Text style={styles.summaryLabel}>{row.label}</Text>
              <Text style={[styles.summaryValue, row.valueColor ? { color: row.valueColor } : null]}>
                {row.value}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* CTA */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={handleComplete}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaText}>Ana ekrana git</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  checkCircle: {
    width: 80,
    height: 80,
    backgroundColor: colors.green,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.xxxl,
  },
  summaryContainer: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  summaryRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  summaryLabel: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semiBold,
    color: colors.textPrimary,
  },
  bottomContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  ctaButton: {
    backgroundColor: colors.coral,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
  },
  ctaText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semiBold,
    color: colors.white,
  },
});
