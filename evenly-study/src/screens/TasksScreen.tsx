import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/common/Card';
import AppText from '../components/common/Text';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';
import { Task } from '../types';

export function TasksScreen({ navigation }: any) {
  const { state, theme } = useAppContext();

  const sortedTasks = [...state.tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
  });

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'light': return theme.colors.indicatorGreen;
      case 'medium': return theme.colors.indicatorYellow;
      case 'heavy': return theme.colors.indicatorRed;
      default: return theme.colors.border;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      <View style={styles.header}>
        <AppText variant="h1">Tasks</AppText>
      </View>

      {sortedTasks.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No tasks yet"
          subtitle="Add your first task to get started"
        />
      ) : (
        <ScrollView style={styles.list}>
          {sortedTasks.map((task) => (
            <TouchableOpacity
              key={task.id}
              onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })}
            >
              <Card style={styles.taskCard}>
                <View style={styles.taskRow}>
                  <View style={[styles.effortDot, { backgroundColor: getEffortColor(task.effort) }]} />
                  <View style={styles.taskInfo}>
                    <AppText variant="body" style={task.completed ? styles.completedTask : undefined}>
                      {task.title}
                    </AppText>
                    <AppText variant="caption" color="secondary">
                      {formatDate(task.due_date)} · {task.effort}
                    </AppText>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          ))}
          <View style={{ height: 80 }} />
        </ScrollView>
      )}

      <View style={styles.fab}>
        <Button
          title="+ Add Task"
          onPress={() => navigation.navigate('TaskForm')}
        />
      </View>
    </View>
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
  list: {
    flex: 1,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  effortDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  taskInfo: {
    flex: 1,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    left: 24,
    right: 24,
  },
});
