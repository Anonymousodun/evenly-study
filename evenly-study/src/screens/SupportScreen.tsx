import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useAppContext } from '../context/AppContext';
import AppText from '../components/common/Text';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

export function SupportScreen() {
  const { theme } = useAppContext();

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

      <Card>
        <AppText variant="label" color="secondary">Helpline</AppText>
        <AppText variant="bodySmall" style={styles.description}>24/7 crisis support</AppText>
        <Button title="View Numbers" variant="secondary" style={styles.contactBtn} />
      </Card>

      <Card style={{ backgroundColor: theme.colors.bg }}>
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
  disclaimer: {
    textAlign: 'center',
    lineHeight: 20,
  },
});
