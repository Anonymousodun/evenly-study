import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/AppContext';
import AppText from '../common/Text';
import templates from '../../data/templates.json';
import { TaskType } from '../../types';

const ICON_EMOJI: Record<string, string> = {
  'school': '🏫',
  'document-text': '📝',
  'book-open': '📖',
  'people': '👥',
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
            <AppText style={styles.icon}>{ICON_EMOJI[t.icon] ?? '📋'}</AppText>
            <AppText variant="label">{t.label}</AppText>
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
  icon: {
    fontSize: 32,
    marginBottom: 8,
  },
});
