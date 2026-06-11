import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../store/authStore';
import { useOnboardingStore } from '../store/onboardingStore';
import { AuthNavigator } from './AuthNavigator';
import { OnboardingNavigator } from './OnboardingNavigator';
import { AppNavigator } from './AppNavigator';

export function RootNavigator() {
  const [isReady, setIsReady] = useState(false);

  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const login = useAuthStore((s) => s.login);
  const userName = useAuthStore((s) => s.userName);

  const isOnboardingComplete = useOnboardingStore((s) => s.isOnboardingComplete);
  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);

  useEffect(() => {
    const seedFromStorage = async () => {
      try {
        const [loggedIn, onboarded] = await Promise.all([
          AsyncStorage.getItem('isLoggedIn'),
          AsyncStorage.getItem('onboardingCompleted'),
        ]);
        if (loggedIn === 'true') {
          login(userName || 'Kullanıcı');
        }
        if (onboarded === 'true') {
          completeOnboarding();
        }
      } catch (_) {
        // ignore storage errors
      } finally {
        setIsReady(true);
      }
    };
    seedFromStorage();
  }, []);

  if (!isReady) return null;

  let content: React.ReactNode;
  if (!isLoggedIn) {
    content = <AuthNavigator />;
  } else if (!isOnboardingComplete) {
    content = <OnboardingNavigator />;
  } else {
    content = <AppNavigator />;
  }

  return <NavigationContainer>{content}</NavigationContainer>;
}
