import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import AppText from '../components/common/Text';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
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

async function dial(raw: string, onError: (msg: string) => void) {
  const match = raw.match(/[\d][\d\s\-()]{2,}[\d]/);
  if (!match) {
    onError('No callable number found here.');
    return;
  }
  const url = `tel:${match[0].replace(/[^+\d]/g, '')}`;
  try {
    const ok = await Linking.canOpenURL(url);
    if (ok) {
      await Linking.openURL(url);
    } else {
      onError('Calling is not available on this device.');
    }
  } catch {
    onError('Could not start the call.');
  }
}

function ContactEditor({
  title,
  subtitle,
  name,
  phone,
  onSave,
}: {
  title: string;
  subtitle: string;
  name: string;
  phone: string;
  onSave: (name: string, phone: string) => void;
}) {
  const { theme } = useAppContext();
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(name);
  const [draftPhone, setDraftPhone] = useState(phone);
  const [error, setError] = useState('');

  if (!editing && phone) {
    return (
      <Card>
        <AppText variant="label" color="secondary">{title}</AppText>
        <AppText variant="body" style={styles.savedName}>{name || 'Saved contact'}</AppText>
        <AppText variant="bodySmall" color="secondary">{phone}</AppText>
        <View style={styles.contactActions}>
          <Button
            title="Call now"
            variant="secondary"
            style={styles.contactBtn}
            onPress={() => dial(phone, setError)}
          />
          <Button
            title="Edit"
            variant="text"
            onPress={() => { setDraftName(name); setDraftPhone(phone); setEditing(true); }}
          />
        </View>
        {!!error && <AppText variant="bodySmall" style={styles.error}>{error}</AppText>}
      </Card>
    );
  }

  return (
    <Card>
      <AppText variant="label" color="secondary">{title}</AppText>
      <AppText variant="bodySmall" style={styles.description}>{subtitle}</AppText>
      <Input label="Name" value={draftName} onChangeText={setDraftName} placeholder="e.g., Mrs. Ade, +234..." />
      <Input
        label="Phone number"
        value={draftPhone}
        onChangeText={setDraftPhone}
        placeholder="e.g., 0803 123 4567"
        keyboardType="phone-pad"
      />
      <Button
        title="Save contact"
        onPress={() => { onSave(draftName.trim(), draftPhone.trim()); setEditing(false); setError(''); }}
      />
      {phone !== '' && (
        <Button title="Cancel" variant="text" onPress={() => setEditing(false)} />
      )}
      {!!error && <AppText variant="bodySmall" style={styles.error}>{error}</AppText>}
    </Card>
  );
}

export function SupportScreen({ navigation }: any) {
  const { state, dispatch, theme } = useAppContext();
  const [callError, setCallError] = useState('');
  const region = state.settings.region || 'US';
  const helplines = resourcesByRegion[region] ?? resourcesByRegion['US'] ?? [];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      <View style={styles.header}>
        <AppText variant="h1">Need to talk?</AppText>
        <AppText variant="bodySmall" color="secondary">You're not alone. Here are people who can help.</AppText>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('AISupport')} activeOpacity={0.8}>
        <Card>
          <View style={styles.aiRow}>
            <View style={[styles.aiAvatar, { backgroundColor: theme.colors.primary }]}>
              <MaterialCommunityIcons name="robot-outline" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.aiInfo}>
              <AppText variant="body">Speak to our AI agent</AppText>
              <AppText variant="caption" color="secondary">Quick study advice, any time, not therapy</AppText>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={theme.colors.textSecondary} />
          </View>
        </Card>
      </TouchableOpacity>

      <ContactEditor
        title="Campus Counselor"
        subtitle="Free, confidential support for students. Save the number to call in one tap."
        name={state.settings.counselorName}
        phone={state.settings.counselorPhone}
        onSave={(name, phone) => dispatch({ type: 'UPDATE_SETTINGS', payload: { counselorName: name, counselorPhone: phone } })}
      />

      <ContactEditor
        title="Trusted Friend or Family"
        subtitle="Someone you know and trust. Save the number to call in one tap."
        name={state.settings.trustedName}
        phone={state.settings.trustedPhone}
        onSave={(name, phone) => dispatch({ type: 'UPDATE_SETTINGS', payload: { trustedName: name, trustedPhone: phone } })}
      />

      <AppText variant="label" color="secondary" style={styles.sectionLabel}>
        Helplines ({region})
      </AppText>
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
    marginBottom: 24,
  },
  description: {
    marginTop: 4,
    marginBottom: 12,
  },
  savedName: {
    marginTop: 4,
  },
  contactActions: {
    marginTop: 12,
  },
  contactBtn: {
    marginBottom: 4,
  },
  sectionLabel: {
    marginBottom: 12,
    marginTop: 8,
  },
  disclaimer: {
    textAlign: 'center',
    lineHeight: 20,
  },
  aiRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  aiInfo: {
    flex: 1,
  },
  error: {
    color: '#B87333',
    marginTop: 8,
  },
});
