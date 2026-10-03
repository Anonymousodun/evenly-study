import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Vibration } from 'react-native';
import { useAppContext } from '../context/AppContext';
import AppText from '../components/common/Text';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Toast } from '../components/common/Toast';
import { BreakOption } from '../components/breaks/BreakOption';
import { useBreaks } from '../hooks/useBreaks';
import { useNotifications } from '../hooks/useNotifications';

interface BreakDef {
  id: string;
  icon: string;
  title: string;
  minutes: number;
  description: string;
}

const BREAK_OPTIONS: BreakDef[] = [
  { id: '1', icon: '👁️', title: 'Eyes-off-screen reset', minutes: 2, description: 'Look at something far away' },
  { id: '2', icon: '🌬️', title: 'Breathing exercise', minutes: 3, description: '4-7-8 breathing pattern' },
  { id: '3', icon: '🧘', title: 'Stretch sequence', minutes: 5, description: 'Neck, shoulders, back' },
  { id: '4', icon: '🚶', title: 'Quick walk', minutes: 10, description: 'Around the block' },
];

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function BreaksScreen({ navigation }: any) {
  const { state, theme } = useAppContext();
  const { logSkippedBreak, getSkipCount } = useBreaks();
  const { scheduleBreakReminder } = useNotifications();

  const [mode, setMode] = useState<'idle' | 'focus' | 'break'>('idle');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [selectedBreak, setSelectedBreak] = useState<BreakDef | null>(null);
  const [toast, setToast] = useState('');
  const [warmDismissed, setWarmDismissed] = useState(false);

  useEffect(() => {
    if (mode === 'idle') return;
    if (secondsLeft <= 0) {
      handleTimerEnd();
      return;
    }
    const t = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [mode, secondsLeft]);

  const handleTimerEnd = () => {
    Vibration.vibrate(500);
    if (mode === 'focus') {
      setMode('idle');
      setToast('Focus session done — pick a break 🌿');
    } else {
      setMode('idle');
      setSelectedBreak(null);
      setToast('Nice — rest is part of the work 🌿');
    }
  };

  const startFocus = () => {
    setSelectedBreak(null);
    setSecondsLeft(state.settings.focusLength * 60);
    setMode('focus');
  };

  const startBreak = (option: BreakDef) => {
    setSelectedBreak(option);
    setSecondsLeft(option.minutes * 60);
    setMode('break');
  };

  const cancelTimer = () => {
    setMode('idle');
    setSelectedBreak(null);
  };

  const handleSkipBreak = () => {
    logSkippedBreak();
    scheduleBreakReminder(15);
    setMode('idle');
    setSelectedBreak(null);
    setToast("Logged quietly — we'll nudge you in a bit");
  };

  const elevated = state.burnoutLevel !== 'green';
  const options = [...BREAK_OPTIONS].sort((a, b) =>
    elevated ? b.minutes - a.minutes : a.minutes - b.minutes
  );
  const showWarmCheckIn = getSkipCount(5) >= 3 && !warmDismissed;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      <View style={styles.header}>
        <AppText variant="h1">{mode === 'idle' ? 'Break Time' : mode === 'focus' ? 'Focus Session' : 'On a Break'}</AppText>
        <AppText variant="bodySmall" color="secondary">
          {mode === 'idle' ? 'Choose what feels right for you' : mode === 'focus' ? 'Stay with it — one session at a time' : selectedBreak?.title}
        </AppText>
      </View>

      {mode !== 'idle' ? (
        <View style={[styles.timerCard, { backgroundColor: theme.colors.surface }]}>
          <AppText style={styles.timerText}>{formatTime(secondsLeft)}</AppText>
          <AppText variant="bodySmall" color="secondary">
            {mode === 'focus' ? `Focusing for ${state.settings.focusLength} min` : `${selectedBreak?.minutes} min break`}
          </AppText>
          <View style={styles.timerActions}>
            <Button title="End" onPress={cancelTimer} variant="secondary" />
            {mode === 'break' && (
              <Button title="Skip break" onPress={handleSkipBreak} variant="text" />
            )}
          </View>
        </View>
      ) : (
        <View>
          <Card>
            <AppText variant="body">Start a {state.settings.focusLength}-minute focus session?</AppText>
            <Button title="▶ Start focus" onPress={startFocus} variant="secondary" />
          </Card>

          {elevated && (
            <AppText variant="bodySmall" color="secondary" style={styles.note}>
              Your load is building, so longer breaks are listed first today.
            </AppText>
          )}

          {options.map((option) => (
            <BreakOption
              key={option.id}
              icon={option.icon}
              title={option.title}
              duration={`${option.minutes} min`}
              description={option.description}
              onPress={() => startBreak(option)}
            />
          ))}
        </View>
      )}

      {showWarmCheckIn && (
        <Card>
          <AppText variant="label" color="secondary">💛 A gentle check-in</AppText>
          <AppText variant="body" style={styles.bannerText}>
            You've skipped breaks for a few days. How are you actually doing?
          </AppText>
          <View style={styles.warmActions}>
            <Button title="I'm okay" onPress={() => setWarmDismissed(true)} variant="secondary" />
            <Button title="Talk to someone" onPress={() => navigation.navigate('Support')} variant="text" />
          </View>
        </Card>
      )}

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
    marginBottom: 24,
  },
  note: {
    marginBottom: 12,
    textAlign: 'center',
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
    marginBottom: 8,
  },
  timerActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    alignItems: 'center',
  },
  bannerText: {
    marginTop: 8,
    lineHeight: 24,
  },
  warmActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
    alignItems: 'center',
  },
});
