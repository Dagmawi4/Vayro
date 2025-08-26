import { Platform } from 'react-native';

// ⚠️ Set this to your LAN IP from `ipconfig` (or keep localhost for emulators).
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

export async function getPriceEstimate(airport: string, destination: string) {
  const q = new URLSearchParams({ airport, dest: destination }).toString();
  const res = await fetch(`${API_BASE}/api/transport/estimate-price?${q}`);
  if (!res.ok) throw new Error('Network error');
  return res.json() as Promise<{ uber: number; lyft: number }>;
}

export async function searchFlightsAPI(params: any) {
  const res = await fetch(`${API_BASE}/api/flights/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error("Network error");
  return res.json();
}
