import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../context/AppContext';
import { BurnoutLevel } from '../../types';

interface WeeklyTrendMiniChartProps {
  data: BurnoutLevel[];
  onPress?: () => void;
}

export function WeeklyTrendMiniChart({ data, onPress }: WeeklyTrendMiniChartProps) {
  const theme = useTheme();

  const getColor = (level: BurnoutLevel) => {
    switch (level) {
      case 'green': return theme.colors.indicatorGreen;
      case 'yellow': return theme.colors.indicatorYellow;
      case 'red': return theme.colors.indicatorRed;
    }
  };

  return (
    <View style={styles.container}>
      {data.map((level, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            { backgroundColor: getColor(level) },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
