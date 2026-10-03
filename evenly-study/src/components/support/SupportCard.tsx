import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/AppContext';
import AppText from '../common/Text';

interface SupportCardProps {
  icon: string;
  label: string;
  contact: string;
  onPress?: () => void;
}

export function SupportCard({ icon, label, contact, onPress }: SupportCardProps) {
  const theme = useTheme();

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.colors.surface }]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.row}>
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.bg }]}>
          <MaterialCommunityIcons name={icon as any} size={26} color={theme.colors.primary} />
        </View>
        <View style={styles.info}>
          <AppText variant="body">{label}</AppText>
          <AppText variant="caption" color="secondary">{contact}</AppText>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
});
