import * as SecureStore from 'expo-secure-store';

// Tour state is per account, so a new student on a shared phone still gets
// the tour. Demo sessions share one demo key. Survives app restarts
// (OS keychain), but not uninstall.
export type TourFlag = 'completed' | 'skipped';

export function tourKeyFor(userId: string | null | undefined): string {
  if (!userId || userId === 'demo-user') return 'evenly_tour_demo';
  return `evenly_tour_${userId}`;
}

export async function loadTourFlag(key: string): Promise<TourFlag | null> {
  try {
    const v = await SecureStore.getItemAsync(key);
    return v === 'completed' || v === 'skipped' ? v : null;
  } catch {
    return null;
  }
}

export async function saveTourFlag(key: string, flag: TourFlag): Promise<void> {
  try {
    await SecureStore.setItemAsync(key, flag);
  } catch {
    // Storage unavailable: the prompt may simply appear again next launch.
  }
}
