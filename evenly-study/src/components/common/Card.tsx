import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../context/AppContext';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Card({ children, style }: CardProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
});
