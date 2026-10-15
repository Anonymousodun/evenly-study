import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Modal, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import AppText from '../components/common/Text';
import { Button } from '../components/common/Button';
import { loadAgeGate, saveAgeGate, isAdultBirthYear } from '../utils/ageGate';

const thisYear = new Date().getFullYear();
const YEARS = Array.from({ length: 121 }, (_, i) => thisYear - i);

export function AgeGateScreen({ navigation }: any) {
  const { theme } = useAppContext();
  const [checking, setChecking] = useState(true);
  const [blocked, setBlocked] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const stored = await loadAgeGate();
      if (stored === 'adult') {
        navigation.replace('Auth');
      } else if (stored === 'under18') {
        setBlocked(true);
      }
      setChecking(false);
    })();
  }, [navigation]);

  const submitYear = async (y: number) => {
    setPickerOpen(false);
    setYear(y);
    if (isAdultBirthYear(y)) {
      await saveAgeGate('adult');
      navigation.replace('Auth');
    } else {
      await saveAgeGate('under18');
      setBlocked(true);
    }
  };

  if (checking) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.bg }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (blocked) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.bg }]}>
        <MaterialCommunityIcons name="shield-account-outline" size={56} color={theme.colors.primary} />
        <AppText variant="h1" style={styles.title}>Evenly Study is currently for adults</AppText>
        <AppText variant="bodySmall" color="secondary" style={styles.subtitle}>
          Thanks for being honest. Because you are under 18, we cannot set up an account for you right now.
          No account was created and nothing was sent anywhere.
        </AppText>
        <Button title="Need help now?" onPress={() => navigation.navigate('HelpNow')} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      <AppText variant="h1" style={styles.title}>What year were you born?</AppText>
      <AppText variant="bodySmall" color="secondary" style={styles.subtitle}>
        We ask so we can set up the app the right way for your age. We don't keep your exact birth year.
      </AppText>

      <TouchableOpacity
        style={[styles.yearButton, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}
        onPress={() => setPickerOpen(true)}
      >
        <AppText variant="h2">{year === null ? 'Select year' : String(year)}</AppText>
        <MaterialCommunityIcons name="chevron-down" size={24} color={theme.colors.textSecondary} />
      </TouchableOpacity>

      <Modal visible={pickerOpen} animationType="slide" onRequestClose={() => setPickerOpen(false)}>
        <View style={[styles.modal, { backgroundColor: theme.colors.bg }]}>
          <View style={styles.modalHeader}>
            <AppText variant="h2">Birth year</AppText>
            <TouchableOpacity onPress={() => setPickerOpen(false)} hitSlop={12}>
              <MaterialCommunityIcons name="close" size={26} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={YEARS}
            keyExtractor={y => String(y)}
            initialScrollIndex={20}
            getItemLayout={(_, index) => ({ length: 52, offset: 52 * index, index })}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.yearRow} onPress={() => submitYear(item)}>
                <AppText variant="body">{String(item)}</AppText>
                {item === year && (
                  <MaterialCommunityIcons name="check" size={22} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
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
  title: {
    textAlign: 'center',
    marginTop: 16,
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  yearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
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
});
