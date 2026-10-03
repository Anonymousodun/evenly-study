import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/AppContext';
import AppText from '../common/Text';
import templates from '../../data/templates.json';
import { TaskType } from '../../types';

const ICON_NAME: Record<string, string> = {
  'school': 'school-outline',
  'document-text': 'file-document-outline',
  'book-open': 'book-open-outline',
  'people': 'account-group-outline',
};

interface TaskTemplatePickerProps {
  selected: TaskType | null;
  onSelect: (type: TaskType) => void;
}

export function TaskTemplatePicker({ selected, onSelect }: TaskTemplatePickerProps) {
  const theme = useTheme();

  return (
    <View style={styles.grid}>
      {templates.map((t) => {
        const isSelected = selected === t.type;
        return (
          <TouchableOpacity
            key={t.type}
            style={[
              styles.card,
              { backgroundColor: theme.colors.surface },
              isSelected && { borderColor: theme.colors.primary, borderWidth: 2 },
            ]}
            onPress={() => onSelect(t.type as TaskType)}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name={(ICON_NAME[t.icon] ?? 'clipboard-text-outline') as any}
              size={32}
              color={isSelected ? theme.colors.primary : theme.colors.textSecondary}
            />
            <AppText variant="label" style={styles.label}>{t.label}</AppText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export function getTemplateDefaults(type: TaskType): { effort: 'light' | 'medium' | 'heavy' } {
  const found = templates.find((t) => t.type === type);
  const effort = found?.defaultEffort;
  if (effort === 'light' || effort === 'medium' || effort === 'heavy') {
    return { effort };
  }
  return { effort: 'medium' };
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  card: {
    width: '47%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  label: {
    marginTop: 8,
  },
});
