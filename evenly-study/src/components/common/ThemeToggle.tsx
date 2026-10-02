import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useAppContext } from '../../context/AppContext';
import AppText from '../common/Text';

export function ThemeToggle() {
  const { isDark, toggleTheme } = useAppContext();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={toggleTheme}
      activeOpacity={0.7}
    >
      <AppText variant="bodySmall">{isDark ? '☀️' : '🌙'}</AppText>
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
