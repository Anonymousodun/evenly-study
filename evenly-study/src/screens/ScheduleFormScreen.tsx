import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAppContext } from '../context/AppContext';
import AppText from '../components/common/Text';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { ScheduleKind } from '../types';
import { useSchedule } from '../hooks/useSchedule';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
// Picker index 0-6 maps to day numbers with Monday first: Mon=1 ... Sun=0.
const DAY_NUMBERS = [1, 2, 3, 4, 5, 6, 0];

const KINDS: ScheduleKind[] = ['class', 'study', 'work', 'other'];

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

export function ScheduleFormScreen({ navigation }: any) {
  const { theme } = useAppContext();
  const { addBlock } = useSchedule();
  const [title, setTitle] = useState('');
  const [dayIndex, setDayIndex] = useState(0);
  const [kind, setKind] = useState<ScheduleKind>('class');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    if (!title.trim()) {
      setError('Give the block a title.');
      return;
    }
    if (!TIME_RE.test(startTime) || !TIME_RE.test(endTime)) {
      setError('Times must be HH:MM, e.g. 09:00.');
      return;
    }
    if (startTime >= endTime) {
      setError('End time must be after start time.');
      return;
    }
    await addBlock(DAY_NUMBERS[dayIndex], title.trim(), kind, startTime, endTime);
    navigation.goBack();
  };

  const chip = (selected: boolean) => ({
    backgroundColor: selected ? theme.colors.primary : theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
  });

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      <View style={styles.header}>
        <AppText variant="h1">Add Schedule Block</AppText>
      </View>

      <Input
        label="Title"
        value={title}
        onChangeText={setTitle}
        placeholder="e.g., Math lecture"
      />

      <AppText variant="label" color="secondary">Day</AppText>
      <View style={styles.chipRow}>
        {DAYS.map((d, i) => (
          <TouchableOpacity key={d} style={[styles.chip, chip(dayIndex === i)]} onPress={() => setDayIndex(i)}>
            <AppText variant="label" style={{ color: dayIndex === i ? '#FFFFFF' : theme.colors.text }}>
              {d}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>

      <AppText variant="label" color="secondary">Type</AppText>
      <View style={styles.chipRow}>
        {KINDS.map(k => (
          <TouchableOpacity key={k} style={[styles.chip, chip(kind === k)]} onPress={() => setKind(k)}>
            <AppText variant="label" style={{ color: kind === k ? '#FFFFFF' : theme.colors.text }}>
              {k}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>

      <Input
        label="Start time (HH:MM)"
        value={startTime}
        onChangeText={setStartTime}
        placeholder="09:00"
      />

      <Input
        label="End time (HH:MM)"
        value={endTime}
        onChangeText={setEndTime}
        placeholder="10:30"
      />

      {!!error && (
        <AppText variant="bodySmall" style={styles.error}>{error}</AppText>
      )}

      <Button title="Add Block" onPress={handleSubmit} />
      <Button title="Cancel" onPress={() => navigation.goBack()} variant="text" />

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
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
    marginBottom: 20,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  error: {
    color: '#B87333',
    textAlign: 'center',
    marginBottom: 12,
  },
});
