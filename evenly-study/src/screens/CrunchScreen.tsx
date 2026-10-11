import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAppContext } from '../context/AppContext';
import AppText from '../components/common/Text';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { getCrunchStatus, addDaysStr } from '../utils/crunch';

const DURATIONS = [3, 7, 14];

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

export function CrunchScreen({ navigation }: any) {
  const { state, dispatch, theme } = useAppContext();
  const [days, setDays] = useState(7);
  const status = getCrunchStatus(state.settings);

  const handleStart = () => {
    const start = todayStr();
    dispatch({ type: 'UPDATE_SETTINGS', payload: { crunch: { start, end: addDaysStr(start, days) } } });
    navigation.goBack();
  };

  const handleEndEarly = () => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { crunch: null } });
    navigation.goBack();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      <View style={styles.header}>
        <AppText variant="h1">Crunch Mode</AppText>
        <AppText variant="bodySmall" color="secondary">
          For exam seasons , protects sleep, meals and movement, drops the nice-to-haves
        </AppText>
      </View>

      {status.phase === 'active' && (
        <Card>
          <AppText variant="h2">Active , {status.daysLeft} day{status.daysLeft === 1 ? '' : 's'} left</AppText>
          <AppText variant="bodySmall" color="secondary" style={styles.line}>
            Short, frequent breaks. Minimum sleep protected. Long wind-downs and extra tips are paused.
          </AppText>
          <Button title="End early (start recovery)" onPress={handleEndEarly} variant="secondary" />
        </Card>
      )}

      {status.phase === 'recovery' && (
        <Card>
          <AppText variant="h2">Recovery , {status.daysLeft} day{status.daysLeft === 1 ? '' : 's'} left</AppText>
          <AppText variant="bodySmall" color="secondary" style={styles.line}>
            Longer, restorative breaks. Bedtime shifted 30 minutes earlier. No new heavy load for now.
          </AppText>
        </Card>
      )}

      {status.phase === 'off' && (
        <>
          <AppText variant="label" color="secondary">How long will the crunch last?</AppText>
          <View style={styles.chipRow}>
            {DURATIONS.map(d => (
              <TouchableOpacity
                key={d}
                style={[
                  styles.chip,
                  { borderColor: theme.colors.border },
                  days === d && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
                ]}
                onPress={() => setDays(d)}
              >
                <AppText variant="label" style={{ color: days === d ? '#FFFFFF' : theme.colors.text }}>
                  {d} days
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
          <Button title={`Start crunch mode (${days} days)`} onPress={handleStart} />
          <Button title="Not now" onPress={() => navigation.goBack()} variant="text" />
        </>
      )}

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
  line: {
    marginTop: 8,
    marginBottom: 16,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    marginBottom: 20,
  },
  chip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
});
