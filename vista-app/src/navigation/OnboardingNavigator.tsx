import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { OnboardingStep1Screen } from '../screens/OnboardingStep1Screen';
import { OnboardingStep2Screen } from '../screens/OnboardingStep2Screen';
import { OnboardingStep3Screen } from '../screens/OnboardingStep3Screen';
import { OnboardingStep4Screen } from '../screens/OnboardingStep4Screen';
import { SetupCompleteScreen } from '../screens/SetupCompleteScreen';

export type OnboardingStackParamList = {
  Welcome: undefined;
  Step1: undefined;
  Step2: undefined;
  Step3: undefined;
  Step4: undefined;
  SetupComplete: undefined;
};

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Step1" component={OnboardingStep1Screen} />
      <Stack.Screen name="Step2" component={OnboardingStep2Screen} />
      <Stack.Screen name="Step3" component={OnboardingStep3Screen} />
      <Stack.Screen name="Step4" component={OnboardingStep4Screen} />
      <Stack.Screen name="SetupComplete" component={SetupCompleteScreen} />
    </Stack.Navigator>
  );
}
