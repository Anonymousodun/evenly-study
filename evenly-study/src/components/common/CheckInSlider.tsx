import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/AppContext';
import AppText from '../common/Text';

interface CheckInSliderProps {
  value: number | null;
  onSelect: (value: number) => void;
  emojis?: string[];
}

const DEFAULT_EMOJIS = ['😞', '😕', '😐', '🙂', '😊'];

export function CheckInSlider({ value, onSelect, emojis = DEFAULT_EMOJIS }: CheckInSliderProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {emojis.map((emoji, index) => {
        const score = index + 1;
        const isSelected = value === score;

        return (
          <TouchableOpacity
            key={score}
            style={[
              styles.circle,
              { backgroundColor: theme.colors.surface },
              isSelected && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
            ]}
            onPress={() => onSelect(score)}
          >
            <AppText style={styles.emoji}>{emoji}</AppText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 24,
  },
  circle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emoji: {
    fontSize: 24,
  },
});
