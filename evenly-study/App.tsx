import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/context/AppContext';
import { TourProvider } from './src/components/tour/TourContext';
import { ErrorBoundary } from './src/components/common/ErrorBoundary';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <AppProvider>
          <TourProvider>
            <StatusBar style="auto" />
            <AppNavigator />
          </TourProvider>
        </AppProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
