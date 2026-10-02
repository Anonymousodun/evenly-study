import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useAppContext } from '../context/AppContext';
import AppText from '../components/common/Text';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';
import { TaskCard } from '../components/tasks/TaskCard';

export function TasksScreen({ navigation }: any) {
  const { state, dispatch, theme } = useAppContext();

  const sortedTasks = [...state.tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
  });

  const handleComplete = (taskId: string) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (task) {
      dispatch({ type: 'UPDATE_TASK', payload: { ...task, completed: !task.completed } });
    }
  };

  const activeCount = state.tasks.filter(t => !t.completed).length;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      <View style={styles.header}>
        <AppText variant="h1">Tasks</AppText>
        {activeCount > 0 && (
          <AppText variant="bodySmall" color="secondary">
            {activeCount} active
          </AppText>
        )}
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
            <TaskCard
              key={task.id}
              task={task}
              onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })}
              onComplete={() => handleComplete(task.id)}
            />
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
  fab: {
    position: 'absolute',
    bottom: 100,
    left: 24,
    right: 24,
  },
});
