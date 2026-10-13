import React, { useState } from 'react';
import { View, StyleSheet, Modal, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/AppContext';
import AppText from './Text';
import countries from '../../data/countries.json';

export interface Country {
  code: string;
  name: string;
  dial: string;
}

export function countryByCode(code: string): Country {
  return (
    (countries as Country[]).find(c => c.code === code) ?? { code, name: code, dial: '' }
  );
}

export function CountryPicker({
  selected,
  onSelect,
  buttonTitle,
}: {
  selected: string;
  onSelect: (code: string) => void;
  buttonTitle?: string;
}) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const current = countryByCode(selected);

  const filtered = (countries as Country[]).filter(
    c =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.code.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <TouchableOpacity
        style={[styles.button, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}
        onPress={() => { setQuery(''); setOpen(true); }}
      >
        <MaterialCommunityIcons name="earth" size={22} color={theme.colors.primary} />
        <AppText variant="body" style={styles.buttonText}>
          {buttonTitle ?? `${current.name} (${current.code})`}
        </AppText>
        <MaterialCommunityIcons name="chevron-down" size={22} color={theme.colors.textSecondary} />
      </TouchableOpacity>

      <Modal visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={[styles.modal, { backgroundColor: theme.colors.bg }]}>
          <View style={styles.searchRow}>
            <TextInput
              style={[styles.search, { borderColor: theme.colors.border, color: theme.colors.text }]}
              placeholder="Search countries"
              placeholderTextColor={theme.colors.textSecondary}
              value={query}
              onChangeText={setQuery}
              autoFocus
            />
            <TouchableOpacity onPress={() => setOpen(false)} hitSlop={12}>
              <MaterialCommunityIcons name="close" size={26} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={filtered}
            keyExtractor={c => c.code}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.row}
                onPress={() => { onSelect(item.code); setOpen(false); }}
              >
                <View style={styles.rowText}>
                  <AppText variant="body">{item.name}</AppText>
                  <AppText variant="bodySmall" color="secondary">
                    {item.code} · {item.dial}
                  </AppText>
                </View>
                {item.code === selected && (
                  <MaterialCommunityIcons name="check" size={22} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  buttonText: {
    flex: 1,
  },
  modal: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  search: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  rowText: {
    flex: 1,
  },
});
