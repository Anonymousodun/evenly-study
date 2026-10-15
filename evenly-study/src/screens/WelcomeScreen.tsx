import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useAppContext } from '../context/AppContext';
import AppText from '../components/common/Text';
import { Button } from '../components/common/Button';

export function WelcomeScreen({ navigation }: any) {
  const { theme } = useAppContext();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      <Image
        source={require('../../assets/icon.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <AppText variant="display" style={styles.title}>Evenly Study</AppText>
      <AppText variant="body" color="secondary" style={styles.tagline}>
        Keep going without falling apart
      </AppText>
      <AppText variant="bodySmall" color="secondary" style={styles.description}>
        Balanced study sessions, real breaks, protected sleep.
      </AppText>
      <View style={styles.actions}>
        <Button title="Continue" onPress={() => navigation.navigate('Auth')} />
        <TouchableOpacity onPress={() => navigation.navigate('HelpNow')}>
          <AppText variant="bodySmall" color="secondary" style={styles.helpLink}>
            Need help now? Talk to someone, no account needed
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 24,
  },
  title: {
    textAlign: 'center',
  },
  tagline: {
    textAlign: 'center',
    marginTop: 8,
  },
  description: {
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  actions: {
    width: '100%',
  },
  helpLink: {
    textAlign: 'center',
    marginTop: 20,
  },
});
