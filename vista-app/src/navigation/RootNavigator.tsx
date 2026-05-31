import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';
import { OnboardingNavigator } from './OnboardingNavigator';
import { AppNavigator } from './AppNavigator';
import { colors } from '../theme';
import { useOnboardingStore } from '../store/onboardingStore';

type RootParamList = {
  Onboarding: undefined;
  App: undefined;
};

const Stack = createNativeStackNavigator<RootParamList>();

export function RootNavigator() {
  const [isReady, setIsReady] = useState(false);
  const { isOnboardingComplete, completeOnboarding } = useOnboardingStore();

  // İlk açılışta AsyncStorage'dan flag'i oku, store'a yaz
  useEffect(() => {
    AsyncStorage.getItem('onboardingCompleted').then((val) => {
      if (val === 'true') completeOnboarding();
      setIsReady(true);
    });
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.coral} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        {isOnboardingComplete ? (
          <Stack.Screen name="App" component={AppNavigator} />
        ) : (
          <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
