import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAppContext } from '../context/AppContext';
import AppText from '../components/common/Text';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { TaskType, TaskEffort } from '../types';
import { useTasks } from '../hooks/useTasks';
import templates from '../data/templates.json';

export function TaskFormScreen({ navigation }: any) {
  const { addTask } = useTasks();
  const { theme } = useAppContext();
  const [title, setTitle] = useState('');
  const [selectedType, setSelectedType] = useState<TaskType | null>(null);
  const [selectedEffort, setSelectedEffort] = useState<TaskEffort>('medium');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = async () => {
    if (!title || !selectedType || !dueDate) return;
    await addTask(title, selectedType, selectedEffort, dueDate);
    navigation.goBack();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      <View style={styles.header}>
        <AppText variant="h1">Add Task</AppText>
      </View>

      <Input
        label="Task title"
        value={title}
        onChangeText={setTitle}
        placeholder="e.g., Math Essay"
      />

      <AppText variant="label" color="secondary">Type</AppText>
      <View style={styles.templateGrid}>
        {templates.map((t) => (
          <TouchableOpacity
            key={t.type}
            style={[
              styles.templateCard,
              { backgroundColor: theme.colors.surface },
              selectedType === t.type && { borderColor: theme.colors.primary, borderWidth: 2 },
            ]}
            onPress={() => setSelectedType(t.type as TaskType)}
          >
            <AppText style={styles.templateIcon}>{t.icon}</AppText>
            <AppText variant="label">{t.label}</AppText>
          </TouchableOpacity>
        ))}
      </View>

      <AppText variant="label" color="secondary">Effort</AppText>
      <View style={styles.effortRow}>
        {(['light', 'medium', 'heavy'] as TaskEffort[]).map((effort) => (
          <TouchableOpacity
            key={effort}
            style={[
              styles.effortBtn,
              { backgroundColor: theme.colors.surface },
              selectedEffort === effort && { backgroundColor: theme.colors.primary },
            ]}
            onPress={() => setSelectedEffort(effort)}
          >
            <AppText
              variant="label"
              style={{ color: selectedEffort === effort ? '#FFFFFF' : theme.colors.text }}
            >
              {effort}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>

      <Input
        label="Due date (YYYY-MM-DD)"
        value={dueDate}
        onChangeText={setDueDate}
        placeholder="2026-10-15"
      />

      <Button title="Add Task" onPress={handleSubmit} />
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
  templateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  templateCard: {
    width: '47%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  templateIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  effortRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  effortBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
});
