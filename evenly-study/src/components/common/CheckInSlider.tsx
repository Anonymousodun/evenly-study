import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/AppContext';
import AppText from './Text';

interface CheckInSliderProps {
  value: number | null;
  onSelect: (value: number) => void;
  icons?: string[];
}

const DEFAULT_ICONS = [
  'emoticon-cry-outline',
  'emoticon-sad-outline',
  'emoticon-neutral-outline',
  'emoticon-happy-outline',
  'emoticon-excited-outline',
];

const SELECTED_ICONS = [
  'emoticon-cry',
  'emoticon-sad',
  'emoticon-neutral',
  'emoticon-happy',
  'emoticon-excited',
];

const MOOD_COLORS = ['#C65D5B', '#D08A4E', '#C9A227', '#8FB892', '#5F9E6E'];

const MOOD_LABELS = ['Rough', 'Low', 'Okay', 'Good', 'Great'];

export function CheckInSlider({ value, onSelect, icons = DEFAULT_ICONS }: CheckInSliderProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {icons.map((icon, index) => {
        const score = index + 1;
        const isSelected = value === score;
        const moodColor = MOOD_COLORS[index];

        return (
          <View key={score} style={styles.item}>
            <TouchableOpacity
              style={[
                styles.circle,
                {
                  backgroundColor: isSelected ? moodColor : theme.colors.surface,
                  borderColor: isSelected ? moodColor : theme.colors.border,
                },
                isSelected && {
                  shadowColor: moodColor,
                  shadowOpacity: 0.4,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 3 },
                  elevation: 4,
                },
              ]}
              onPress={() => onSelect(score)}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name={(isSelected ? SELECTED_ICONS[index] : icon) as any}
                size={30}
                color={isSelected ? '#FFFFFF' : theme.colors.textSecondary}
              />
            </TouchableOpacity>
            <AppText
              variant="caption"
              style={{
                ...styles.label,
                color: isSelected ? moodColor : theme.colors.textSecondary,
                ...(isSelected ? styles.labelSelected : null),
              }}
            >
              {MOOD_LABELS[index]}
            </AppText>
          </View>
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
  item: {
    alignItems: 'center',
    flex: 1,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  label: {
    marginTop: 6,
  },
  labelSelected: {
    fontWeight: '700',
  },
});
