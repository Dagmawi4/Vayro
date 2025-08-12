import { Platform } from 'react-native';

// your LAN IP from ipconfig:
const LAN = 'http://10.0.0.128:4000';

export const API_BASE =
  Platform.OS === 'ios' || Platform.OS === 'android'
    ? LAN
    : 'http://localhost:4000';

export async function getHealth() {
  const res = await fetch(`${API_BASE}/api/health`);
  if (!res.ok) throw new Error('Network error');
  return res.json() as Promise<{ ok: boolean }>;
}
