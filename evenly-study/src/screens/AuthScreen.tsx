import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform, Modal, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import AppText from '../components/common/Text';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { CountryPicker, countryByCode } from '../components/common/CountryPicker';
import { signUp, signIn } from '../api/auth';
import { api } from '../api/client';
import { loadAgeGate, saveAgeGate, clearAgeGate, isAdultBirthYear, isBlockExpired } from '../utils/ageGate';

const THIS_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 121 }, (_, i) => THIS_YEAR - i);

const IS_WEB = Platform.OS === 'web';

export function AuthScreen() {
  const { dispatch, theme } = useAppContext();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [showForm, setShowForm] = useState(!IS_WEB);
  const [country, setCountry] = useState('NG');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthYear, setBirthYear] = useState<number | null>(null);
  const [yearPickerOpen, setYearPickerOpen] = useState(false);
  const [minorBlocked, setMinorBlocked] = useState(false);

  // A stored under-18 result blocks signup for 24 hours, so closing and
  // reopening cannot bypass it by picking a different year. After 24 hours
  // the block lifts and the year can be entered again. Login is never blocked.
  useEffect(() => {
    (async () => {
      const stored = await loadAgeGate();
      if (stored && stored.result === 'under18') {
        if (isBlockExpired(stored.blockedAt)) {
          await clearAgeGate();
        } else {
          setMinorBlocked(true);
        }
      }
    })();
  }, []);

  const handleSubmit = async () => {
    if (!email.trim() || !password || busy) return;
    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!isLogin) {
      if (birthYear === null) {
        setError('Please select your birth year.');
        return;
      }
      if (!isAdultBirthYear(birthYear)) {
        await saveAgeGate('under18');
        setMinorBlocked(true);
        return;
      }
      await saveAgeGate('adult');
    }
    setError('');
    setBusy(true);
    try {
      const user = isLogin
        ? await signIn(email.trim(), password)
        : await signUp(name.trim(), email.trim(), password);
      if (!isLogin) {
        const adultConfirmedAt = new Date().toISOString();
        dispatch({ type: 'UPDATE_SETTINGS', payload: { setupComplete: false, region: country, adultConfirmedAt } });
        try {
          await api.patch('/api/me/settings', { settings: { region: country, adultConfirmedAt } });
        } catch {
          // Offline: profile settings stay on this device until sync.
        }
      }
      dispatch({
        type: 'SET_USER',
        payload: {
          id: user.id,
          email: user.email,
          name: user.name,
          password_hash: '',
          target_bedtime: '23:00',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      });
    } catch (err) {
      const message = (err as Error).message || 'Something went wrong.';
      if (message.includes('API_UNREACHABLE') || message.includes('Failed to fetch')) {
        setError('Cannot reach the Evenly Study server. Use the offline demo below, or start the API and try again.');
      } else {
        setError(message);
      }
    } finally {
      setBusy(false);
    }
  };

  const enterDemoMode = () => {
    const now = new Date().toISOString();
    dispatch({
      type: 'SET_USER',
      payload: {
        id: 'demo-user',
        email: 'demo@evenly.app',
        name: 'Demo Student',
        password_hash: '',
        target_bedtime: '23:00',
        created_at: now,
        updated_at: now,
      },
    });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.bg }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <AppText variant="h1">{isLogin ? 'Welcome back' : 'Create account'}</AppText>
        <AppText variant="bodySmall" color="secondary">
          {isLogin ? 'Sign in to continue' : 'Start your calm study journey'}
        </AppText>
      </View>

      {IS_WEB && !showForm && (
        <View style={styles.demoBlock}>
          <AppText variant="body" style={styles.demoCopy}>
            Evenly Study balances focused study sessions with real breaks, sleep targets and
            burnout check-ins. Start the demo to explore with sample data.
          </AppText>
          <Button title="Explore the demo" onPress={enterDemoMode} />
          <Button
            title="Sign in to my account"
            variant="secondary"
            onPress={() => setShowForm(true)}
            style={styles.secondaryAction}
          />
        </View>
      )}

      {(!IS_WEB || showForm) && (
        <>
      {!isLogin && (
        <Input
          label="Name or nickname"
          value={name}
          onChangeText={setName}
          placeholder="What should we call you?"
        />
      )}

      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="your@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Input
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Your password"
        secureTextEntry
      />

      {!isLogin && (
        <Input
          label="Confirm password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Repeat your password"
          secureTextEntry
        />
      )}

      {!isLogin && !minorBlocked && (
        <>
          <AppText variant="label" color="secondary">Birth year</AppText>
          <AppText variant="bodySmall" color="secondary" style={styles.countryHint}>
            We ask so we can set up the app the right way for your age. We don't keep your exact birth year.
          </AppText>
          <TouchableOpacity
            style={[styles.yearButton, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}
            onPress={() => setYearPickerOpen(true)}
          >
            <AppText variant="body">{birthYear === null ? 'Select year' : String(birthYear)}</AppText>
            <MaterialCommunityIcons name="chevron-down" size={22} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          <AppText variant="label" color="secondary">Country</AppText>
          <AppText variant="bodySmall" color="secondary" style={styles.countryHint}>
            Support numbers and resources match {countryByCode(country).name}.
          </AppText>
          <CountryPicker selected={country} onSelect={setCountry} />
        </>
      )}

      {!isLogin && minorBlocked && (
        <View style={styles.blockedBox}>
          <MaterialCommunityIcons name="shield-account-outline" size={44} color={theme.colors.primary} />
          <AppText variant="h2" style={styles.blockedTitle}>Evenly Study is currently for adults</AppText>
          <AppText variant="bodySmall" color="secondary" style={styles.blockedText}>
            Thanks for being honest. Because you are under 18, we cannot set up an account for you right now.
            No account was created and nothing was sent anywhere.
          </AppText>
          <AppText variant="bodySmall" color="secondary" style={styles.blockedText}>
            If you entered the wrong year, you can try again tomorrow.
          </AppText>
          <Button
            title="Need help now?"
            variant="secondary"
            onPress={() => (navigation as any)?.navigate?.('HelpNow')}
          />
        </View>
      )}

      <Modal visible={yearPickerOpen} animationType="slide" onRequestClose={() => setYearPickerOpen(false)}>
        <View style={[styles.modal, { backgroundColor: theme.colors.bg }]}>
          <View style={styles.modalHeader}>
            <AppText variant="h2">Birth year</AppText>
            <TouchableOpacity onPress={() => setYearPickerOpen(false)} hitSlop={12}>
              <MaterialCommunityIcons name="close" size={26} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={YEAR_OPTIONS}
            keyExtractor={y => String(y)}
            initialScrollIndex={20}
            getItemLayout={(_, index) => ({ length: 52, offset: 52 * index, index })}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.yearRow}
                onPress={() => { setBirthYear(item); setYearPickerOpen(false); }}
              >
                <AppText variant="body">{String(item)}</AppText>
                {item === birthYear && (
                  <MaterialCommunityIcons name="check" size={22} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>

      {!!error && (
        <AppText variant="bodySmall" style={styles.error}>{error}</AppText>
      )}

      <Button
        title={busy ? 'Please wait…' : isLogin ? 'Sign In' : 'Sign Up'}
        onPress={handleSubmit}
        disabled={busy || (!isLogin && minorBlocked)}
      />

      <TouchableOpacity onPress={enterDemoMode}>
        <AppText variant="bodySmall" color="secondary" style={styles.switchText}>
          No account? Explore the offline demo
        </AppText>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <AppText variant="bodySmall" color="secondary" style={styles.switchText}>
          {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </AppText>
      </TouchableOpacity>
        </>
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingTop: 60,
    paddingBottom: 60,
  },
  header: {
    marginBottom: 24,
  },
  switchText: {
    textAlign: 'center',
    marginTop: 16,
  },
  demoBlock: {
    marginBottom: 8,
  },
  demoCopy: {
    marginBottom: 20,
  },
  secondaryAction: {
    marginTop: 12,
  },
  error: {
    color: '#B87333',
    textAlign: 'center',
    marginBottom: 12,
  },
  countryHint: {
    marginTop: 4,
    marginBottom: 8,
  },
  yearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  modal: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  yearRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  blockedBox: {
    alignItems: 'center',
    marginVertical: 16,
  },
  blockedTitle: {
    textAlign: 'center',
    marginTop: 12,
  },
  blockedText: {
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
});
