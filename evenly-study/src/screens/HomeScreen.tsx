import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/common/Card';
import AppText from '../components/common/Text';
import { IndicatorBadge } from '../components/burnout/IndicatorBadge';
import { SuggestionCard } from '../components/burnout/SuggestionCard';
import { getBurnoutSuggestion } from '../utils/burnoutAlgorithm';

export function HomeScreen({ navigation }: any) {
  const { state, theme } = useAppContext();
  const suggestion = getBurnoutSuggestion(state.burnoutLevel);

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const trendData = weekDays.map((day, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split('T')[0];
    const hasCheckIn = state.dailyCheckIns.some(c => c.date === dateStr);
    const hasSleep = state.sleep.some(s => s.date === dateStr);
    if (!hasCheckIn && !hasSleep) return { day, level: 'green' as const };
    return { day, level: state.burnoutLevel };
  });

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      <View style={styles.header}>
        <AppText variant="h1">Good morning</AppText>
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

      <Card>
        <AppText variant="label" color="secondary">This week</AppText>
        <View style={styles.trendDots}>
          {trendData.map((d, i) => (
            <View key={i} style={styles.trendItem}>
              <View
                style={[
                  styles.trendDot,
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

      <SuggestionCard
        text={suggestion}
        onWhy={() => {}}
      />

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
  trendDots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  trendItem: {
    alignItems: 'center',
  },
  trendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
});
