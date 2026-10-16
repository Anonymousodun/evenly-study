import * as SecureStore from 'expo-secure-store';

// Only the result is stored: 'adult', or 'under18' with the time it was
// set (needed for the 24-hour re-entry cooldown). The birth year itself
// is never saved anywhere.
const KEY = 'evenly_age_gate_v1';
const COOLDOWN_MS = 24 * 60 * 60 * 1000;

export type AgeGateResult = 'adult' | 'under18';

export interface AgeGateState {
  result: AgeGateResult;
  blockedAt: string | null;
}

export async function loadAgeGate(): Promise<AgeGateState | null> {
  try {
    const v = await SecureStore.getItemAsync(KEY);
    if (v === 'adult') return { result: 'adult', blockedAt: null };
    if (v && v.startsWith('under18:')) {
      return { result: 'under18', blockedAt: v.slice('under18:'.length) || null };
    }
    if (v === 'under18') return { result: 'under18', blockedAt: null };
    return null;
  } catch {
    return null;
  }
}

export async function saveAgeGate(result: AgeGateResult): Promise<void> {
  const value = result === 'adult' ? 'adult' : `under18:${new Date().toISOString()}`;
  await SecureStore.setItemAsync(KEY, value);
}

export async function clearAgeGate(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(KEY);
  } catch {
    // Already gone.
  }
}

// A block expires 24 hours after it was set. Missing timestamps (from the
// very first version of this flag) are treated as still blocked.
export function isBlockExpired(blockedAt: string | null): boolean {
  if (!blockedAt) return false;
  const t = new Date(blockedAt).getTime();
  if (Number.isNaN(t)) return false;
  return Date.now() - t >= COOLDOWN_MS;
}

export function isAdultBirthYear(year: number): boolean {
  const now = new Date();
  return now.getFullYear() - year >= 18;
}
