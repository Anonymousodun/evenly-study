import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabNavigator } from './TabNavigator';
import { SetupScreen } from '../screens/SetupScreen';
import { SupportScreen } from '../screens/SupportScreen';
import { BreaksScreen } from '../screens/BreaksScreen';
import { TaskFormScreen } from '../screens/TaskFormScreen';
import { TaskDetailScreen } from '../screens/TaskDetailScreen';
import { ScheduleFormScreen } from '../screens/ScheduleFormScreen';
import { WeeklyTrendScreen } from '../screens/WeeklyTrendScreen';
import { ReviewsScreen } from '../screens/ReviewsScreen';
import { CrunchScreen } from '../screens/CrunchScreen';
import { TipsScreen } from '../screens/TipsScreen';
import { ShareScreen } from '../screens/ShareScreen';
import { TimetableScanScreen } from '../screens/TimetableScanScreen';
import { SleepSettingsScreen } from '../screens/SleepSettingsScreen';
import { AuthScreen } from '../screens/AuthScreen';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { SplashScreen } from '../screens/SplashScreen';
import { HelpNowScreen } from '../screens/HelpNowScreen';
import { AISupportScreen } from '../screens/AISupportScreen';
import { useAppContext } from '../context/AppContext';
import { useSync } from '../hooks/useSync';
import { useSettingsSync } from '../hooks/useSettingsSync';
import { useTour } from '../components/tour/TourContext';
import { api, setSessionToken } from '../api/client';
import { loadSession, clearSession } from '../api/sessionStore';

const Stack = createNativeStackNavigator();

function SyncGate() {
  useSync();
  useSettingsSync();
  return null;
}

export function AppNavigator() {
  const { state, dispatch, theme } = useAppContext();
  const [restoring, setRestoring] = useState(true);
  const tour = useTour();

  // Restore a saved sign-in once at launch. Invalid or expired sessions
  // fall back to the logged-out flow.
  useEffect(() => {
    (async () => {
      try {
        if (!state.user) {
          const saved = await loadSession();
          if (saved) {
            setSessionToken(saved.token);
            try {
              const me = await api.get<{ profile: { id: string; email: string; name: string | null; target_bedtime: string | null } } & { user: unknown }>('/api/me');
              const now = new Date().toISOString();
              dispatch({
                type: 'SET_USER',
                payload: {
                  id: me.profile.id,
                  email: me.profile.email,
                  name: me.profile.name || saved.user.name || me.profile.email,
                  password_hash: '',
                  target_bedtime: me.profile.target_bedtime,
                  created_at: now,
                  updated_at: now,
                },
              });
            } catch {
              setSessionToken(null);
              await clearSession();
            }
          }
        }
      } finally {
        setRestoring(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const screenOptions = {
    headerShown: false,
    contentStyle: { backgroundColor: theme.colors.bg },
  };

  if (restoring && !state.user) {
    return (
      <View style={[styles.restoring, { backgroundColor: '#0B1520' }]}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  const leafPath = (navState: any): string => {
    let node = navState;
    const names: string[] = [];
    while (node && node.routes && typeof node.index === 'number') {
      const route = node.routes[node.index];
      if (!route) break;
      names.push(route.name);
      node = route.state;
    }
    return names.join('/');
  };

  return (
    <NavigationContainer
      onStateChange={(navState) => {
        const path = leafPath(navState);
        // eslint-disable-next-line no-console
        console.log('[Evenly route]', path);
        tour.noteNavigation(path);
      }}
    >
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
          <Stack.Screen name="ScheduleForm" component={ScheduleFormScreen} />
          <Stack.Screen name="WeeklyTrend" component={WeeklyTrendScreen} />
          <Stack.Screen name="Reviews" component={ReviewsScreen} />
          <Stack.Screen name="Crunch" component={CrunchScreen} />
          <Stack.Screen name="Tips" component={TipsScreen} />
          <Stack.Screen name="Share" component={ShareScreen} />
          <Stack.Screen name="TimetableScan" component={TimetableScanScreen} />
          <Stack.Screen name="SleepSettings" component={SleepSettingsScreen} />
        </Stack.Navigator>
        </>
      ) : (
        <Stack.Navigator screenOptions={screenOptions}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="HelpNow" component={HelpNowScreen} />
          <Stack.Screen name="Auth" component={AuthScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  restoring: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
