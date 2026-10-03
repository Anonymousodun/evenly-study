import React from 'react';
import { View, StyleSheet, ScrollView, Switch } from 'react-native';
import { useAppContext } from '../context/AppContext';
import AppText from '../components/common/Text';
import { Card } from '../components/common/Card';
import { useNotifications } from '../hooks/useNotifications';
import { calculateCutoffTime, getWindDownTime } from '../utils/sleepProtection';

function formatTime(date: Date): string {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

export function SleepSettingsScreen() {
  const { state, dispatch, theme } = useAppContext();
  const { scheduleWindDownReminder, cancelAllNotifications } = useNotifications();

  const cutoff = calculateCutoffTime(state.settings.targetBedtime);
  const windDown = getWindDownTime(state.settings.targetBedtime);

  const recentShortNights = state.sleep
    .slice(-7)
    .filter(s => {
      const [bedH, bedM] = s.bedtime.split(':').map(Number);
      const [wakeH, wakeM] = s.wake_time.split(':').map(Number);
      let bed = bedH * 60 + bedM;
      let wake = wakeH * 60 + wakeM;
      if (wake < bed) wake += 24 * 60;
      return (wake - bed) / 60 < 6;
    }).length;

  const handleToggleReminder = (value: boolean) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { windDownReminder: value } });
    if (value) {
      scheduleWindDownReminder();
    } else {
      cancelAllNotifications();
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      <View style={styles.header}>
        <AppText variant="h1">Sleep Settings</AppText>
        <AppText variant="bodySmall" color="secondary">Protect your rest time</AppText>
      </View>

      <Card>
        <AppText variant="label" color="secondary">Target Bedtime</AppText>
        <AppText variant="h2" style={styles.bedtime}>{state.settings.targetBedtime}</AppText>
        <AppText variant="caption" color="secondary">We'll remind you to wind down before this time</AppText>
      </Card>

      <Card>
        <AppText variant="label" color="secondary">Work Cutoff</AppText>
        <AppText variant="h2" style={styles.bedtime}>{formatTime(cutoff)}</AppText>
        <AppText variant="caption" color="secondary">
          After this time the app gently suggests moving work to tomorrow
        </AppText>
      </Card>

      <Card>
        <View style={styles.settingRow}>
          <View>
            <AppText variant="body">Wind-down reminder</AppText>
            <AppText variant="caption" color="secondary">
              Daily at {formatTime(windDown)} (30 min before bed)
            </AppText>
          </View>
          <Switch
            value={state.settings.windDownReminder}
            onValueChange={handleToggleReminder}
          />
        </View>
      </Card>

      {recentShortNights >= 2 && (
        <Card>
          <AppText variant="label" color="secondary">💤 Sleep notice</AppText>
          <AppText variant="bodySmall" style={styles.description}>
            You've had {recentShortNights} short nights recently. Several short nights in a row during a heavy week move your indicator toward yellow or red faster.
          </AppText>
        </Card>
      )}

      <Card>
        <AppText variant="label" color="secondary">How it works</AppText>
        <AppText variant="bodySmall" style={styles.description}>
          Your sleep data feeds into the burnout indicator. Consistent bedtimes keep your rhythm steady and your mind clearer.
        </AppText>
      </Card>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 24,
  },
  bedtime: {
    marginTop: 8,
    marginBottom: 4,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  description: {
    marginTop: 8,
    lineHeight: 20,
  },
});
