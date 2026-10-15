import * as SecureStore from 'expo-secure-store';

// Session persistence so sign-in survives app restarts. The token and a
// minimal profile are stored in the OS keychain. Demo sessions are never
// persisted: the demo stays in-memory only.
const TOKEN_KEY = 'evenly_session_token';
const USER_KEY = 'evenly_session_user';

export interface StoredUser {
  id: string;
  email: string;
  name: string | null;
}

export async function saveSession(token: string, user: StoredUser): Promise<void> {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
  } catch {
    // Storage unavailable: the session simply won't survive a restart.
  }
}

export async function loadSession(): Promise<{ token: string; user: StoredUser } | null> {
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    const raw = await SecureStore.getItemAsync(USER_KEY);
    if (!token || !raw) return null;
    const user = JSON.parse(raw) as StoredUser;
    if (!user.id || !user.email) return null;
    return { token, user };
  } catch {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
  } catch {
    // Already gone.
  }
}
