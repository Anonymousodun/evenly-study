import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useAppContext } from '../context/AppContext';
import AppText from '../components/common/Text';
import { Card } from '../components/common/Card';
import { CheckInSlider } from '../components/common/CheckInSlider';
import { Toast } from '../components/common/Toast';
import { generateId } from '../utils/id';
import { getReinforcementMessage } from '../utils/reinforcement';

export function CheckInScreen({ navigation }: any) {
  const { state, dispatch, theme } = useAppContext();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [bedtime] = useState(state.settings.targetBedtime || '23:00');
  const [wakeTime] = useState('07:00');
  const [restScore, setRestScore] = useState<number | null>(null);
  const [toast, setToast] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const handleMoodSelect = (score: number) => {
    setSelectedMood(score);
    dispatch({
      type: 'ADD_DAILY_CHECKIN',
      payload: {
        id: generateId(),
        user_id: state.user?.id || '',
        date: today,
        mood_score: score,
        created_at: new Date().toISOString(),
      },
    });
    setToast('Checked in');
    setTimeout(() => navigation.navigate('Home'), 800);
  };

  const handleRestSelect = (score: number) => {
    setRestScore(score);
    dispatch({
      type: 'ADD_SLEEP_CHECKIN',
      payload: {
        id: generateId(),
        user_id: state.user?.id || '',
        date: today,
        bedtime: bedtime,
        wake_time: wakeTime,
        rest_score: score,
        created_at: new Date().toISOString(),
      },
    });
    const message = getReinforcementMessage(state);
    setToast(message || 'Sleep logged');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      <View style={styles.header}>
        <AppText variant="h1">Daily Check-in</AppText>
        <AppText variant="bodySmall" color="secondary">How are you feeling today?</AppText>
      </View>

      <CheckInSlider value={selectedMood} onSelect={handleMoodSelect} />

      <Card>
        <AppText variant="label" color="secondary">Sleep Check-in</AppText>
        <AppText variant="bodySmall" style={styles.sleepSubtitle}>Last night's sleep</AppText>

        <View style={styles.timeRow}>
          <View style={styles.timeOption}>
            <AppText variant="h2">{bedtime}</AppText>
            <AppText variant="caption" color="secondary">Bedtime</AppText>
          </View>
          <View style={styles.timeOption}>
            <AppText variant="h2">{wakeTime}</AppText>
            <AppText variant="caption" color="secondary">Wake up</AppText>
          </View>
        </View>
      </Card>

      <AppText variant="bodySmall" color="secondary" style={styles.restLabel}>
        How rested do you feel?
      </AppText>

      <CheckInSlider value={restScore} onSelect={handleRestSelect} />

      <Toast message={toast} visible={toast !== ''} onHide={() => setToast('')} />

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
    marginBottom: 8,
  },
  sleepSubtitle: {
    marginTop: 4,
    marginBottom: 16,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  timeOption: {
    alignItems: 'center',
  },
  restLabel: {
    textAlign: 'center',
    marginTop: 16,
  },
});
