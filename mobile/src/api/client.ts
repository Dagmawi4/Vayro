import { Platform } from 'react-native';

// your LAN IP from ipconfig:
const LAN = 'http://10.0.0.128:4000';

export const API_BASE =
  Platform.OS === 'ios' || Platform.OS === 'android'
    ? LAN
    : 'http://localhost:4000';

export async function getPriceEstimate(airport: string, destination: string) {
  const q = new URLSearchParams({ airport, dest: destination }).toString();
  const res = await fetch(`${API_BASE}/api/transport/estimate-price?${q}`);
  if (!res.ok) throw new Error('Network error');
  return res.json() as Promise<{ uber: number; lyft: number }>;
}

