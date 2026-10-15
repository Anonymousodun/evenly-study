import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useAppContext } from '../context/AppContext';
import AppText from '../components/common/Text';
import { Card } from '../components/common/Card';
import { CountryPicker } from '../components/common/CountryPicker';
import { SupportCard } from '../components/support/SupportCard';
import { dial } from '../utils/calling';
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

// No account, no server, no questions. Pick a country, call a helpline.
export function HelpNowScreen() {
  const { state, dispatch } = useAppContext();
  const [callError, setCallError] = useState('');
  const region = state.settings.region || 'NG';
  const helplines = resourcesByRegion[region] ?? [];

  return (
    <ScrollView style={[styles.container, { backgroundColor: '#0B1520' }]}>
      <View style={styles.header}>
        <AppText variant="h1" style={styles.title}>Need help now?</AppText>
        <AppText variant="bodySmall" style={styles.subtitle}>
          No account needed. Pick your country, tap to call.
        </AppText>
      </View>

      <CountryPicker
        selected={region}
        onSelect={(code) => dispatch({ type: 'UPDATE_SETTINGS', payload: { region: code } })}
      />

      {!!callError && <AppText variant="bodySmall" style={styles.error}>{callError}</AppText>}

      {helplines.length === 0 && (
        <Card>
          <AppText variant="bodySmall" color="secondary">
            We do not have a verified helpline for your country yet. In an emergency, call
            your local emergency number right away.
          </AppText>
        </Card>
      )}

      {helplines.map(r => (
        <SupportCard
          key={r.id}
          icon={r.icon}
          label={r.label}
          contact={r.contact}
          onPress={r.icon === 'phone-outline' ? () => dial(r.contact, setCallError) : undefined}
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
    marginBottom: 16,
  },
  title: {
    color: '#FFFFFF',
  },
  subtitle: {
    color: '#9AB4C8',
    marginTop: 4,
  },
  error: {
    color: '#D48A5C',
    marginBottom: 12,
  },
  disclaimer: {
    textAlign: 'center',
    lineHeight: 20,
  },
});
