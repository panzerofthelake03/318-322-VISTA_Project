import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from '../store/authStore';
import { useOnboardingStore } from '../store/onboardingStore';
import { AuthNavigator } from './AuthNavigator';
import { OnboardingNavigator } from './OnboardingNavigator';
import { AppNavigator } from './AppNavigator';

export function RootNavigator() {
  const [isReady, setIsReady] = useState(false);

  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const logout = useAuthStore((s) => s.logout);
  const isOnboardingComplete = useOnboardingStore((s) => s.isOnboardingComplete);
  const resetOnboarding = useOnboardingStore((s) => s.resetOnboarding);

  useEffect(() => {
    logout();
    resetOnboarding();
    setIsReady(true);
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
