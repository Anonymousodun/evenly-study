import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/HomeScreen';
import { TasksScreen } from '../screens/TasksScreen';
import { CheckInScreen } from '../screens/CheckInScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { useAppContext } from '../context/AppContext';

const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, string> = {
  Home: 'home-outline',
  Tasks: 'clipboard-list-outline',
  CheckIn: 'sleep',
  Settings: 'cog-outline',
};

export function TabNavigator() {
  const { theme, state } = useAppContext();
  const userName = state.user?.name?.split(' ')[0];

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          height: 80,
          paddingBottom: 20,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarIcon: ({ color, size }: { color: string; size: number }) => (
          <MaterialCommunityIcons name={(TAB_ICONS[route.name] ?? 'circle-outline') as any} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: userName ? `${userName}'s Day` : 'Home' }}
      />
      <Tab.Screen name="Tasks" component={TasksScreen} />
      <Tab.Screen name="CheckIn" component={CheckInScreen} options={{ title: 'Check-in' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
