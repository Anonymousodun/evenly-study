import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { recognizeText, isSupported } from 'expo-mlkit-ocr';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import AppText from '../components/common/Text';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { EmptyState } from '../components/common/EmptyState';
import { useSchedule } from '../hooks/useSchedule';
import { parseTimetableLines, TimetableCandidate } from '../utils/timetableParse';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface EditableCandidate extends TimetableCandidate {
  key: string;
}

export function TimetableScanScreen({ navigation }: any) {
  const { theme } = useAppContext();
  const { addBlock } = useSchedule();
  const [photo, setPhoto] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<EditableCandidate[]>([]);
  const [scanned, setScanned] = useState(false);
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.bg }]}>
        <AppText variant="h1">Scan Timetable</AppText>
        <AppText variant="bodySmall" color="secondary" style={styles.note}>
          Photo scanning needs the mobile app. Please use manual entry on web.
        </AppText>
        <Button title="Add manually instead" onPress={() => navigation.navigate('ScheduleForm')} />
      </View>
    );
  }

  const pickImage = async (camera: boolean) => {
    setError('');
    setScanned(false);
    setCandidates([]);
    try {
      const perm = camera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        setError(camera ? 'Camera permission is needed to photograph a timetable.' : 'Photo access is needed to pick a timetable image.');
        return;
      }
      const fn = camera ? ImagePicker.launchCameraAsync : ImagePicker.launchImageLibraryAsync;
      const result = await fn({ mediaTypes: ['images'], quality: 1 });
      if (result.canceled || !result.assets[0]) return;
      setPhoto(result.assets[0].uri);
    } catch {
      setError('Could not open the image picker.');
    }
  };

  const runScan = async () => {
    if (!photo) return;
    setError('');
    setBusy(true);
    try {
      if (!isSupported()) {
        setError('Text recognition is not supported on this device. Please add blocks manually.');
        return;
      }
      const out = await recognizeText(photo);
      const lines = out.blocks.flatMap(b => b.lines.map(l => ({ text: l.text, y: l.boundingBox.y })));
      const parsed = parseTimetableLines(lines).map((c, i) => ({ ...c, key: `scan-${i}` }));
      setCandidates(parsed);
      setScanned(true);
      if (parsed.length === 0) {
        setError('No timetable blocks found. Try a clearer photo, or add blocks manually.');
      }
    } catch {
      setError('Scanning failed. Try a clearer photo, or add blocks manually.');
    } finally {
      setBusy(false);
    }
  };

  const updateCandidate = (key: string, patch: Partial<TimetableCandidate>) => {
    setCandidates(prev => prev.map(c => (c.key === key ? { ...c, ...patch } : c)));
  };

  const removeCandidate = (key: string) => {
    setCandidates(prev => prev.filter(c => c.key !== key));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const c of candidates) {
        if (!c.title.trim() || c.start >= c.end) continue;
        await addBlock(c.day, c.title.trim(), 'class', c.start, c.end);
      }
      navigation.goBack();
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      <View style={styles.header}>
        <AppText variant="h1">Scan Timetable</AppText>
        <AppText variant="bodySmall" color="secondary">
          Photograph your timetable. Check what we understood before saving.
        </AppText>
      </View>

      <View style={styles.pickRow}>
        <Button title="Take photo" onPress={() => pickImage(true)} variant="secondary" />
        <Button title="Pick image" onPress={() => pickImage(false)} variant="secondary" />
      </View>

      {!!photo && (
        <Image source={{ uri: photo }} style={styles.preview} resizeMode="contain" />
      )}

      {!!photo && !scanned && (
        <Button title={busy ? 'Scanning…' : 'Scan this photo'} onPress={runScan} disabled={busy} />
      )}

      {!!error && (
        <AppText variant="bodySmall" style={styles.error}>{error}</AppText>
      )}

      {scanned && candidates.length === 0 && !error && (
        <EmptyState
          icon="text-recognition"
          title="Nothing found"
          subtitle="Try a clearer, straight-on photo"
        />
      )}

      {candidates.map(c => (
        <Card key={c.key}>
          <Input label="Title" value={c.title} onChangeText={t => updateCandidate(c.key, { title: t })} />
          <View style={styles.timeRow}>
            <View style={styles.timeInput}>
              <Input label="Start" value={c.start} onChangeText={t => updateCandidate(c.key, { start: t })} placeholder="09:00" />
            </View>
            <View style={styles.timeInput}>
              <Input label="End" value={c.end} onChangeText={t => updateCandidate(c.key, { end: t })} placeholder="10:30" />
            </View>
          </View>
          <View style={styles.dayRow}>
            {DAYS.map((d, i) => (
              <TouchableOpacity
                key={d}
                style={[
                  styles.dayChip,
                  { borderColor: theme.colors.border },
                  c.day === i && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
                ]}
                onPress={() => updateCandidate(c.key, { day: i })}
              >
                <AppText variant="caption" style={{ color: c.day === i ? '#FFFFFF' : theme.colors.text }}>
                  {d}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
          <Button title="Remove" variant="text" onPress={() => removeCandidate(c.key)} />
        </Card>
      ))}

      {candidates.length > 0 && (
        <Button
          title={saving ? 'Saving…' : `Save ${candidates.length} block${candidates.length === 1 ? '' : 's'}`}
          onPress={handleSave}
          disabled={saving}
        />
      )}

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
    marginBottom: 16,
  },
  note: {
    marginTop: 12,
    marginBottom: 16,
  },
  pickRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  preview: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#00000010',
  },
  error: {
    color: '#B87333',
    textAlign: 'center',
    marginVertical: 12,
  },
  timeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timeInput: {
    flex: 1,
  },
  dayRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 8,
    marginBottom: 4,
  },
  dayChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
});
