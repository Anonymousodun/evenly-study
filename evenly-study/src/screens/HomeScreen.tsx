import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/common/Card';
import AppText from '../components/common/Text';
import { Button } from '../components/common/Button';
import { IndicatorBadge } from '../components/burnout/IndicatorBadge';
import { SuggestionCard } from '../components/burnout/SuggestionCard';
import { WeeklyTrendMiniChart } from '../components/burnout/WeeklyTrendMiniChart';
import { useSuggestions } from '../hooks/useSuggestions';
import { getBurnoutSuggestion } from '../utils/burnoutAlgorithm';
import { checkSleepProtection } from '../utils/sleepProtection';
import { generateWeeklySummary } from '../utils/weeklySummary';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getScienceNote } from '../utils/science';
import { checkDistress } from '../utils/distress';
import { getCrunchStatus, shouldSuggestCrunch } from '../utils/crunch';
import { getTipForSuggestion } from '../utils/tips';
import { useTour } from '../components/tour/TourContext';
import { tourKeyFor, loadTourFlag, saveTourFlag } from '../utils/tourStore';

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function HomeScreen({ navigation }: any) {
  const { state, dispatch, theme } = useAppContext();
  const { suggestions, approve, dismiss } = useSuggestions();
  const sleepCheck = checkSleepProtection(state);
  const summary = generateWeeklySummary(state);
  const activeSuggestion = suggestions[0] ?? null;
  const distress = checkDistress(state);
  const [distressDismissed, setDistressDismissed] = useState(false);
  const [reminderPromptDismissed, setReminderPromptDismissed] = useState(false);
  const crunch = getCrunchStatus(state.settings);
  const crunchSuggest = shouldSuggestCrunch(state);
  const remindersOff = !state.settings.windDownReminder && !state.settings.reviewReminder;
  const tour = useTour();
  const supportBtnRef = useRef<any>(null);
  const [tourPrompt, setTourPrompt] = useState<'loading' | 'show' | 'hide'>('loading');

  // Offer the tour once per account (demo included). Re-checks whenever the
  // tour closes, so completing or skipping hides the prompt for good.
  useEffect(() => {
    if (tour.active) {
      setTourPrompt('hide');
      return;
    }
    let cancelled = false;
    (async () => {
      const flag = await loadTourFlag(tourKeyFor(state.user?.id));
      if (!cancelled) setTourPrompt(flag ? 'hide' : 'show');
    })();
    return () => {
      cancelled = true;
    };
  }, [tour.active, state.user?.id]);

  const handleTourStart = () => {
    setTourPrompt('hide');
    tour.startTour();
  };

  const handleTourDecline = async () => {
    await saveTourFlag(tourKeyFor(state.user?.id), 'skipped');
    setTourPrompt('hide');
  };

  const today = new Date().toISOString().split('T')[0];
  const checkedInToday = state.dailyCheckIns.some(c => c.date === today);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      <View style={styles.header}>
        <AppText variant="h1">{greeting()}</AppText>
        <AppText variant="bodySmall" color="secondary">Let's check in with yourself</AppText>
      </View>

      <TouchableOpacity
        ref={supportBtnRef}
        style={[styles.supportBtn, { backgroundColor: theme.colors.danger }]}
        onPress={() => navigation.navigate('Support')}
        accessibilityLabel="Support"
        accessibilityHint="Opens support options and helplines"
        onLayout={() => {
          supportBtnRef.current?.measure(
            (_x: number, _y: number, width: number, height: number, pageX: number, pageY: number) => {
              tour.setSupportSpot({ x: pageX, y: pageY, width, height });
            }
          );
        }}
      >
        <MaterialCommunityIcons name="menu" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <View style={styles.indicatorContainer}>
        <IndicatorBadge level={state.burnoutLevel} />
        <AppText variant="h2" style={styles.indicatorText}>
          {state.burnoutLevel === 'green' && "You're in a healthy zone"}
          {state.burnoutLevel === 'yellow' && 'Load is building'}
          {state.burnoutLevel === 'red' && 'Time to ease off'}
        </AppText>
        <AppText variant="bodySmall" color="secondary" style={styles.indicatorSubtext}>
          {state.burnoutLevel === 'green' && 'Load and rest are balanced'}
          {state.burnoutLevel === 'yellow' && 'Workload up and/or sleep down'}
          {state.burnoutLevel === 'red' && 'Heavy load plus poor sleep'}
        </AppText>
      </View>

      {!checkedInToday && (
        <Card>
          <AppText variant="body">Haven't checked in today, it takes 5 seconds.</AppText>
          <Button title="Check in now" onPress={() => navigation.navigate('CheckIn')} variant="secondary" />
        </Card>
      )}

      {tourPrompt === 'show' && (
        <Card>
          <AppText variant="label" color="secondary">Quick tour? About 30 seconds</AppText>
          <AppText variant="body" style={styles.bannerText}>
            See where everything lives, one tap at a time.
          </AppText>
          <View style={styles.distressActions}>
            <Button title="Start tour" onPress={handleTourStart} variant="secondary" />
            <Button title="No thanks" onPress={handleTourDecline} variant="text" />
          </View>
        </Card>
      )}

      {remindersOff && !reminderPromptDismissed && (
        <Card>
          <AppText variant="label" color="secondary">Gentle reminders are off</AppText>
          <AppText variant="body" style={styles.bannerText}>
            Want a quiet nudge at wind-down time? You can turn it off again anytime.
          </AppText>
          <View style={styles.distressActions}>
            <Button
              title="Turn on"
              onPress={() => dispatch({ type: 'UPDATE_SETTINGS', payload: { windDownReminder: true, reviewReminder: true } })}
              variant="secondary"
            />
            <Button title="Not now" onPress={() => setReminderPromptDismissed(true)} variant="text" />
          </View>
        </Card>
      )}

      {crunch.phase !== 'off' && (
        <TouchableOpacity onPress={() => navigation.navigate('Crunch')} activeOpacity={0.8}>
          <Card>
            <AppText variant="label" color="secondary">
              {crunch.phase === 'active' ? 'Crunch mode , essentials protected' : 'Recovery , easing back'}
            </AppText>
            <AppText variant="body">
              {crunch.phase === 'active'
                ? `${crunch.daysLeft} day${crunch.daysLeft === 1 ? '' : 's'} left. Short breaks, minimum sleep, real meals.`
                : `${crunch.daysLeft} day${crunch.daysLeft === 1 ? '' : 's'} left. Restorative breaks, earlier bedtime.`}
            </AppText>
          </Card>
        </TouchableOpacity>
      )}

      {crunchSuggest && (
        <Card>
          <AppText variant="label" color="secondary">Heavy stretch?</AppText>
          <AppText variant="body" style={styles.bannerText}>
            You've had some heavy days. Crunch mode can protect the essentials for a while.
          </AppText>
          <View style={styles.distressActions}>
            <Button title="Tell me more" onPress={() => navigation.navigate('Crunch')} variant="secondary" />
            <Button
              title="No thanks"
              onPress={() => dispatch({ type: 'UPDATE_SETTINGS', payload: { crunchDeclined: true } })}
              variant="text"
            />
          </View>
        </Card>
      )}

      {distress.triggered && !distressDismissed && (
        <Card>
          <AppText variant="label" color="secondary">We're here for you</AppText>
          <AppText variant="body" style={styles.bannerText}>{distress.message}</AppText>
          <View style={styles.distressActions}>
            <Button title="Show me" onPress={() => navigation.navigate('Support')} variant="secondary" />
            <Button title="Later" onPress={() => setDistressDismissed(true)} variant="text" />
          </View>
        </Card>
      )}

      {sleepCheck.exceeded && (
        <Card>
          <AppText variant="label" color="secondary">🌙 Sleep protection</AppText>
          <AppText variant="body" style={styles.bannerText}>{sleepCheck.message}</AppText>
          <AppText variant="bodySmall" color="secondary">{sleepCheck.suggestedAction}</AppText>
        </Card>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('WeeklyTrend')} activeOpacity={0.8}>
        <Card>
          <AppText variant="label" color="secondary">This week , tap for details</AppText>
          <WeeklyTrendMiniChart data={summary.days.map(d => d.level)} />
        </Card>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Reviews')} activeOpacity={0.8}>
        <Card>
          <AppText variant="label" color="secondary">Weekly review , tap to read</AppText>
          <AppText variant="body">Look back, then one small idea for next week.</AppText>
        </Card>
      </TouchableOpacity>

      {activeSuggestion ? (
        <SuggestionCard
          text={activeSuggestion.text}
          whyText={getScienceNote(activeSuggestion.type)}
          topicId={getTipForSuggestion(activeSuggestion.type)}
          onOpenTopic={(topicId: string) => navigation.navigate('Tips', { topicId })}
          onApprove={() => approve(activeSuggestion.id)}
          onDismiss={() => dismiss(activeSuggestion.id)}
        />
      ) : (
        <SuggestionCard
          text={getBurnoutSuggestion(state.burnoutLevel)}
          whyText={getScienceNote('balanced-week')}
          topicId={getTipForSuggestion('balanced-week')}
          onOpenTopic={(topicId: string) => navigation.navigate('Tips', { topicId })}
        />
      )}

      <TouchableOpacity onPress={() => navigation.navigate('Tips')} activeOpacity={0.8}>
        <Card>
          <AppText variant="label" color="secondary">60-Second Tips , tap to browse</AppText>
          <AppText variant="body">Sleep, breaks, stress and focus, one minute at a time.</AppText>
        </Card>
      </TouchableOpacity>

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
  supportBtn: {
    position: 'absolute',
    top: 60,
    right: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  indicatorContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  indicatorText: {
    marginTop: 16,
    textAlign: 'center',
  },
  indicatorSubtext: {
    marginTop: 4,
    textAlign: 'center',
  },
  bannerText: {
    marginTop: 8,
    lineHeight: 24,
  },
  distressActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
    alignItems: 'center',
  },
});
