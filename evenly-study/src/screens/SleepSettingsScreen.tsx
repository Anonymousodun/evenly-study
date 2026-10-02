import React from 'react';
import { View, StyleSheet, ScrollView, Switch } from 'react-native';
import { useAppContext } from '../context/AppContext';
import AppText from '../components/common/Text';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

export function SleepSettingsScreen() {
  const { state, dispatch, theme } = useAppContext();

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
        <View style={styles.settingRow}>
          <View>
            <AppText variant="body">Wind-down reminder</AppText>
            <AppText variant="caption" color="secondary">30 minutes before bedtime</AppText>
          </View>
          <Switch
            value={state.settings.windDownReminder}
            onValueChange={(val) => dispatch({ type: 'UPDATE_SETTINGS', payload: { windDownReminder: val } })}
          />
        </View>
      </Card>

      <Card>
        <AppText variant="label" color="secondary">How it works</AppText>
        <AppText variant="bodySmall" style={styles.description}>
          Your sleep data feeds into the burnout indicator. Several short nights in a row during a heavy week will move the indicator toward yellow or red faster.
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
