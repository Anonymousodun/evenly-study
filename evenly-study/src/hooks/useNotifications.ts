import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { useAppContext } from '../context/AppContext';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export function useNotifications() {
  const { state } = useAppContext();

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.log('Notification permissions not granted');
    }
  };

  const scheduleWindDownReminder = async () => {
    if (!state.settings.windDownReminder) return;

    const [hour, minute] = state.settings.targetBedtime.split(':').map(Number);
    const windDownHour = hour - 1;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Time to wind down',
        body: 'Your body deserves rest. Start wrapping up.',
        sound: false,
      },
      trigger: {
        hour: windDownHour,
        minute: minute,
        repeats: true,
      },
    });
  };

  const scheduleBreakReminder = async (delayMinutes: number = 15) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Want a quick breather?',
        body: 'You skipped a break earlier. Take 2 minutes to reset.',
        sound: false,
      },
      trigger: {
        seconds: delayMinutes * 60,
      },
    });
  };

  const scheduleMorningCheckIn = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Good morning',
        body: 'How did you sleep? Take 10 seconds to check in.',
        sound: false,
      },
      trigger: {
        hour: 8,
        minute: 0,
        repeats: true,
      },
    });
  };

  const cancelAllNotifications = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
  };

  return {
    scheduleWindDownReminder,
    scheduleBreakReminder,
    scheduleMorningCheckIn,
    cancelAllNotifications,
  };
}
