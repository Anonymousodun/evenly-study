import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../context/AppContext';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'text';
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({ title, onPress, variant = 'primary', disabled = false, style }: ButtonProps) {
  const theme = useTheme();

  const buttonStyle: ViewStyle = {
    ...styles.base,
    ...(variant === 'primary' && { backgroundColor: theme.colors.primary }),
    ...(variant === 'secondary' && {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: theme.colors.primary,
    }),
    ...(variant === 'text' && { backgroundColor: 'transparent' }),
    ...(disabled && { opacity: 0.5 }),
    ...style,
  };

  const textStyle: TextStyle = {
    ...styles.text,
    ...(variant === 'primary' && { color: '#FFFFFF' }),
    ...(variant === 'secondary' && { color: theme.colors.primary }),
    ...(variant === 'text' && { color: theme.colors.primary, fontWeight: '500' }),
  };

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress ?? (() => {})}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
