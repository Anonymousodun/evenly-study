import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useAppContext } from '../context/AppContext';
import AppText from '../components/common/Text';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { SupportCard } from '../components/support/SupportCard';
import supportResources from '../data/supportResources.json';

interface Resource {
  id: string;
  type: string;
  label: string;
  contact: string;
  region: string;
  icon: string;
}

const resourcesByRegion = supportResources as Record<string, Resource[]>;

export function SupportScreen() {
  const { state, theme } = useAppContext();
  const region = state.settings.region || 'US';
  const helplines = resourcesByRegion[region] ?? resourcesByRegion['US'] ?? [];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      <View style={styles.header}>
        <AppText variant="h1">Need to talk?</AppText>
        <AppText variant="bodySmall" color="secondary">You're not alone. Here are people who can help.</AppText>
      </View>

      <Card>
        <AppText variant="label" color="secondary">Campus Counselor</AppText>
        <AppText variant="bodySmall" style={styles.description}>Free, confidential support for students</AppText>
        <Button title="Contact" variant="secondary" style={styles.contactBtn} />
      </Card>

      <Card>
        <AppText variant="label" color="secondary">Trusted Friend or Family</AppText>
        <AppText variant="bodySmall" style={styles.description}>Someone you know and trust</AppText>
        <Button title="Choose Contact" variant="secondary" style={styles.contactBtn} />
      </Card>

      <AppText variant="label" color="secondary" style={styles.sectionLabel}>
        Helplines ({region})
      </AppText>
      {helplines.map(r => (
        <SupportCard
          key={r.id}
          icon={r.icon}
          label={r.label}
          contact={r.contact}
        />
      ))}

      <Card>
        <AppText variant="caption" color="secondary" style={styles.disclaimer}>
          Evenly Study is a wellbeing tool, not a therapist. We don't diagnose, treat, or replace professional care.
        </AppText>
      </Card>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 24,
  },
  description: {
    marginTop: 4,
    marginBottom: 12,
  },
  contactBtn: {
    marginTop: 8,
  },
  sectionLabel: {
    marginBottom: 12,
    marginTop: 8,
  },
  disclaimer: {
    textAlign: 'center',
    lineHeight: 20,
  },
});
