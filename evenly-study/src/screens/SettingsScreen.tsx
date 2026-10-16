import React from 'react';
import { View, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import AppText from '../components/common/Text';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { CountryPicker, countryByCode } from '../components/common/CountryPicker';
import { signOut } from '../api/auth';
import { api } from '../api/client';
import { useTour } from '../components/tour/TourContext';
const REVIEW_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function SettingsScreen({ navigation }: any) {
  const { state, dispatch, theme, isDark, toggleTheme } = useAppContext();
  const tour = useTour();

  const handleLogout = async () => {
    await signOut();
    dispatch({ type: 'SET_USER', payload: null });
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete account?',
      'This permanently erases your account and all of its data. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.del('/api/me/account');
            } catch {
              // Server unreachable: still clear local state below.
            }
            await signOut();
            dispatch({ type: 'RESET_DATA' });
          },
        },
      ]
    );
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
        <AppText variant="label" color="secondary">Weekly review</AppText>
        <View style={styles.settingRow}>
          <AppText variant="body">Review reminder</AppText>
          <Switch
            value={state.settings.reviewReminder}
            onValueChange={(val) => dispatch({ type: 'UPDATE_SETTINGS', payload: { reviewReminder: val } })}
          />
        </View>
        <AppText variant="bodySmall" color="secondary" style={styles.reviewLabel}>
          Review day
        </AppText>
        <View style={styles.regionRow}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((short, i) => {
            const selected = state.settings.reviewDay === REVIEW_DAYS[i];
            return (
              <TouchableOpacity
                key={short}
                style={[
                  styles.dayBtn,
                  { backgroundColor: selected ? theme.colors.primary : theme.colors.bg },
                ]}
                onPress={() => dispatch({ type: 'UPDATE_SETTINGS', payload: { reviewDay: REVIEW_DAYS[i] } })}
              >
                <AppText
                  variant="label"
                  style={{ color: selected ? '#FFFFFF' : theme.colors.text }}
                >
                  {short}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>
        <TouchableOpacity
          style={styles.linkRow}
          onPress={() => navigation.navigate('Reviews')}
        >
          <AppText variant="body">Past reviews</AppText>
          <MaterialCommunityIcons name="chevron-right" size={22} color={theme.colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.linkRow}
          onPress={() => navigation.navigate('Share')}
        >
          <AppText variant="body">Share with an advisor</AppText>
          <MaterialCommunityIcons name="chevron-right" size={22} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </Card>

      <Card>
        <AppText variant="label" color="secondary">Country and support region</AppText>
        <AppText variant="bodySmall" color="secondary" style={styles.regionHint}>
          Helplines and resources match {countryByCode(state.settings.region).name}.
        </AppText>
        <CountryPicker
          selected={state.settings.region}
          onSelect={(code) => dispatch({ type: 'UPDATE_SETTINGS', payload: { region: code } })}
        />
      </Card>

      <Button title="Delete account" onPress={handleDeleteAccount} variant="text" />
      <Button
        title="Take the tour again"
        variant="secondary"
        onPress={() => {
          navigation.navigate('Home');
          setTimeout(() => tour.startTour(), 400);
        }}
      />
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
  regionHint: {
    marginTop: 4,
    marginBottom: 12,
  },
  dayBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  reviewLabel: {
    marginTop: 12,
  },
});
