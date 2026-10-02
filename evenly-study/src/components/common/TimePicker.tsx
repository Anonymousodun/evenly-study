import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/AppContext';
import AppText from '../common/Text';

interface TimePickerProps {
  label: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
}

export function TimePicker({ label, value, options, onSelect }: TimePickerProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <AppText variant="label" color="secondary" style={styles.label}>{label}</AppText>
      <View style={styles.options}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.option,
              { backgroundColor: theme.colors.surface },
              value === option && { backgroundColor: theme.colors.primary },
            ]}
            onPress={() => onSelect(option)}
          >
            <AppText
              variant="body"
              style={{ color: value === option ? '#FFFFFF' : theme.colors.text }}
            >
              {option}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    marginBottom: 8,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    padding: 12,
    borderRadius: 12,
    minWidth: 60,
    alignItems: 'center',
  },
});
