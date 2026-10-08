import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';
import { useAppContext } from '../context/AppContext';
import AppText from '../components/common/Text';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { buildWeekReview } from '../utils/weeklyReview';
import { generateId } from '../utils/id';

// expo-notifications weekdays: 1 = Sunday … 7 = Saturday.
const WEEKDAY_NUMBERS: Record<string, number> = {
  Sunday: 1, Monday: 2, Tuesday: 3, Wednesday: 4, Thursday: 5, Friday: 6, Saturday: 7,
};
const REVIEW_TITLE = 'Your weekly review is ready';

async function scheduleReviewNotification(reviewDay: string) {
  const existing = await Notifications.getAllScheduledNotificationsAsync();
  for (const n of existing) {
    if (n.content.title === REVIEW_TITLE) {
      await Notifications.cancelScheduledNotificationAsync(n.identifier);
    }
  }
  await Notifications.scheduleNotificationAsync({
    content: {
      title: REVIEW_TITLE,
      body: 'A minute to look back — and one small idea for next week.',
      sound: false,
    },
    trigger: {
      type: SchedulableTriggerInputTypes.WEEKLY,
      weekday: WEEKDAY_NUMBERS[reviewDay] ?? 1,
      hour: 19,
      minute: 0,
    },
  });
}

export function ReviewsScreen() {
  const { state, dispatch, theme } = useAppContext();
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);

  const review = buildWeekReview(state);

  useEffect(() => {
    if (state.settings.reviewReminder) {
      scheduleReviewNotification(state.settings.reviewDay).catch(() => {
        // Notifications unavailable (e.g. web) — the screen still works.
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.settings.reviewReminder, state.settings.reviewDay]);

  const handleApply = () => {
    if (review.suggestion.setting) {
      dispatch({ type: 'UPDATE_SETTINGS', payload: review.suggestion.setting });
    }
    setApplied(true);
  };

  const handleSave = () => {
    dispatch({
      type: 'SAVE_REVIEW',
      payload: {
        id: generateId(),
        weekStart: review.weekStart,
        createdAt: new Date().toISOString(),
        summary: review.summary,
        highlights: review.highlights,
        suggestion: review.suggestion.text,
        flags: review.flags,
      },
    });
    setSaved(true);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      <View style={styles.header}>
        <AppText variant="h1">Weekly Review</AppText>
        <AppText variant="bodySmall" color="secondary">
          Week of {review.weekStart} · a minute to read
        </AppText>
      </View>

      <Card>
        <AppText variant="h2">{review.summary}</AppText>
        {review.wins.slice(1).map((w, i) => (
          <AppText key={i} variant="bodySmall" color="secondary" style={styles.line}>
            • {w}
          </AppText>
        ))}
      </Card>

      <Card>
        <AppText variant="label" color="secondary">Highlights</AppText>
        {review.highlights.map((h, i) => (
          <AppText key={i} variant="bodySmall" style={styles.line}>
            • {h}
          </AppText>
        ))}
      </Card>

      {review.flags.length > 0 && (
        <Card>
          <AppText variant="label" color="secondary">Schedule flags this week</AppText>
          {review.flags.map((f, i) => (
            <AppText key={i} variant="bodySmall" style={styles.line}>
              • {f}
            </AppText>
          ))}
        </Card>
      )}

      <Card>
        <AppText variant="label" color="secondary">One small idea for next week</AppText>
        <AppText variant="body" style={styles.line}>{review.suggestion.text}</AppText>
        <Button
          title={applied ? 'Applied ✓' : 'Apply in one tap'}
          onPress={handleApply}
          disabled={applied}
        />
      </Card>

      <Button
        title={saved ? 'Saved ✓' : 'Save this review'}
        onPress={handleSave}
        disabled={saved}
        variant="secondary"
      />

      {state.reviews.length > 0 && (
        <View style={styles.history}>
          <AppText variant="label" color="secondary" style={styles.historyTitle}>
            Past reviews
          </AppText>
          {state.reviews.map(r => (
            <Card key={r.id}>
              <AppText variant="body">Week of {r.weekStart}</AppText>
              <AppText variant="bodySmall" color="secondary" style={styles.line}>
                {r.summary}
              </AppText>
            </Card>
          ))}
        </View>
      )}

      {state.reviews.length === 0 && (
        <EmptyState
          icon="history"
          title="No saved reviews yet"
          subtitle="Save this week's review to start your history"
        />
      )}

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
  line: {
    marginTop: 8,
  },
  history: {
    marginTop: 24,
  },
  historyTitle: {
    marginBottom: 8,
    textTransform: 'uppercase',
  },
});
