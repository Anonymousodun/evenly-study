import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabNavigator } from './TabNavigator';
import { SetupScreen } from '../screens/SetupScreen';
import { SupportScreen } from '../screens/SupportScreen';
import { BreaksScreen } from '../screens/BreaksScreen';
import { TaskFormScreen } from '../screens/TaskFormScreen';
import { TaskDetailScreen } from '../screens/TaskDetailScreen';
import { WeeklyTrendScreen } from '../screens/WeeklyTrendScreen';
import { SleepSettingsScreen } from '../screens/SleepSettingsScreen';
import { AuthScreen } from '../screens/AuthScreen';
import { AISupportScreen } from '../screens/AISupportScreen';
import { useAppContext } from '../context/AppContext';
import { useSync } from '../hooks/useSync';

const Stack = createNativeStackNavigator();

function SyncGate() {
  useSync();
  return null;
}

export function AppNavigator() {
  const { state, theme } = useAppContext();

  const screenOptions = {
    headerShown: false,
    contentStyle: { backgroundColor: theme.colors.bg },
  };

  return (
    <NavigationContainer>
      {state.user ? (
        <>
        <SyncGate />
        <Stack.Navigator
          screenOptions={screenOptions}
          initialRouteName={state.settings.setupComplete ? 'MainTabs' : 'Setup'}
        >
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen name="Setup" component={SetupScreen} />
          <Stack.Screen name="Support" component={SupportScreen} />
          <Stack.Screen name="AISupport" component={AISupportScreen} />
          <Stack.Screen name="Breaks" component={BreaksScreen} />
          <Stack.Screen name="TaskForm" component={TaskFormScreen} />
          <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
          <Stack.Screen name="WeeklyTrend" component={WeeklyTrendScreen} />
          <Stack.Screen name="SleepSettings" component={SleepSettingsScreen} />
        </Stack.Navigator>
        </>
      ) : (
        <Stack.Navigator screenOptions={screenOptions}>
          <Stack.Screen name="Auth" component={AuthScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
