import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { TasksScreen } from '../screens/TasksScreen';
import { CheckInScreen } from '../screens/CheckInScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { useAppContext } from '../context/AppContext';
import AppText from '../components/common/Text';

const Tab = createBottomTabNavigator();

export function TabNavigator() {
  const { theme } = useAppContext();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          height: 80,
          paddingBottom: 20,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }: { color: string }) => <AppText style={{ fontSize: 20, color }}>🏠</AppText>,
        }}
      />
      <Tab.Screen
        name="Tasks"
        component={TasksScreen}
        options={{
          tabBarIcon: ({ color }: { color: string }) => <AppText style={{ fontSize: 20, color }}>📋</AppText>,
        }}
      />
      <Tab.Screen
        name="CheckIn"
        component={CheckInScreen}
        options={{
          tabBarIcon: ({ color }: { color: string }) => <AppText style={{ fontSize: 20, color }}>💤</AppText>,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color }: { color: string }) => <AppText style={{ fontSize: 20, color }}>⚙️</AppText>,
        }}
      />
    </Tab.Navigator>
  );
}
