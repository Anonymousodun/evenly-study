import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { useTheme } from '../../context/AppContext';

interface TextProps {
  children: React.ReactNode;
  variant?: 'display' | 'h1' | 'h2' | 'body' | 'bodySmall' | 'label' | 'caption' | 'indicator';
  color?: 'primary' | 'secondary' | 'default';
  style?: TextStyle;
  numberOfLines?: number;
}

export function AppText({ children, variant = 'body', color = 'default', style, numberOfLines }: TextProps) {
  const theme = useTheme();

  const variantStyle = theme.typography[variant];
  const colorValue = color === 'default' ? theme.colors.text : color === 'secondary' ? theme.colors.textSecondary : theme.colors.primary;

  return (
    <Text
      style={[
        { color: colorValue },
        variantStyle,
        style,
      ]}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
}

export default AppText;
