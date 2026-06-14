import 'react-native-gesture-handler';
import React from 'react';
import { Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
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
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) return null;

  // Inter'i tüm Text bileşenlerine varsayılan olarak uygula
  (Text as any).defaultProps = (Text as any).defaultProps ?? {};
  (Text as any).defaultProps.style = { fontFamily: 'Inter_400Regular' };

  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}
