import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import AppText from '../components/common/Text';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { CountryPicker, countryByCode } from '../components/common/CountryPicker';
import { signUp, signIn } from '../api/auth';
import { api } from '../api/client';

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
  const [confirm18, setConfirm18] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password || busy) return;
    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!isLogin && !confirm18) {
      setError('Please confirm you are 18 or older to create an account.');
      return;
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

      {!isLogin && (
        <>
          <AppText variant="label" color="secondary">Country</AppText>
          <AppText variant="bodySmall" color="secondary" style={styles.countryHint}>
            Support numbers and resources match {countryByCode(country).name}.
          </AppText>
          <CountryPicker selected={country} onSelect={setCountry} />
          <TouchableOpacity style={styles.confirmRow} onPress={() => setConfirm18(!confirm18)}>
            <MaterialCommunityIcons
              name={confirm18 ? 'checkbox-marked' : 'checkbox-blank-outline'}
              size={26}
              color={theme.colors.primary}
            />
            <AppText variant="bodySmall" style={styles.confirmText}>
              I confirm I am 18 or older
            </AppText>
          </TouchableOpacity>
        </>
      )}

      {!!error && (
        <AppText variant="bodySmall" style={styles.error}>{error}</AppText>
      )}

      <Button
        title={busy ? 'Please wait…' : isLogin ? 'Sign In' : 'Sign Up'}
        onPress={handleSubmit}
        disabled={busy}
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
  confirmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  confirmText: {
    flex: 1,
  },
});
