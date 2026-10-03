import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppContext } from '../../context/AppContext';
import AppText from '../common/Text';

interface IndicatorBadgeProps {
  level: 'green' | 'yellow' | 'red';
}

const LEVEL_ICON = {
  green: 'sprout',
  yellow: 'weather-cloudy',
  red: 'umbrella',
} as const;

export function IndicatorBadge({ level }: IndicatorBadgeProps) {
  const { theme } = useAppContext();

  const bgColor =
    level === 'green' ? theme.colors.indicatorGreen :
    level === 'yellow' ? theme.colors.indicatorYellow :
    theme.colors.indicatorRed;

  const label = level === 'green' ? 'Healthy zone' : level === 'yellow' ? 'Load building' : 'High risk';

  return (
    <View style={[styles.circle, { backgroundColor: bgColor }]}>
      <MaterialCommunityIcons name={LEVEL_ICON[level]} size={44} color="#FFFFFF" />
      <AppText style={styles.label}>{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 16,
    marginTop: 4,
  },
});
