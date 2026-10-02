import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useAppContext } from '../context/AppContext';
import AppText from '../components/common/Text';
import { Card } from '../components/common/Card';

export function WeeklyTrendScreen() {
  const { state, theme } = useAppContext();

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const trendData = weekDays.map((day, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split('T')[0];
    const checkIn = state.dailyCheckIns.find(c => c.date === dateStr);
    const sleep = state.sleep.find(s => s.date === dateStr);
    return {
      day,
      date: dateStr,
      mood: checkIn?.mood_score,
      sleep: sleep ? calculateSleepHours(sleep.bedtime, sleep.wake_time) : null,
      level: state.burnoutLevel,
    };
  });

  const greenDays = trendData.filter(d => d.level === 'green').length;
  const yellowDays = trendData.filter(d => d.level === 'yellow').length;
  const redDays = trendData.filter(d => d.level === 'red').length;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      <View style={styles.header}>
        <AppText variant="h1">Weekly Trend</AppText>
        <AppText variant="bodySmall" color="secondary">How your week looked</AppText>
      </View>

      <Card>
        <View style={styles.chart}>
          {trendData.map((d, i) => (
            <View key={i} style={styles.chartItem}>
              <View
                style={[
                  styles.chartDot,
                  {
                    backgroundColor:
                      d.level === 'green' ? theme.colors.indicatorGreen :
                      d.level === 'yellow' ? theme.colors.indicatorYellow :
                      theme.colors.indicatorRed,
                  },
                ]}
              />
              <AppText variant="caption" color="secondary">{d.day}</AppText>
            </View>
          ))}
        </View>
      </Card>

      <Card>
        <AppText variant="label" color="secondary">Summary</AppText>
        <AppText variant="body" style={styles.summaryText}>
          You had {greenDays} green days, {yellowDays} yellow, and {redDays} red this week.
        </AppText>
      </Card>

      <Card>
        <AppText variant="label" color="secondary">Daily Details</AppText>
        {trendData.map((d, i) => (
          <View key={i} style={styles.detailRow}>
            <AppText variant="bodySmall">{d.day}</AppText>
            <AppText variant="bodySmall" color="secondary">
              {d.mood ? `Mood: ${d.mood}/5` : 'No check-in'}
              {d.sleep ? ` · Sleep: ${d.sleep.toFixed(1)}h` : ''}
            </AppText>
          </View>
        ))}
      </Card>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

function calculateSleepHours(bedtime: string, wakeTime: string): number {
  const [bedHour, bedMin] = bedtime.split(':').map(Number);
  const [wakeHour, wakeMin] = wakeTime.split(':').map(Number);
  let bedTotal = bedHour * 60 + bedMin;
  let wakeTotal = wakeHour * 60 + wakeMin;
  if (wakeTotal < bedTotal) wakeTotal += 24 * 60;
  return (wakeTotal - bedTotal) / 60;
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
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  chartItem: {
    alignItems: 'center',
  },
  chartDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginBottom: 4,
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
