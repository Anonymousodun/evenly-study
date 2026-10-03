import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/AppContext';

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

export function CheckInSlider({ value, onSelect, icons = DEFAULT_ICONS }: CheckInSliderProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {icons.map((icon, index) => {
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
            <MaterialCommunityIcons
              name={icon as any}
              size={28}
              color={isSelected ? '#FFFFFF' : theme.colors.textSecondary}
            />
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
});
