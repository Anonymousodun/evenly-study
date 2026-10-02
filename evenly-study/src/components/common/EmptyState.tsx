import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../context/AppContext';
import AppText from './Text';

interface EmptyStateProps {
  icon: string;
  title: string;
  subtitle?: string;
}

export function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: theme.colors.surface }]}>
        <AppText variant="indicator">{icon}</AppText>
      </View>
      <AppText variant="h2" style={styles.title}>{title}</AppText>
      {subtitle && <AppText variant="bodySmall" color="secondary" style={styles.subtitle}>{subtitle}</AppText>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
  },
});
