import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useAppContext } from '../context/AppContext';
import AppText from '../components/common/Text';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

export function TaskDetailScreen({ route, navigation }: any) {
  const { state, dispatch, theme } = useAppContext();
  const { taskId } = route.params;
  const task = state.tasks.find(t => t.id === taskId);

  if (!task) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.bg }]}>
        <AppText variant="h1">Task not found</AppText>
      </View>
    );
  }

  const handleComplete = () => {
    dispatch({ type: 'UPDATE_TASK', payload: { ...task, completed: true } });
    navigation.goBack();
  };

  const handleDelete = () => {
    dispatch({ type: 'DELETE_TASK', payload: taskId });
    navigation.goBack();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      <View style={styles.header}>
        <AppText variant="h1">{task.title}</AppText>
      </View>

      <Card>
        <AppText variant="label" color="secondary">Details</AppText>
        <View style={styles.detailRow}>
          <AppText variant="bodySmall" color="secondary">Type</AppText>
          <AppText variant="body">{task.type}</AppText>
        </View>
        <View style={styles.detailRow}>
          <AppText variant="bodySmall" color="secondary">Effort</AppText>
          <AppText variant="body">{task.effort}</AppText>
        </View>
        <View style={styles.detailRow}>
          <AppText variant="bodySmall" color="secondary">Due date</AppText>
          <AppText variant="body">{task.due_date}</AppText>
        </View>
        <View style={styles.detailRow}>
          <AppText variant="bodySmall" color="secondary">Status</AppText>
          <AppText variant="body">{task.completed ? 'Completed' : 'Pending'}</AppText>
        </View>
      </Card>

      {!task.completed && (
        <Button title="Mark Complete" onPress={handleComplete} />
      )}
      <Button title="Delete Task" onPress={handleDelete} variant="text" />

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
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
});
