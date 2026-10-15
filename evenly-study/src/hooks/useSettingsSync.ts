import { useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { api } from '../api/client';

// Sends settings changes to the server (debounced). Some fields are
// phone-only by policy and are stripped before anything leaves the device.
const NEVER_SEND = ['reasons', 'dob'];

export function useSettingsSync() {
  const { state } = useAppContext();
  const lastSent = useRef('');

  useEffect(() => {
    const userId = state.user?.id;
    if (!userId || userId === 'demo-user') return;

    const payload: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(state.settings)) {
      if (!NEVER_SEND.includes(k)) payload[k] = v;
    }
    const key = JSON.stringify(payload);
    if (key === lastSent.current) return;

    const timer = setTimeout(async () => {
      try {
        await api.patch('/api/me/settings', { settings: payload });
        lastSent.current = key;
      } catch {
        // Offline: retry on the next settings change.
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [state.settings, state.user?.id]);
}
