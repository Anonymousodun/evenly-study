import React from 'react';
import { View, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import AppText from '../components/common/Text';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { signOut } from '../api/auth';

const REGIONS = ['US', 'UK', 'CA', 'AU'];

export function SettingsScreen({ navigation }: any) {
  const { state, dispatch, theme, isDark, toggleTheme } = useAppContext();

  const handleLogout = async () => {
    await signOut();
    dispatch({ type: 'SET_USER', payload: null });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      <View style={styles.header}>
        <AppText variant="h1">Settings</AppText>
        {state.user && (
          <AppText variant="bodySmall" color="secondary">
            Signed in as {state.user.name || state.user.email}
          </AppText>
        )}
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
        <TouchableOpacity
          style={styles.linkRow}
          onPress={() => navigation.navigate('SleepSettings')}
        >
          <AppText variant="body">Sleep settings</AppText>
          <MaterialCommunityIcons name="chevron-right" size={22} color={theme.colors.textSecondary} />
        </TouchableOpacity>
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
        <AppText variant="label" color="secondary">Support region</AppText>
        <View style={styles.regionRow}>
          {REGIONS.map(region => {
            const selected = state.settings.region === region;
            return (
              <TouchableOpacity
                key={region}
                style={[
                  styles.regionBtn,
                  { backgroundColor: selected ? theme.colors.primary : theme.colors.bg },
                ]}
                onPress={() => dispatch({ type: 'UPDATE_SETTINGS', payload: { region } })}
              >
                <AppText
                  variant="label"
                  style={{ color: selected ? '#FFFFFF' : theme.colors.text }}
                >
                  {region}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </Card>

      <Button title="Log out" onPress={handleLogout} variant="text" />

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
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  regionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  regionBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
});
