import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QRPairScreen } from '../screens/onboarding/QRPairScreen';
import { UserProfileStep } from '../screens/onboarding/UserProfileStep';
import { HealthConditionStep } from '../screens/onboarding/HealthConditionStep';
import { RoomTypeStep } from '../screens/onboarding/RoomTypeStep';
import { PetStep } from '../screens/onboarding/PetStep';
import { SetupCompleteScreen } from '../screens/onboarding/SetupCompleteScreen';

export type OnboardingStackParamList = {
  QRPair: undefined;
  UserProfileStep: undefined;
  HealthConditionStep: undefined;
  RoomTypeStep: undefined;
  PetStep: undefined;
  SetupComplete: undefined;
};

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="QRPair" component={QRPairScreen} />
      <Stack.Screen name="UserProfileStep" component={UserProfileStep} />
      <Stack.Screen name="HealthConditionStep" component={HealthConditionStep} />
      <Stack.Screen name="RoomTypeStep" component={RoomTypeStep} />
      <Stack.Screen name="PetStep" component={PetStep} />
      <Stack.Screen name="SetupComplete" component={SetupCompleteScreen} />
    </Stack.Navigator>
  );
}
