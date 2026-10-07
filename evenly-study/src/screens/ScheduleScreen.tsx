import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import AppText from '../components/common/Text';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { useSchedule } from '../hooks/useSchedule';
import { ScheduleKind } from '../types';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const KIND_ICONS: Record<ScheduleKind, string> = {
  class: 'school-outline',
  study: 'book-open-page-variant-outline',
  work: 'briefcase-outline',
  other: 'calendar-blank-outline',
};

export function ScheduleScreen({ navigation }: any) {
  const { theme } = useAppContext();
  const { schedule, removeBlock } = useSchedule();

  const sorted = [...schedule].sort((a, b) => a.day - b.day || a.start_time.localeCompare(b.start_time));
  const days = [1, 2, 3, 4, 5, 6, 0].filter(d => sorted.some(b => b.day === d));

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      <View style={styles.header}>
        <AppText variant="h1">My Schedule</AppText>
        <AppText variant="bodySmall" color="secondary">
          {sorted.length === 0 ? 'Add your weekly routine' : `${sorted.length} block${sorted.length === 1 ? '' : 's'} per week`}
        </AppText>
      </View>

      {sorted.length === 0 ? (
        <EmptyState
          icon="calendar-week-outline"
          title="No schedule yet"
          subtitle="Add classes and study blocks to build your week"
        />
      ) : (
        <ScrollView style={styles.list}>
          {days.map(day => (
            <View key={day} style={styles.daySection}>
              <AppText variant="label" color="secondary" style={styles.dayTitle}>
                {DAY_NAMES[day]}
              </AppText>
              {sorted.filter(b => b.day === day).map(block => (
                <Card key={block.id} style={styles.blockCard}>
                  <View style={styles.blockRow}>
                    <MaterialCommunityIcons
                      name={(KIND_ICONS[block.kind] ?? KIND_ICONS.other) as any}
                      size={28}
                      color={theme.colors.primary}
                    />
                    <View style={styles.blockText}>
                      <AppText variant="body">{block.title}</AppText>
                      <AppText variant="bodySmall" color="secondary">
                        {block.start_time.slice(0, 5)} – {block.end_time.slice(0, 5)} · {block.kind}
                      </AppText>
                    </View>
                    <TouchableOpacity onPress={() => removeBlock(block.id)} hitSlop={12}>
                      <MaterialCommunityIcons name="trash-can-outline" size={22} color={theme.colors.textSecondary} />
                    </TouchableOpacity>
                  </View>
                </Card>
              ))}
            </View>
          ))}
          <View style={{ height: 80 }} />
        </ScrollView>
      )}

      <View style={styles.fab}>
        <Button title="+ Add Block" onPress={() => navigation.navigate('ScheduleForm')} />
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
  daySection: {
    marginBottom: 16,
  },
  dayTitle: {
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  blockCard: {
    marginBottom: 8,
  },
  blockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  blockText: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    left: 24,
    right: 24,
  },
});
