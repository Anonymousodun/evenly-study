import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useAppContext } from '../context/AppContext';
import AppText from '../components/common/Text';
import { Card } from '../components/common/Card';
import { WeeklyTrendMiniChart } from '../components/burnout/WeeklyTrendMiniChart';
import { generateWeeklySummary } from '../utils/weeklySummary';

export function WeeklyTrendScreen() {
  const { state, theme } = useAppContext();
  const summary = generateWeeklySummary(state);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      <View style={styles.header}>
        <AppText variant="h1">Weekly Trend</AppText>
        <AppText variant="bodySmall" color="secondary">How your week looked</AppText>
      </View>

      <Card>
        <WeeklyTrendMiniChart data={summary.days.map(d => d.level)} />
        <View style={styles.dayLabels}>
          {summary.days.map((d, i) => (
            <AppText key={i} variant="caption" color="secondary">{d.day}</AppText>
          ))}
        </View>
      </Card>

      <Card>
        <AppText variant="label" color="secondary">Summary</AppText>
        <AppText variant="body" style={styles.summaryText}>
          You had {summary.greenDays} green days, {summary.yellowDays} yellow, and {summary.redDays} red this week.
        </AppText>
        {(summary.avgMood !== null || summary.avgSleep !== null) && (
          <AppText variant="bodySmall" color="secondary" style={styles.summaryText}>
            {summary.avgMood !== null && `Avg mood: ${summary.avgMood.toFixed(1)}/5`}
            {summary.avgMood !== null && summary.avgSleep !== null && ' · '}
            {summary.avgSleep !== null && `Avg sleep: ${summary.avgSleep.toFixed(1)}h`}
          </AppText>
        )}
      </Card>

      <Card>
        <AppText variant="label" color="secondary">Insight</AppText>
        <AppText variant="body" style={styles.summaryText}>{summary.insight}</AppText>
      </Card>

      <Card>
        <AppText variant="label" color="secondary">Daily Details</AppText>
        {summary.days.map((d, i) => (
          <View key={i} style={styles.detailRow}>
            <AppText variant="bodySmall">{d.day}</AppText>
            <AppText variant="bodySmall" color="secondary">
              {d.mood ? `Mood: ${d.mood}/5` : 'No check-in'}
              {d.sleepHours !== null ? ` · Sleep: ${d.sleepHours.toFixed(1)}h` : ''}
            </AppText>
          </View>
        ))}
      </Card>

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
  dayLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  summaryText: {
    marginTop: 8,
    lineHeight: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
});
