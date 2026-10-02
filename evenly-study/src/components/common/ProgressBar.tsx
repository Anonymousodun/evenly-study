import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../context/AppContext';

interface ProgressBarProps {
  steps: number;
  currentStep: number;
}

export function ProgressBar({ steps, currentStep }: ProgressBarProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {Array.from({ length: steps }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            { backgroundColor: i <= currentStep ? theme.colors.primary : theme.colors.border },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
