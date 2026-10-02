import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAppContext } from '../context/AppContext';
import AppText from '../components/common/Text';
import { Button } from '../components/common/Button';
import { generateId } from '../utils/id';

interface BreakOption {
  id: string;
  icon: string;
  title: string;
  duration: string;
  description: string;
}

const BREAK_OPTIONS: BreakOption[] = [
  { id: '1', icon: '👁️', title: 'Eyes-off-screen reset', duration: '2 min', description: 'Look at something far away' },
  { id: '2', icon: '🌬️', title: 'Breathing exercise', duration: '3 min', description: '4-7-8 breathing pattern' },
  { id: '3', icon: '🧘', title: 'Stretch sequence', duration: '5 min', description: 'Neck, shoulders, back' },
  { id: '4', icon: '🚶', title: 'Quick walk', duration: '10 min', description: 'Around the block' },
];

export function BreaksScreen() {
  const { theme, dispatch } = useAppContext();
  const [selectedBreak, setSelectedBreak] = useState<BreakOption | null>(null);
  const [timerActive, setTimerActive] = useState(false);

  const handleBreakSelect = (breakOption: BreakOption) => {
    setSelectedBreak(breakOption);
    setTimerActive(true);
  };

  const handleSkipBreak = () => {
    const today = new Date().toISOString().split('T')[0];
    dispatch({
      type: 'LOG_SKIPPED_BREAK',
      payload: {
        id: generateId(),
        user_id: '',
        date: today,
        count: 1,
        created_at: new Date().toISOString(),
      },
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      <View style={styles.header}>
        <AppText variant="h1">Break Time</AppText>
        <AppText variant="bodySmall" color="secondary">Choose what feels right for you</AppText>
      </View>

      {timerActive && selectedBreak ? (
        <View style={[styles.timerCard, { backgroundColor: theme.colors.surface }]}>
          <AppText variant="indicator" style={styles.timerText}>00:00</AppText>
          <AppText variant="h2" style={styles.timerTitle}>{selectedBreak.title}</AppText>
          <AppText variant="bodySmall" color="secondary">{selectedBreak.description}</AppText>
          <Button title="End Break" onPress={() => setTimerActive(false)} variant="secondary" style={styles.endBtn} />
        </View>
      ) : (
        <View>
          {BREAK_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[styles.breakCard, { backgroundColor: theme.colors.surface }]}
              onPress={() => handleBreakSelect(option)}
            >
              <View style={[styles.breakIcon, { backgroundColor: theme.colors.bg }]}>
                <AppText style={styles.breakIconText}>{option.icon}</AppText>
              </View>
              <View style={styles.breakInfo}>
                <AppText variant="body">{option.title}</AppText>
                <AppText variant="caption" color="secondary">{option.duration} · {option.description}</AppText>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Button title="Skip break" onPress={handleSkipBreak} variant="text" />

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
  breakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  breakIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  breakIconText: {
    fontSize: 24,
  },
  breakInfo: {
    flex: 1,
  },
  timerCard: {
    alignItems: 'center',
    padding: 32,
    borderRadius: 12,
    marginBottom: 16,
  },
  timerText: {
    fontSize: 48,
    fontWeight: '300',
    marginBottom: 16,
  },
  timerTitle: {
    marginBottom: 8,
  },
  endBtn: {
    marginTop: 24,
  },
});
