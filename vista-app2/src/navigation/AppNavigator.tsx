import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { useTranslation } from '../i18n';
import { DashboardScreen } from '../screens/app/DashboardScreen';
import { GraphScreen } from '../screens/app/GraphScreen';
import { ControlScreen } from '../screens/app/ControlScreen';
import { SettingsScreen } from '../screens/app/SettingsScreen';
import { NotificationsScreen } from '../screens/app/NotificationsScreen';
import { ProfilesScreen } from '../screens/app/ProfilesScreen';
import { FilterScreen } from '../screens/app/FilterScreen';
import { QRPairScreen } from '../screens/onboarding/QRPairScreen';

export type AppTabParamList = {
  Dashboard: undefined;
  Graph: undefined;
  Control: undefined;
  SettingsStack: undefined;
};

export type SettingsStackParamList = {
  Settings: undefined;
  Notifications: undefined;
  Profiles: undefined;
  Filter: undefined;
  QRPair: { standalone: boolean };
};

const Tab = createBottomTabNavigator<AppTabParamList>();
const SettingsStack = createNativeStackNavigator<SettingsStackParamList>();

function SettingsNavigator() {
  return (
    <SettingsStack.Navigator screenOptions={{ headerShown: false }}>
      <SettingsStack.Screen name="Settings" component={SettingsScreen} />
      <SettingsStack.Screen name="Notifications" component={NotificationsScreen} />
      <SettingsStack.Screen name="Profiles" component={ProfilesScreen} />
      <SettingsStack.Screen name="Filter" component={FilterScreen} />
      <SettingsStack.Screen name="QRPair" component={QRPairScreen} />
    </SettingsStack.Navigator>
  );
}

export function AppNavigator() {
  const { t } = useTranslation();
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
        options={{ tabBarLabel: t('tab_home') }}
      />
      <Tab.Screen
        name="Graph"
        component={GraphScreen}
        options={{ tabBarLabel: t('tab_graph') }}
      />
      <Tab.Screen
        name="Control"
        component={ControlScreen}
        options={{ tabBarLabel: t('tab_control') }}
      />
      <Tab.Screen
        name="SettingsStack"
        component={SettingsNavigator}
        options={{ tabBarLabel: t('tab_settings') }}
      />
    </Tab.Navigator>
  );
}
