import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAppContext } from '../context/AppContext';
import AppText from '../components/common/Text';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { ProgressBar } from '../components/common/ProgressBar';
import { TimePicker } from '../components/common/TimePicker';
import { IndicatorBadge } from '../components/burnout/IndicatorBadge';
import { TaskTemplatePicker, getTemplateDefaults } from '../components/tasks/TaskTemplatePicker';
import { generateId } from '../utils/id';
import { getBurnoutSuggestion } from '../utils/burnoutAlgorithm';
import { TaskType, TaskEffort } from '../types';

const BEDTIME_OPTIONS = ['22:00', '23:00', '00:00', '01:00'];

const WINDOW_PRESETS = [
  { label: 'Morning', start: '09:00', end: '12:00' },
  { label: 'Afternoon', start: '13:00', end: '17:00' },
  { label: 'Evening', start: '18:00', end: '21:00' },
];

const TOTAL_STEPS = 5;

interface QuickTask {
  id: string;
  title: string;
  type: TaskType;
  effort: TaskEffort;
}

function datePlusDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export function SetupScreen({ navigation }: any) {
  const { state, dispatch, theme } = useAppContext();
  const [step, setStep] = useState(0);
  const [bedtime, setBedtime] = useState('23:00');
  const [windows, setWindows] = useState<{ start: string; end: string }[]>([
    { start: '09:00', end: '17:00' },
  ]);
  const [quickTasks, setQuickTasks] = useState<QuickTask[]>([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskType, setTaskType] = useState<TaskType | null>(null);

  const toggleWindow = (preset: { start: string; end: string }) => {
    const exists = windows.some(w => w.start === preset.start && w.end === preset.end);
    if (exists) {
      setWindows(windows.filter(w => !(w.start === preset.start && w.end === preset.end)));
    } else {
      setWindows([...windows, preset]);
    }
  };

  const addQuickTask = () => {
    if (quickTasks.length >= 3) return;
    if (taskTitle.trim() && taskType) {
      setQuickTasks([
        ...quickTasks,
        { id: generateId(), title: taskTitle.trim(), type: taskType, effort: getTemplateDefaults(taskType).effort },
      ]);
      setTaskTitle('');
      setTaskType(null);
    } else if (taskType) {
      const label = taskType === 'group-project' ? 'Group Project' : taskType.charAt(0).toUpperCase() + taskType.slice(1);
      setQuickTasks([
        ...quickTasks,
        { id: generateId(), title: label, type: taskType, effort: getTemplateDefaults(taskType).effort },
      ]);
      setTaskType(null);
    }
  };

  const removeQuickTask = (id: string) => {
    setQuickTasks(quickTasks.filter(t => t.id !== id));
  };

  const finishSetup = () => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { targetBedtime: bedtime, studyWindows: windows } });
    quickTasks.forEach(t => {
      dispatch({
        type: 'ADD_TASK',
        payload: {
          id: t.id,
          user_id: state.user?.id || '',
          title: t.title,
          type: t.type,
          effort: t.effort,
          due_date: datePlusDays(3),
          completed: false,
          created_at: new Date().toISOString(),
        },
      });
    });
    navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
  };

  const next = () => setStep(Math.min(step + 1, TOTAL_STEPS - 1));
  const back = () => setStep(Math.max(step - 1, 0));

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      <ProgressBar steps={TOTAL_STEPS} currentStep={step} />

      {step === 0 && (
        <View>
          <View style={styles.header}>
            <AppText variant="display">👋</AppText>
            <AppText variant="h1" style={styles.title}>Welcome to Evenly Study</AppText>
            <AppText variant="bodySmall" color="secondary" style={styles.subtitle}>
              Keep going without falling apart
            </AppText>
          </View>
          <Card>
            <AppText variant="body" style={styles.bullet}>🌿 One calm indicator for your burnout risk</AppText>
            <AppText variant="body" style={styles.bullet}>⏸️ Well-timed breaks that fit your day</AppText>
            <AppText variant="body" style={styles.bullet}>🌙 Protected sleep, every night</AppText>
          </Card>
          <AppText variant="caption" color="secondary" style={styles.note}>
            Setup takes under 2 minutes. Skip anything you like.
          </AppText>
          <Button title="Let's get started" onPress={next} />
        </View>
      )}

      {step === 1 && (
        <View>
          <View style={styles.header}>
            <AppText variant="h1" style={styles.title}>When do you usually sleep?</AppText>
            <AppText variant="bodySmall" color="secondary" style={styles.subtitle}>
              We'll protect your rest time
            </AppText>
          </View>
          <TimePicker label="Target bedtime" value={bedtime} options={BEDTIME_OPTIONS} onSelect={setBedtime} />
          <Button title="Continue" onPress={next} />
          <Button title="Back" onPress={back} variant="text" />
        </View>
      )}

      {step === 2 && (
        <View>
          <View style={styles.header}>
            <AppText variant="h1" style={styles.title}>When do you study?</AppText>
            <AppText variant="bodySmall" color="secondary" style={styles.subtitle}>
              Pick the windows that fit your day
            </AppText>
          </View>
          {WINDOW_PRESETS.map(preset => {
            const selected = windows.some(w => w.start === preset.start && w.end === preset.end);
            return (
              <TouchableOpacity
                key={preset.label}
                style={[
                  styles.windowCard,
                  { backgroundColor: theme.colors.surface },
                  selected && { borderColor: theme.colors.primary, borderWidth: 2 },
                ]}
                onPress={() => toggleWindow(preset)}
              >
                <AppText variant="body">{preset.label}</AppText>
                <AppText variant="caption" color="secondary">{preset.start} – {preset.end}</AppText>
              </TouchableOpacity>
            );
          })}
          <Button title="Continue" onPress={next} />
          <Button title="Back" onPress={back} variant="text" />
        </View>
      )}

      {step === 3 && (
        <View>
          <View style={styles.header}>
            <AppText variant="h1" style={styles.title}>What are you working on?</AppText>
            <AppText variant="bodySmall" color="secondary" style={styles.subtitle}>
              Add up to 3 tasks ({quickTasks.length}/3)
            </AppText>
          </View>
          <TaskTemplatePicker selected={taskType} onSelect={setTaskType} />
          <Input
            value={taskTitle}
            onChangeText={setTaskTitle}
            placeholder="Task title (optional)"
          />
          <Button title="+ Quick add" onPress={addQuickTask} variant="secondary" />
          {quickTasks.map(t => (
            <View key={t.id} style={[styles.addedTask, { backgroundColor: theme.colors.surface }]}>
              <AppText variant="body">{t.title}</AppText>
              <TouchableOpacity onPress={() => removeQuickTask(t.id)}>
                <AppText variant="body" color="secondary">✕</AppText>
              </TouchableOpacity>
            </View>
          ))}
          <Button title="Continue" onPress={next} />
          <Button title="Back" onPress={back} variant="text" />
        </View>
      )}

      {step === 4 && (
        <View style={styles.centered}>
          <IndicatorBadge level="green" />
          <AppText variant="h2" style={styles.title}>{getBurnoutSuggestion('green')}</AppText>
          <AppText variant="bodySmall" color="secondary" style={styles.subtitle}>
            You're all set. Check in daily and we'll keep an eye on your balance.
          </AppText>
          <Button title="Start using Evenly Study" onPress={finishSetup} />
        </View>
      )}

      <View style={{ height: 60 }} />
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
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginTop: 12,
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 4,
  },
  bullet: {
    marginBottom: 12,
    lineHeight: 24,
  },
  note: {
    textAlign: 'center',
    marginBottom: 24,
  },
  windowCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  addedTask: {
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  centered: {
    alignItems: 'center',
  },
});
