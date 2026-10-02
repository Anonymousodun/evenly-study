import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { useTheme } from '../../context/AppContext';

interface InputProps extends TextInputProps {
  label?: string;
}

export function Input({ label, style, ...props }: InputProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {label && (
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              color: theme.colors.text,
            },
            style,
          ]}
          placeholderTextColor={theme.colors.textSecondary}
          {...props}
        />
      )}
      {!label && (
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              color: theme.colors.text,
            },
            style,
          ]}
          placeholderTextColor={theme.colors.textSecondary}
          {...props}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
});
