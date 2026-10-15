import { api, setSessionToken } from './client';
import { saveSession, clearSession } from './sessionStore';

interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface AuthResponse {
  token: string;
  user: { id: string; email: string; name: string | null };
}

export async function signUp(name: string, email: string, password: string): Promise<AuthUser> {
  const res = await api.post<AuthResponse>('/api/auth/sign-up/email', {
    name: name || email.split('@')[0],
    email,
    password,
  });
  setSessionToken(res.token);
  const user = { id: res.user.id, email: res.user.email, name: res.user.name || email.split('@')[0] };
  await saveSession(res.token, { id: user.id, email: user.email, name: res.user.name });
  return user;
}

export async function signIn(email: string, password: string): Promise<AuthUser> {
  const res = await api.post<AuthResponse>('/api/auth/sign-in/email', { email, password });
  setSessionToken(res.token);
  const user = { id: res.user.id, email: res.user.email, name: res.user.name || email.split('@')[0] };
  await saveSession(res.token, { id: user.id, email: user.email, name: res.user.name });
  return user;
}

export async function signOut(): Promise<void> {
  try {
    await api.post('/api/auth/sign-out', {});
  } catch {
    // Ignore, clearing the local token is what matters.
  }
  setSessionToken(null);
  await clearSession();
}
