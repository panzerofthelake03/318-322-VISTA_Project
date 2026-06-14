import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { colors, spacing, fontSize, fontWeight, radius } from '../../theme';

type ConnectionState = 'connecting' | 'connected';

// In onboarding the screen continues to the profile step after pairing.
// When opened standalone (e.g. "Cihaz ekle" in Profiles) it just goes back.
export function QRPairScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const standalone: boolean = route.params?.standalone ?? false;
  const [connectionState, setConnectionState] = useState<ConnectionState>('connecting');
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation for "connecting" state
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  // Simulate connection after 2.5s
  useEffect(() => {
    const timer = setTimeout(() => {
      setConnectionState('connected');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => {
        if (standalone) {
          navigation.goBack();
        } else {
          navigation.navigate('UserProfileStep');
        }
      }, 1000);
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigation, standalone]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        <Text style={styles.backText}>Geri</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>Cihazı eşleştir</Text>
        <Text style={styles.subtitle}>
          Vista Air'in altındaki QR kodu okutun
        </Text>

        {/* QR Viewfinder */}
        <View style={styles.qrContainer}>
          <View style={styles.qrFrame}>
            {/* Corner brackets */}
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
            <View style={styles.qrInner}>
              <Ionicons name="qr-code-outline" size={80} color={colors.border} />
            </View>
          </View>
        </View>

        {/* Status card */}
        <View style={styles.statusCard}>
          {connectionState === 'connecting' ? (
            <View style={styles.statusRow}>
              <Animated.View style={[styles.statusDot, styles.statusDotAmber, { opacity: pulseAnim }]} />
              <Text style={styles.statusText}>Bağlanıyor...</Text>
            </View>
          ) : (
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, styles.statusDotGreen]} />
              <Ionicons name="checkmark-circle" size={18} color={colors.green} style={{ marginRight: spacing.xs }} />
              <Text style={[styles.statusText, { color: colors.green }]}>Bağlandı</Text>
            </View>
          )}
        </View>

        {/* AI Assistant card - only visible during connecting */}
        {connectionState === 'connecting' && (
          <View style={styles.aiCard}>
            <View style={styles.aiIconContainer}>
              <Ionicons name="sparkles" size={18} color={colors.coral} />
            </View>
            <Text style={styles.aiText}>
              AI Asistan cihazınızı analiz ediyor...
            </Text>
          </View>
        )}
      </View>

      {/* Manual entry button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.manualButton}>
          <Text style={styles.manualText}>Manuel gir</Text>
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    minHeight: 44,
  },
  backText: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    marginLeft: spacing.xs,
    fontWeight: fontWeight.medium,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  qrContainer: {
    marginBottom: spacing.xxl,
  },
  qrFrame: {
    width: 240,
    height: 240,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: colors.coral,
    borderWidth: 3,
  },
  cornerTL: {
    top: 12,
    left: 12,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 4,
  },
  cornerTR: {
    top: 12,
    right: 12,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 4,
  },
  cornerBL: {
    bottom: 12,
    left: 12,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 4,
  },
  cornerBR: {
    bottom: 12,
    right: 12,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 4,
  },
  qrInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    width: '100%',
    marginBottom: spacing.md,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  statusDotAmber: {
    backgroundColor: colors.amber,
  },
  statusDotGreen: {
    backgroundColor: colors.green,
  },
  statusText: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    fontWeight: fontWeight.medium,
  },
  aiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.coralLight,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.coral + '40',
    width: '100%',
    gap: spacing.sm,
  },
  aiIconContainer: {
    width: 32,
    height: 32,
    backgroundColor: colors.white,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiText: {
    fontSize: fontSize.sm,
    color: colors.coral,
    flex: 1,
  },
  bottomContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  manualButton: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 48,
    justifyContent: 'center',
  },
  manualText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
});
