import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useDeviceStore } from './src/store/deviceStore';

function AppContent() {
  const isAlertActive = useDeviceStore((s) => s.isAlertActive);
  return (
    <>
      <StatusBar style={isAlertActive ? 'light' : 'dark'} />
      <RootNavigator />
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}
