import React, { useRef } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator, BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/HomeScreen';
import { TasksScreen } from '../screens/TasksScreen';
import { ScheduleScreen } from '../screens/ScheduleScreen';
import { CheckInScreen } from '../screens/CheckInScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { useAppContext } from '../context/AppContext';
import { useTour } from '../components/tour/TourContext';
import { TourOverlay } from '../components/tour/TourOverlay';

const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, string> = {
  Home: 'home-outline',
  Tasks: 'clipboard-list-outline',
  Schedule: 'calendar-week-outline',
  CheckIn: 'sleep',
  Settings: 'cog-outline',
};

function MeasuredTabButton({ name, ...props }: BottomTabBarButtonProps & { name: string }) {
  const { setTabSpot } = useTour();
  const ref = useRef<any>(null);
  return (
    <TouchableOpacity
      {...(props as any)}
      ref={ref}
      onLayout={() => {
        ref.current?.measure(
          (_x: number, _y: number, width: number, height: number, pageX: number, pageY: number) => {
            setTabSpot(name, { x: pageX, y: pageY, width, height });
          }
        );
      }}
    />
  );
}

export function TabNavigator() {
  const { theme, state } = useAppContext();
  const { setContainerSpot } = useTour();
  const containerRef = useRef<any>(null);
  const userName = state.user?.name?.split(' ')[0];

  return (
    <View
      style={styles.root}
      ref={containerRef}
      onLayout={() => {
        containerRef.current?.measure(
          (_x: number, _y: number, _w: number, _h: number, pageX: number, pageY: number) => {
            setContainerSpot({ x: pageX, y: pageY, width: _w, height: _h });
          }
        );
      }}
    >
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
          tabBarButton: (props) => <MeasuredTabButton {...props} name={route.name} />,
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: userName ? `${userName}'s Day` : 'Home' }}
        />
        <Tab.Screen name="Tasks" component={TasksScreen} />
        <Tab.Screen name="Schedule" component={ScheduleScreen} />
        <Tab.Screen name="CheckIn" component={CheckInScreen} options={{ title: 'Check-in' }} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
      <TourOverlay />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
