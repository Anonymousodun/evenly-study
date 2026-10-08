import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import AppText from '../components/common/Text';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { useSchedule } from '../hooks/useSchedule';
import { suggestSchedule } from '../utils/scheduleSuggest';
import { analyzeSchedule } from '../utils/scheduleFlags';
import { generateId } from '../utils/id';
import { ScheduleBlock, ScheduleKind } from '../types';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const KIND_ICONS: Record<ScheduleKind, string> = {
  class: 'school-outline',
  study: 'book-open-page-variant-outline',
  work: 'briefcase-outline',
  other: 'calendar-blank-outline',
  break: 'coffee-outline',
};

function BlockRow({ block, onDelete }: { block: ScheduleBlock; onDelete?: () => void }) {
  const { theme } = useAppContext();
  return (
    <Card style={styles.blockCard}>
      <View style={styles.blockRow}>
        <MaterialCommunityIcons
          name={(KIND_ICONS[block.kind] ?? KIND_ICONS.other) as any}
          size={28}
          color={block.kind === 'break' ? theme.colors.warning : theme.colors.primary}
        />
        <View style={styles.blockText}>
          <AppText variant="body">{block.title}</AppText>
          <AppText variant="bodySmall" color="secondary">
            {block.start_time.slice(0, 5)} – {block.end_time.slice(0, 5)} · {block.kind}
          </AppText>
        </View>
        {onDelete && (
          <TouchableOpacity onPress={onDelete} hitSlop={12}>
            <MaterialCommunityIcons name="trash-can-outline" size={22} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
    </Card>
  );
}

export function ScheduleScreen({ navigation }: any) {
  const { state, dispatch, theme } = useAppContext();
  const { schedule, scheduleBackup, removeBlock, adoptSuggestion, revertSchedule } = useSchedule();
  const [view, setView] = useState<'mine' | 'suggested'>('mine');
  const [busy, setBusy] = useState(false);

  const suggestion = suggestSchedule(schedule, state.settings);
  const flags = analyzeSchedule(schedule, state.settings);

  // Record new flags once per day for the weekly review (PRD 7.4).
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    for (const f of flags) {
      const seen = state.flagLog.some(e => e.date === today && e.text === f.text);
      if (!seen) {
        dispatch({ type: 'LOG_FLAG', payload: { id: generateId(), date: today, text: f.text } });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedule]);

  const sorted = [...schedule].sort((a, b) => a.day - b.day || a.start_time.localeCompare(b.start_time));
  const suggestedSorted = [...suggestion.blocks].sort((a, b) => a.day - b.day || a.start_time.localeCompare(b.start_time));
  const visible = view === 'mine' ? sorted : suggestedSorted;
  const days = [1, 2, 3, 4, 5, 6, 0].filter(d => visible.some(b => b.day === d));

  const handleAdopt = async () => {
    setBusy(true);
    try {
      await adoptSuggestion(suggestion.blocks);
      setView('mine');
    } finally {
      setBusy(false);
    }
  };

  const handleRevert = async () => {
    setBusy(true);
    try {
      await revertSchedule();
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      <View style={styles.header}>
        <AppText variant="h1">My Schedule</AppText>
        <AppText variant="bodySmall" color="secondary">
          {sorted.length === 0 ? 'Add your weekly routine' : `${sorted.length} block${sorted.length === 1 ? '' : 's'} per week`}
        </AppText>
      </View>

      {sorted.length > 0 && (
        <View style={styles.toggleRow}>
          {(['mine', 'suggested'] as const).map(v => (
            <TouchableOpacity
              key={v}
              style={[
                styles.toggleBtn,
                { borderColor: theme.colors.border },
                view === v && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
              ]}
              onPress={() => setView(v)}
            >
              <AppText variant="label" style={{ color: view === v ? '#FFFFFF' : theme.colors.text }}>
                {v === 'mine' ? 'Your schedule' : 'Our suggestion'}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {view === 'suggested' && sorted.length > 0 && (
        <Card style={styles.summaryCard}>
          <AppText variant="body">{suggestion.summary}</AppText>
          {suggestion.changes.map((c, i) => (
            <AppText key={i} variant="bodySmall" color="secondary" style={styles.changeLine}>
              • {c}
            </AppText>
          ))}
          {suggestion.changes.length > 0 && (
            <Button
              title={busy ? 'Applying…' : 'Use this schedule'}
              onPress={handleAdopt}
              disabled={busy}
            />
          )}
        </Card>
      )}

      {view === 'mine' && scheduleBackup && (
        <TouchableOpacity onPress={handleRevert} disabled={busy}>
          <AppText variant="bodySmall" color="secondary" style={styles.revertLink}>
            ← Revert to previous schedule
          </AppText>
        </TouchableOpacity>
      )}

      {view === 'mine' && flags.length > 0 && (
        <Card style={{ ...styles.summaryCard, borderLeftWidth: 4, borderLeftColor: theme.colors.warning }}>
          <View style={styles.flagHeader}>
            <MaterialCommunityIcons name="flag-outline" size={22} color={theme.colors.warning} />
            <AppText variant="label">Heads up on your week</AppText>
          </View>
          {flags.map(f => (
            <View key={f.id} style={styles.flagLine}>
              <AppText variant="bodySmall">• {f.text}</AppText>
              {!!f.fix && (
                <AppText variant="bodySmall" color="secondary">{f.fix}</AppText>
              )}
            </View>
          ))}
        </Card>
      )}

      {visible.length === 0 ? (
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
              {visible.filter(b => b.day === day).map(block => (
                <BlockRow
                  key={block.id}
                  block={block}
                  onDelete={view === 'mine' ? () => removeBlock(block.id) : undefined}
                />
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
    marginBottom: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  summaryCard: {
    marginBottom: 16,
  },
  changeLine: {
    marginTop: 6,
  },
  revertLink: {
    textAlign: 'center',
    marginBottom: 12,
  },
  flagHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  flagLine: {
    marginTop: 8,
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
