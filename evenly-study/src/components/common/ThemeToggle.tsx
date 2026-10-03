import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppContext } from '../../context/AppContext';

export function ThemeToggle() {
  const { theme, isDark, toggleTheme } = useAppContext();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={toggleTheme}
      activeOpacity={0.7}
    >
      <MaterialCommunityIcons
        name={isDark ? 'weather-sunny' : 'weather-night'}
        size={22}
        color={theme.colors.textSecondary}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
