import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/AppContext';
import AppText from '../common/Text';

interface BreakOptionProps {
  icon: string;
  title: string;
  duration: string;
  description: string;
  selected?: boolean;
  onPress: () => void;
}

export function BreakOption({ icon, title, duration, description, selected, onPress }: BreakOptionProps) {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: theme.colors.surface },
        selected && { borderColor: theme.colors.primary, borderWidth: 2 },
      ]}
      onPress={onPress}
    >
      <View style={[styles.iconContainer, { backgroundColor: theme.colors.bg }]}>
        <AppText style={styles.icon}>{icon}</AppText>
      </View>
      <View style={styles.info}>
        <AppText variant="body">{title}</AppText>
        <AppText variant="caption" color="secondary">{duration} · {description}</AppText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 24,
  },
  info: {
    flex: 1,
  },
});
