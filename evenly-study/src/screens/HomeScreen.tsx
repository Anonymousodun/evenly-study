import React, { useState } from 'react';
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
import { getScienceNote } from '../utils/science';
import { checkDistress } from '../utils/distress';

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function HomeScreen({ navigation }: any) {
  const { state, theme } = useAppContext();
  const { suggestions, approve, dismiss } = useSuggestions();
  const sleepCheck = checkSleepProtection(state);
  const summary = generateWeeklySummary(state);
  const activeSuggestion = suggestions[0] ?? null;
  const distress = checkDistress(state);
  const [distressDismissed, setDistressDismissed] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const checkedInToday = state.dailyCheckIns.some(c => c.date === today);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      <View style={styles.header}>
        <AppText variant="h1">{greeting()}</AppText>
        <AppText variant="bodySmall" color="secondary">Let's check in with yourself</AppText>
      </View>

      <TouchableOpacity
        style={styles.supportBtn}
        onPress={() => navigation.navigate('Support')}
      >
        <AppText style={{ fontSize: 18 }}>🆘</AppText>
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
          <AppText variant="body">Haven't checked in today — it takes 5 seconds.</AppText>
          <Button title="Check in now" onPress={() => navigation.navigate('CheckIn')} variant="secondary" />
        </Card>
      )}

      {distress.triggered && !distressDismissed && (
        <Card>
          <AppText variant="label" color="secondary">💛 We're here for you</AppText>
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
          <AppText variant="label" color="secondary">This week — tap for details</AppText>
          <WeeklyTrendMiniChart data={summary.days.map(d => d.level)} />
        </Card>
      </TouchableOpacity>

      {activeSuggestion ? (
        <SuggestionCard
          text={activeSuggestion.text}
          whyText={getScienceNote(activeSuggestion.type)}
          onApprove={() => approve(activeSuggestion.id)}
          onDismiss={() => dismiss(activeSuggestion.id)}
        />
      ) : (
        <SuggestionCard
          text={getBurnoutSuggestion(state.burnoutLevel)}
          whyText={getScienceNote('balanced-week')}
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
