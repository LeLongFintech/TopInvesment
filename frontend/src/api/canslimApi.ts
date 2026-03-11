import { API_BASE } from './client';

export async function fetchCanslimFilter(body: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/filters/canslim`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
