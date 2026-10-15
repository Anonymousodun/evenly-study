import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import AppText from '../components/common/Text';
import { Card } from '../components/common/Card';
import { TIP_CATEGORIES, TipCategory, getTipsByCategory, getTip } from '../utils/tips';

const CATEGORY_ICONS: Record<TipCategory, string> = {
  Sleep: 'weather-night',
  Breaks: 'coffee-outline',
  Stress: 'heart-pulse',
  Focus: 'target',
};

// Maps onboarding reasons to the category shown first. Phone only.
const REASON_CATEGORY: Record<string, TipCategory> = {
  'Not sleeping well': 'Sleep',
  'Hard to focus': 'Focus',
  'Constant stress': 'Stress',
  'Not taking breaks': 'Breaks',
};

function firstCategory(reasons: string[]): TipCategory | 'All' {
  for (const r of reasons) {
    if (REASON_CATEGORY[r]) return REASON_CATEGORY[r];
  }
  return 'All';
}

export function TipsScreen({ route }: any) {
  const { theme, state } = useAppContext();
  const [category, setCategory] = useState<TipCategory | 'All'>(() => firstCategory(state.settings.reasons ?? []));
  const [openId, setOpenId] = useState<string | null>(route?.params?.topicId ?? null);

  const topics = getTipsByCategory(category);
  const open = openId ? getTip(openId) : undefined;

  if (open) {
    return (
      <ScrollView style={[styles.container, { backgroundColor: theme.colors.bg }]}>
        <TouchableOpacity onPress={() => setOpenId(null)} style={styles.backRow}>
          <MaterialCommunityIcons name="chevron-left" size={22} color={theme.colors.primary} />
          <AppText variant="label" style={{ color: theme.colors.primary }}>All topics</AppText>
        </TouchableOpacity>
        <AppText variant="bodySmall" color="secondary">
          {open.category} · {open.readSeconds} sec read
        </AppText>
        <AppText variant="h1" style={styles.title}>{open.title}</AppText>
        <AppText variant="body" style={styles.body}>{open.body}</AppText>
        <View style={{ height: 100 }} />
      </ScrollView>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      <View style={styles.header}>
        <AppText variant="h1">60-Second Tips</AppText>
        <AppText variant="bodySmall" color="secondary">
          Quick reads , nothing here takes longer than a minute.
        </AppText>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
        {(['All', ...TIP_CATEGORIES] as const).map(c => (
          <TouchableOpacity
            key={c}
            style={[
              styles.chip,
              { borderColor: theme.colors.border },
              category === c && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
            ]}
            onPress={() => setCategory(c)}
          >
            <AppText variant="label" style={{ color: category === c ? '#FFFFFF' : theme.colors.text }}>
              {c}
            </AppText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.list}>
        {topics.map(t => (
          <TouchableOpacity key={t.id} onPress={() => setOpenId(t.id)} activeOpacity={0.8}>
            <Card>
              <View style={styles.topicRow}>
                <MaterialCommunityIcons
                  name={(CATEGORY_ICONS[t.category] ?? 'lightbulb-outline') as any}
                  size={26}
                  color={theme.colors.primary}
                />
                <View style={styles.topicText}>
                  <AppText variant="body">{t.title}</AppText>
                  <AppText variant="bodySmall" color="secondary">
                    {t.category} · {t.readSeconds} sec
                  </AppText>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={22} color={theme.colors.textSecondary} />
              </View>
            </Card>
          </TouchableOpacity>
        ))}
        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 16,
  },
  chips: {
    maxHeight: 48,
    marginBottom: 8,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 8,
    alignSelf: 'flex-start',
  },
  list: {
    flex: 1,
  },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  topicText: {
    flex: 1,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    marginTop: 8,
    marginBottom: 16,
  },
  body: {
    lineHeight: 26,
  },
});
