import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { DashboardScreen } from '../screens/DashboardScreen';
import { FilterManagementScreen } from '../screens/FilterManagementScreen';
import { PlaceholderScreen } from '../screens/PlaceholderScreen';
import { colors, fontSize } from '../theme';
import { useDeviceStore } from '../store/deviceStore';

export type AppTabParamList = {
  Home: undefined;
  Statistics: undefined;
  Control: undefined;
  Alerts: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<AppTabParamList>();

export function AppNavigator() {
  const isAlertActive = useDeviceStore((s) => s.isAlertActive);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.coral,
        tabBarInactiveTintColor: colors.navInactive,
        tabBarLabelStyle: { fontSize: fontSize.xs },
        tabBarStyle: { borderTopColor: colors.border },
        tabBarIcon: ({ color, size, focused }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            Home: focused ? 'home' : 'home-outline',
            Statistics: focused ? 'bar-chart' : 'bar-chart-outline',
            Control: focused ? 'settings' : 'settings-outline',
            Alerts: focused ? 'notifications' : 'notifications-outline',
            Profile: focused ? 'person' : 'person-outline',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} options={{ title: 'Ana ekran' }} />
      <Tab.Screen name="Statistics" options={{ title: 'İstatistik' }}>
        {() => <PlaceholderScreen title="İstatistik" />}
      </Tab.Screen>
      <Tab.Screen name="Control" component={FilterManagementScreen} options={{ title: 'Kontrol' }} />
      <Tab.Screen
        name="Alerts"
        options={{
          title: 'Uyarılar',
          tabBarBadge: isAlertActive ? '' : undefined,
          tabBarBadgeStyle: { backgroundColor: colors.red, minWidth: 10, minHeight: 10 },
        }}
      >
        {() => <PlaceholderScreen title="Uyarılar" />}
      </Tab.Screen>
      <Tab.Screen name="Profile" options={{ title: 'Profil' }}>
        {() => <PlaceholderScreen title="Profil" />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
