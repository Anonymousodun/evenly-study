import { Linking } from 'react-native';

// Dials the first phone-like number found in a label such as
// "0800 078 7746 (toll-free, 24/7)". Text-only lines have no dialable
// number and report back instead of dialing anything wrong.
export async function dial(raw: string, onError: (msg: string) => void) {
  const match = raw.match(/[\d][\d\s\-()]{2,}[\d]/);
  if (!match) {
    onError('No callable number found here.');
    return;
  }
  const url = `tel:${match[0].replace(/[^+\d]/g, '')}`;
  try {
    const ok = await Linking.canOpenURL(url);
    if (ok) {
      await Linking.openURL(url);
    } else {
      onError('Calling is not available on this device.');
    }
  } catch {
    onError('Could not start the call.');
  }
}
