import * as SecureStore from 'expo-secure-store';

// Only the result is stored ('adult' | 'under18'). The birth year itself
// is never saved anywhere, so picking a different year later cannot help:
// a stored 'under18' result keeps blocking.
const KEY = 'evenly_age_gate_v1';

export type AgeGateResult = 'adult' | 'under18';

export async function loadAgeGate(): Promise<AgeGateResult | null> {
  try {
    const v = await SecureStore.getItemAsync(KEY);
    return v === 'adult' || v === 'under18' ? v : null;
  } catch {
    return null;
  }
}

export async function saveAgeGate(result: AgeGateResult): Promise<void> {
  await SecureStore.setItemAsync(KEY, result);
}

export function isAdultBirthYear(year: number): boolean {
  const now = new Date();
  return now.getFullYear() - year >= 18;
}
