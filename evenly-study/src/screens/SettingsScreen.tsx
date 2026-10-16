import React, { useState, useEffect } from 'react';
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
import { Input } from '../components/common/Input';
import {
  saveR2Config,
  loadR2Config,
  backupFileKey,
  uploadBackup,
  downloadBackup,
} from '../api/r2';
import { serializeBackup, parseBackup } from '../utils/backup';
const REVIEW_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function SettingsScreen({ navigation }: any) {
  const { state, dispatch, theme, isDark, toggleTheme } = useAppContext();
  const tour = useTour();
  const [r2endpoint, setR2Endpoint] = useState('');
  const [r2bucket, setR2Bucket] = useState('evenly-study-backups');
  const [r2keyId, setR2KeyId] = useState('');
  const [r2secret, setR2Secret] = useState('');
  const [r2saved, setR2Saved] = useState(false);
  const [backupMsg, setBackupMsg] = useState('');
  const [backupBusy, setBackupBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const cfg = await loadR2Config();
      if (cfg) {
        setR2Endpoint(cfg.endpoint);
        setR2Bucket(cfg.bucket);
        setR2KeyId(cfg.keyId);
        setR2Saved(true);
      }
    })();
  }, []);

  const handleLogout = async () => {
    await signOut();
    dispatch({ type: 'SET_USER', payload: null });
  };

  const handleSaveR2 = async () => {
    setBackupMsg('');
    if (!r2endpoint.trim() || !r2bucket.trim() || !r2keyId.trim() || !r2secret.trim()) {
      setBackupMsg('Fill in all four backup fields first.');
      return;
    }
    await saveR2Config({
      endpoint: r2endpoint.trim(),
      bucket: r2bucket.trim(),
      keyId: r2keyId.trim(),
      secret: r2secret.trim(),
    });
    setR2Secret('');
    setR2Saved(true);
    setBackupMsg('Backup details saved on this phone.');
  };

  const handleBackupNow = async () => {
    setBackupMsg('');
    if (!state.user || state.user.id === 'demo-user') {
      setBackupMsg('Sign in with an account first. Demo data stays on this phone.');
      return;
    }
    const cfg = await loadR2Config();
    if (!cfg) {
      setBackupMsg('Save your backup details first.');
      return;
    }
    setBackupBusy(true);
    try {
      await uploadBackup(cfg, backupFileKey(state.user.id), serializeBackup(state));
      setBackupMsg('Backed up just now.');
    } catch {
      setBackupMsg('Backup failed. Check the details and connection.');
    } finally {
      setBackupBusy(false);
    }
  };

  const handleRestore = async () => {
    setBackupMsg('');
    if (!state.user || state.user.id === 'demo-user') {
      setBackupMsg('Sign in with an account first, then restore.');
      return;
    }
    const cfg = await loadR2Config();
    if (!cfg) {
      setBackupMsg('Save your backup details first.');
      return;
    }
    setBackupBusy(true);
    try {
      const json = await downloadBackup(cfg, backupFileKey(state.user.id));
      const data = parseBackup(json);
      dispatch({
        type: 'LOAD_DATA',
        payload: {
          tasks: data.tasks,
          sleep: data.sleep,
          dailyCheckIns: data.dailyCheckIns,
          skippedBreaks: data.skippedBreaks,
          schedule: data.schedule,
        },
      });
      dispatch({ type: 'UPDATE_SETTINGS', payload: data.settings });
      setBackupMsg('Restore complete.');
    } catch {
      setBackupMsg('Restore failed. Check the details and connection.');
    } finally {
      setBackupBusy(false);
    }
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

      <Card>
        <AppText variant="label" color="secondary">Cloud backup</AppText>
        <AppText variant="bodySmall" color="secondary" style={styles.regionHint}>
          Keys stay in this phone's keychain. Never passwords, never tokens.
        </AppText>
        <Input label="Endpoint" value={r2endpoint} onChangeText={setR2Endpoint} placeholder="https://<account>.r2.cloudflarestorage.com" autoCapitalize="none" />
        <Input label="Bucket" value={r2bucket} onChangeText={setR2Bucket} placeholder="evenly-study-backups" autoCapitalize="none" />
        <Input label="Access key ID" value={r2keyId} onChangeText={setR2KeyId} placeholder="R2 access key" autoCapitalize="none" />
        <Input label="Secret access key" value={r2secret} onChangeText={setR2Secret} placeholder={r2saved ? 'Saved (enter to replace)' : 'R2 secret'} autoCapitalize="none" secureTextEntry />
        {!!backupMsg && (
          <AppText variant="bodySmall" color="secondary" style={styles.backupMsg}>{backupMsg}</AppText>
        )}
        <Button title="Save backup details" onPress={handleSaveR2} variant="secondary" />
        <View style={styles.backupRow}>
          <View style={styles.backupBtn}>
            <Button title={backupBusy ? 'Working…' : 'Back up now'} onPress={handleBackupNow} disabled={backupBusy} />
          </View>
          <View style={styles.backupBtn}>
            <Button title="Restore" onPress={handleRestore} disabled={backupBusy} variant="secondary" />
          </View>
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
  backupMsg: {
    marginVertical: 8,
  },
  backupRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  backupBtn: {
    flex: 1,
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
