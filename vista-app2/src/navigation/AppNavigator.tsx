import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { DashboardScreen } from '../screens/app/DashboardScreen';
import { GraphScreen } from '../screens/app/GraphScreen';
import { ControlScreen } from '../screens/app/ControlScreen';
import { SettingsScreen } from '../screens/app/SettingsScreen';
import { NotificationsScreen } from '../screens/app/NotificationsScreen';

export type AppTabParamList = {
  Dashboard: undefined;
  Graph: undefined;
  Control: undefined;
  SettingsStack: undefined;
};

export type SettingsStackParamList = {
  Settings: undefined;
  Notifications: undefined;
};

const Tab = createBottomTabNavigator<AppTabParamList>();
const SettingsStack = createNativeStackNavigator<SettingsStackParamList>();

function SettingsNavigator() {
  return (
    <SettingsStack.Navigator screenOptions={{ headerShown: false }}>
      <SettingsStack.Screen name="Settings" component={SettingsScreen} />
      <SettingsStack.Screen name="Notifications" component={NotificationsScreen} />
    </SettingsStack.Navigator>
  );
}

export function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bg,
          borderTopColor: colors.border,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: colors.coral,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: React.ComponentProps<typeof Ionicons>['name'];
          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Graph') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'Control') {
            iconName = focused ? 'options' : 'options-outline';
          } else {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ tabBarLabel: 'Ana sayfa' }}
      />
      <Tab.Screen
        name="Graph"
        component={GraphScreen}
        options={{ tabBarLabel: 'Grafik' }}
      />
      <Tab.Screen
        name="Control"
        component={ControlScreen}
        options={{ tabBarLabel: 'Kontrol' }}
      />
      <Tab.Screen
        name="SettingsStack"
        component={SettingsNavigator}
        options={{ tabBarLabel: 'Ayarlar' }}
      />
    </Tab.Navigator>
  );
}
