import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAppContext } from '../context/AppContext';
import AppText from '../components/common/Text';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

const TIME_OPTIONS = ['22:00', '23:00', '00:00', '01:00'];

export function SetupScreen({ navigation }: any) {
  const { dispatch, theme } = useAppContext();
  const [step, setStep] = useState(0);
  const [bedtime, setBedtime] = useState('23:00');

  const handleComplete = () => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: { targetBedtime: bedtime },
    });
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      <View style={styles.progress}>
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            style={[
              styles.progressDot,
              { backgroundColor: i <= step ? theme.colors.primary : theme.colors.border },
            ]}
          />
        ))}
      </View>

      <View style={styles.header}>
        <AppText variant="h1">Welcome</AppText>
        <AppText variant="bodySmall" color="secondary">Let's set up your study rhythm</AppText>
      </View>

      <Card>
        <AppText variant="label" color="secondary">When do you usually sleep?</AppText>
        <AppText variant="bodySmall" style={styles.subtitle}>We'll protect your rest time</AppText>

        <View style={styles.timeRow}>
          {TIME_OPTIONS.map((time) => (
            <TouchableOpacity
              key={time}
              style={[
                styles.timeOption,
                { backgroundColor: theme.colors.surface },
                bedtime === time && { backgroundColor: theme.colors.primary },
              ]}
              onPress={() => setBedtime(time)}
            >
              <AppText
                variant="h2"
                style={{ color: bedtime === time ? '#FFFFFF' : theme.colors.text }}
              >
                {time}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      <View style={{ flex: 1 }} />

      <Button title="Continue" onPress={() => setStep(step + 1)} />
      <Button title="Skip for now" onPress={handleComplete} variant="text" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  progress: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 32,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  header: {
    marginBottom: 24,
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 16,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  timeOption: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 60,
  },
});
