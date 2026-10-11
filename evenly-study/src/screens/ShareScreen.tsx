import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import AppText from '../components/common/Text';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useSharing, shareUrl } from '../hooks/useSharing';

export function ShareScreen() {
  const { theme } = useAppContext();
  const { links, busy, loadLinks, createLink, revokeLink } = useSharing();
  const [error, setError] = useState('');

  useEffect(() => {
    loadLinks().catch(() => setError('Could not load links , is the server running?'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async () => {
    setError('');
    try {
      await createLink();
    } catch {
      setError('Could not create a link , is the server running?');
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      <View style={styles.header}>
        <AppText variant="h1">Share with an Advisor</AppText>
        <AppText variant="bodySmall" color="secondary">
          A read-only weekly summary. No account needed to view. Expires after 30 days.
        </AppText>
      </View>

      <Card>
        <AppText variant="bodySmall" color="secondary">
          Advisors see totals only , never your individual check-ins, sleep times, or notes.
          Your advisor can open the link once this server has a public address.
        </AppText>
      </Card>

      {!!error && (
        <AppText variant="bodySmall" style={styles.error}>{error}</AppText>
      )}

      <Button
        title={busy ? 'Creating…' : 'Create share link'}
        onPress={handleCreate}
        disabled={busy}
      />

      {links.map(l => (
        <Card key={l.id}>
          {!!l.token && (
            <AppText variant="bodySmall" style={styles.token}>
              {shareUrl(l.token)}
            </AppText>
          )}
          <AppText variant="bodySmall" color="secondary" style={styles.line}>
            Expires {l.expires_at.split('T')[0]}{l.revoked ? ' · revoked' : ''}
          </AppText>
          {!l.revoked && (
            <TouchableOpacity onPress={() => revokeLink(l.id)} style={styles.revokeRow}>
              <MaterialCommunityIcons name="link-off" size={20} color={theme.colors.danger} />
              <AppText variant="label" style={{ color: theme.colors.danger }}>Revoke</AppText>
            </TouchableOpacity>
          )}
        </Card>
      ))}

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
  error: {
    color: '#B87333',
    textAlign: 'center',
    marginVertical: 12,
  },
  token: {
    marginBottom: 8,
  },
  line: {
    marginTop: 4,
  },
  revokeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
});
