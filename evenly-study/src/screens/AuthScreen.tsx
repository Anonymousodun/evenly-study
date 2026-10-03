import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAppContext } from '../context/AppContext';
import AppText from '../components/common/Text';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { signUp, signIn } from '../api/auth';

export function AuthScreen() {
  const { dispatch, theme } = useAppContext();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password || busy) return;
    setError('');
    setBusy(true);
    try {
      const user = isLogin
        ? await signIn(email.trim(), password)
        : await signUp(name.trim(), email.trim(), password);
      if (!isLogin) {
        dispatch({ type: 'UPDATE_SETTINGS', payload: { setupComplete: false } });
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
      setError((err as Error).message || 'Something went wrong. Is the server running?');
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      <View style={styles.header}>
        <AppText variant="h1">{isLogin ? 'Welcome back' : 'Create account'}</AppText>
        <AppText variant="bodySmall" color="secondary">
          {isLogin ? 'Sign in to continue' : 'Start your calm study journey'}
        </AppText>
      </View>

      {!isLogin && (
        <Input
          label="Name"
          value={name}
          onChangeText={setName}
          placeholder="Your name"
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

      {!!error && (
        <AppText variant="bodySmall" style={styles.error}>{error}</AppText>
      )}

      <Button
        title={busy ? 'Please wait…' : isLogin ? 'Sign In' : 'Sign Up'}
        onPress={handleSubmit}
        disabled={busy}
      />

      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <AppText variant="bodySmall" color="secondary" style={styles.switchText}>
          {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </AppText>
      </TouchableOpacity>

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
  switchText: {
    textAlign: 'center',
    marginTop: 16,
  },
  error: {
    color: '#B87333',
    textAlign: 'center',
    marginBottom: 12,
  },
});
