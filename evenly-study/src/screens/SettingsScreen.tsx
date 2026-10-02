import React from 'react';
import { View, StyleSheet, ScrollView, Switch } from 'react-native';
import { useAppContext } from '../context/AppContext';
import AppText from '../components/common/Text';
import { Card } from '../components/common/Card';

export function SettingsScreen() {
  const { state, dispatch, isDark, toggleTheme } = useAppContext();

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? '#1A1A1A' : '#F7F5F0' }]}>
      <View style={styles.header}>
        <AppText variant="h1">Settings</AppText>
      </View>

      <Card>
        <AppText variant="label" color="secondary">Appearance</AppText>
        <View style={styles.settingRow}>
          <AppText variant="body">Dark mode</AppText>
          <Switch value={isDark} onValueChange={toggleTheme} />
        </View>
      </Card>

      <Card>
        <AppText variant="label" color="secondary">Sleep</AppText>
        <View style={styles.settingRow}>
          <AppText variant="body">Target bedtime</AppText>
          <AppText variant="body" color="secondary">{state.settings.targetBedtime}</AppText>
        </View>
        <View style={styles.settingRow}>
          <AppText variant="body">Wind-down reminder</AppText>
          <Switch
            value={state.settings.windDownReminder}
            onValueChange={(val) => dispatch({ type: 'UPDATE_SETTINGS', payload: { windDownReminder: val } })}
          />
        </View>
      </Card>

      <Card>
        <AppText variant="label" color="secondary">Study</AppText>
        <View style={styles.settingRow}>
          <AppText variant="body">Focus length</AppText>
          <AppText variant="body" color="secondary">{state.settings.focusLength} min</AppText>
        </View>
        <View style={styles.settingRow}>
          <AppText variant="body">Break length</AppText>
          <AppText variant="body" color="secondary">{state.settings.breakLength} min</AppText>
        </View>
      </Card>

      <Card>
        <AppText variant="label" color="secondary">Support</AppText>
        <View style={styles.settingRow}>
          <AppText variant="body">Region</AppText>
          <AppText variant="body" color="secondary">{state.settings.region}</AppText>
        </View>
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
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
});
