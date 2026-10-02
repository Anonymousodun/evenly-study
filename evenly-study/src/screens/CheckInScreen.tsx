import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAppContext } from '../context/AppContext';
import AppText from '../components/common/Text';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { generateId } from '../utils/id';

const MOODS = ['😞', '😕', '😐', '🙂', '😊'];

export function CheckInScreen() {
  const { state, dispatch, theme } = useAppContext();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [bedtime, setBedtime] = useState(state.settings.targetBedtime || '23:00');
  const [wakeTime, setWakeTime] = useState('07:00');
  const [restScore, setRestScore] = useState<number | null>(null);

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
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      <View style={styles.header}>
        <AppText variant="h1">Daily Check-in</AppText>
        <AppText variant="bodySmall" color="secondary">How are you feeling today?</AppText>
      </View>

      <View style={styles.moodRow}>
        {MOODS.map((mood, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.moodCircle,
              { backgroundColor: theme.colors.surface },
              selectedMood === index + 1 && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
            ]}
            onPress={() => handleMoodSelect(index + 1)}
          >
            <AppText style={styles.moodEmoji}>{mood}</AppText>
          </TouchableOpacity>
        ))}
      </View>

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

      <View style={styles.moodRow}>
        {MOODS.map((mood, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.moodCircle,
              { backgroundColor: theme.colors.surface },
              restScore === index + 1 && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
            ]}
            onPress={() => handleRestSelect(index + 1)}
          >
            <AppText style={styles.moodEmoji}>{mood}</AppText>
          </TouchableOpacity>
        ))}
      </View>

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
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 24,
  },
  moodCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  moodEmoji: {
    fontSize: 24,
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
