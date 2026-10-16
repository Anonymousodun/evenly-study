import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import AppText from './Text';
import { Button } from './Button';

interface Props {
  children: React.ReactNode;
}

interface State {
  message: string | null;
}

// Catches render crashes anywhere below it and shows the error instead of
// a blank page, so a bug report can name the culprit.
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { message: null };

  static getDerivedStateFromError(err: unknown): State {
    return { message: err instanceof Error ? err.message : String(err) };
  }

  componentDidCatch(err: unknown) {
    // eslint-disable-next-line no-console
    console.log('[Evenly crash]', err instanceof Error ? err.stack || err.message : String(err));
  }

  render() {
    if (this.state.message) {
      return (
        <ScrollView contentContainerStyle={styles.container}>
          <AppText variant="h1" style={styles.title}>Something broke</AppText>
          <AppText variant="bodySmall" color="secondary" style={styles.text}>
            The app hit an error instead of your screen. Copy the line below when reporting it.
          </AppText>
          <AppText variant="bodySmall" style={styles.error}>{this.state.message}</AppText>
          <Button title="Reload the page" onPress={() => window.location.reload()} />
        </ScrollView>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#0B1520',
  },
  title: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  text: {
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  error: {
    color: '#D48A5C',
    textAlign: 'center',
    marginBottom: 24,
  },
});
