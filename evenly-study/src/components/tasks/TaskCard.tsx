import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/AppContext';
import AppText from '../common/Text';
import { Task } from '../../types';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  onComplete?: () => void;
}

export function TaskCard({ task, onPress, onComplete }: TaskCardProps) {
  const theme = useTheme();

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
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.colors.surface }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.row}>
        <View style={[styles.dot, { backgroundColor: getEffortColor(task.effort) }]} />
        <View style={styles.info}>
          <AppText variant="body" style={task.completed ? styles.completed : undefined}>
            {task.title}
          </AppText>
          <AppText variant="caption" color="secondary">
            {formatDate(task.due_date)} · {task.effort}
          </AppText>
        </View>
        {onComplete && !task.completed && (
          <TouchableOpacity onPress={onComplete} style={styles.checkBtn}>
            <AppText style={{ color: theme.colors.primary }}>✓</AppText>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  completed: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  checkBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
