import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import AppText from '../components/common/Text';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { ProgressBar } from '../components/common/ProgressBar';
import { TimePicker } from '../components/common/TimePicker';
import { IndicatorBadge } from '../components/burnout/IndicatorBadge';
import { TaskTemplatePicker, getTemplateDefaults } from '../components/tasks/TaskTemplatePicker';
import { useTasks } from '../hooks/useTasks';
import { generateId } from '../utils/id';
import { getBurnoutSuggestion } from '../utils/burnoutAlgorithm';
import { TaskType, TaskEffort } from '../types';

const BEDTIME_OPTIONS = ['22:00', '23:00', '00:00', '01:00'];

const WINDOW_PRESETS = [
  { label: 'Morning', start: '09:00', end: '12:00' },
  { label: 'Afternoon', start: '13:00', end: '17:00' },
  { label: 'Evening', start: '18:00', end: '21:00' },
];

const REASONS = ['Not sleeping well', 'Hard to focus', 'Constant stress', 'Not taking breaks'];

const TOTAL_STEPS = 7;

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

function WhyLine({ children }: { children: React.ReactNode }) {
  const { theme } = useAppContext();
  return (
    <AppText variant="caption" style={{ color: theme.colors.textSecondary, marginBottom: 16 }}>
      {children}
    </AppText>
  );
}

function PrivacyFooter() {
  const { theme } = useAppContext();
  return (
    <AppText variant="caption" style={{ ...styles.privacy, color: theme.colors.textSecondary }}>
      Your data is private. We never share it with your school, your parents, or anyone else unless you choose to.
    </AppText>
  );
}

export function SetupScreen({ navigation }: any) {
  const { state, dispatch, theme } = useAppContext();
  const { addTask } = useTasks();
  const [step, setStep] = useState(0);
  const [bedtime, setBedtime] = useState('23:00');
  const [windows, setWindows] = useState<{ start: string; end: string }[]>([
    { start: '09:00', end: '17:00' },
  ]);
  const [quickTasks, setQuickTasks] = useState<QuickTask[]>([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskType, setTaskType] = useState<TaskType | null>(null);
  const [reasons, setReasons] = useState<string[]>([]);

  const toggleWindow = (preset: { start: string; end: string }) => {
    const exists = windows.some(w => w.start === preset.start && w.end === preset.end);
    if (exists) {
      setWindows(windows.filter(w => !(w.start === preset.start && w.end === preset.end)));
    } else {
      setWindows([...windows, preset]);
    }
  };

  const toggleReason = (reason: string) => {
    if (reasons.includes(reason)) {
      const next = reasons.filter(r => r !== reason);
      setReasons(next);
      dispatch({ type: 'UPDATE_SETTINGS', payload: { reasons: next } });
    } else if (reasons.length < 2) {
      const next = [...reasons, reason];
      setReasons(next);
      dispatch({ type: 'UPDATE_SETTINGS', payload: { reasons: next } });
    }
  };

  const setNotifications = (on: boolean) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { windDownReminder: on, reviewReminder: on } });
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

  const ensureDemoUser = () => {
    if (!state.user) {
      const now = new Date().toISOString();
      dispatch({
        type: 'SET_USER',
        payload: {
          id: 'demo-user',
          email: 'demo@evenly.app',
          name: 'Demo Student',
          password_hash: '',
          target_bedtime: '23:00',
          created_at: now,
          updated_at: now,
        },
      });
    }
  };

  const finishSetup = async () => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { targetBedtime: bedtime, studyWindows: windows, setupComplete: true } });
    for (const t of quickTasks) {
      try {
        await addTask(t.title, t.type, t.effort, datePlusDays(3));
      } catch {
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
      }
    }
    navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
  };

  // Skip: defaults, labelled in the UI. Reminders stay off until asked for.
  const skipSetup = () => {
    ensureDemoUser();
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: { setupComplete: true, windDownReminder: false, reviewReminder: false },
    });
    navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
  };

  const next = () => setStep(Math.min(step + 1, TOTAL_STEPS - 1));
  const back = () => setStep(Math.max(step - 1, 0));

  const skipButton = (
    <>
      <Button title="Skip for now" onPress={skipSetup} variant="text" />
      <AppText variant="caption" color="secondary" style={styles.skipNote}>
        Uses defaults (bedtime 23:00, daytime hours, reminders off). Change anytime in Settings.
      </AppText>
    </>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.bg }]}
      contentContainerStyle={styles.content}
    >
      <ProgressBar steps={TOTAL_STEPS} currentStep={step} />

      {step === 0 && (
        <View>
          <View style={styles.header}>
            <MaterialCommunityIcons name="hand-wave-outline" size={48} color={theme.colors.primary} />
            <AppText variant="h1" style={styles.title}>Welcome to Evenly Study</AppText>
            <AppText variant="bodySmall" color="secondary" style={styles.subtitle}>
              Keep going without falling apart
            </AppText>
          </View>
          <Card>
            <AppText variant="body" style={styles.bullet}>One calm indicator for your burnout risk</AppText>
            <AppText variant="body" style={styles.bullet}>Well-timed breaks that fit your day</AppText>
            <AppText variant="body" style={styles.bullet}>Protected sleep, every night</AppText>
          </Card>
          <AppText variant="caption" color="secondary" style={styles.note}>
            Setup takes under 2 minutes. Skip anything you like.
          </AppText>
          <Button title="Let's get started" onPress={next} />
          <PrivacyFooter />
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
          <WhyLine>So we can remind you to wind down. It's not a judgment of your schedule.</WhyLine>
          <TimePicker label="Target bedtime" value={bedtime} options={BEDTIME_OPTIONS} onSelect={setBedtime} />
          <Button title="Continue" onPress={next} />
          <Button title="Back" onPress={back} variant="text" />
          {skipButton}
          <PrivacyFooter />
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
          <WhyLine>So breaks and reminders fit around your real day.</WhyLine>
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
                <AppText variant="caption" color="secondary">{preset.start} - {preset.end}</AppText>
              </TouchableOpacity>
            );
          })}
          <Button title="Continue" onPress={next} />
          <Button title="Back" onPress={back} variant="text" />
          {skipButton}
          <PrivacyFooter />
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
          <WhyLine>So we can tell when your week is getting too heavy.</WhyLine>
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
                <AppText variant="body" color="secondary">X</AppText>
              </TouchableOpacity>
            </View>
          ))}
          <Button title="Continue" onPress={next} />
          <Button title="Back" onPress={back} variant="text" />
          {skipButton}
          <PrivacyFooter />
        </View>
      )}

      {step === 4 && (
        <View>
          <View style={styles.header}>
            <AppText variant="h1" style={styles.title}>How should we check in?</AppText>
            <AppText variant="bodySmall" color="secondary" style={styles.subtitle}>
              Pick how you want us to check in. You can change this anytime in Settings.
            </AppText>
          </View>
          <WhyLine>Pick how you want us to check in. You can change this anytime in Settings.</WhyLine>
          <TouchableOpacity
            style={[styles.choiceCard, { backgroundColor: theme.colors.surface }, state.settings.windDownReminder && { borderColor: theme.colors.primary }]}
            onPress={() => setNotifications(true)}
          >
            <MaterialCommunityIcons name="bell-ring-outline" size={28} color={theme.colors.primary} />
            <View style={styles.choiceText}>
              <AppText variant="body">Gentle reminders</AppText>
              <AppText variant="caption" color="secondary">Wind-down and review nudges, quietly</AppText>
            </View>
            {state.settings.windDownReminder && (
              <MaterialCommunityIcons name="check-circle" size={24} color={theme.colors.primary} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.choiceCard, { backgroundColor: theme.colors.surface }, !state.settings.windDownReminder && { borderColor: theme.colors.primary }]}
            onPress={() => setNotifications(false)}
          >
            <MaterialCommunityIcons name="bell-off-outline" size={28} color={theme.colors.textSecondary} />
            <View style={styles.choiceText}>
              <AppText variant="body">Quiet mode</AppText>
              <AppText variant="caption" color="secondary">No notifications at all</AppText>
            </View>
            {!state.settings.windDownReminder && (
              <MaterialCommunityIcons name="check-circle" size={24} color={theme.colors.primary} />
            )}
          </TouchableOpacity>
          <Button title="Continue" onPress={next} />
          <Button title="Back" onPress={back} variant="text" />
          {skipButton}
          <PrivacyFooter />
        </View>
      )}

      {step === 5 && (
        <View>
          <View style={styles.header}>
            <AppText variant="h1" style={styles.title}>What brought you here?</AppText>
            <AppText variant="bodySmall" color="secondary" style={styles.subtitle}>
              Optional. Pick up to two. It only changes which tips we show first.
            </AppText>
          </View>
          {REASONS.map(r => {
            const selected = reasons.includes(r);
            return (
              <TouchableOpacity
                key={r}
                style={[
                  styles.windowCard,
                  { backgroundColor: theme.colors.surface },
                  selected && { borderColor: theme.colors.primary, borderWidth: 2 },
                ]}
                onPress={() => toggleReason(r)}
              >
                <AppText variant="body">{r}</AppText>
                {selected && (
                  <MaterialCommunityIcons name="check" size={22} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            );
          })}
          <Button title="Continue" onPress={next} />
          <Button title="Back" onPress={back} variant="text" />
          {skipButton}
          <PrivacyFooter />
        </View>
      )}

      {step === 6 && (
        <View style={styles.centered}>
          <IndicatorBadge level="green" />
          <AppText variant="h2" style={styles.title}>{getBurnoutSuggestion('green')}</AppText>
          <AppText variant="bodySmall" color="secondary" style={styles.subtitle}>
            You're all set. Check in daily and we'll keep an eye on your balance.
          </AppText>
          <Button title="Start using Evenly Study" onPress={finishSetup} />
          <PrivacyFooter />
        </View>
      )}

      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingTop: 60,
    paddingBottom: 60,
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
  skipNote: {
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  privacy: {
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 18,
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
  choiceCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  choiceText: {
    flex: 1,
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
