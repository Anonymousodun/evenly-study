import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAppContext } from '../context/AppContext';
import AppText from '../components/common/Text';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { generateId } from '../utils/id';

export function AuthScreen({ navigation }: any) {
  const { dispatch, theme } = useAppContext();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async () => {
    dispatch({
      type: 'SET_USER',
      payload: {
        id: generateId(),
        email,
        name: name || null,
        target_bedtime: '23:00',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    });
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
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

      <Button title={isLogin ? 'Sign In' : 'Sign Up'} onPress={handleSubmit} />

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
});
