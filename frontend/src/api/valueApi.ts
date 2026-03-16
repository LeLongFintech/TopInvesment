import { API_BASE } from './client';

export async function fetchValueFilter(body: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/filters/value`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function fetchStockDetail(symbol: string, years = 5) {
  const res = await fetch(
    `${API_BASE}/filters/value/stock/${encodeURIComponent(symbol)}?years=${years}`
  );
  if (!res.ok) throw new Error('Failed to load detail');
  return res.json();
}

export async function fetchGrahamChartDetail(symbol: string, date: string) {
  const res = await fetch(
    `${API_BASE}/filters/value/stock/${encodeURIComponent(symbol)}/charts?date=${encodeURIComponent(date)}`
  );
  if (!res.ok) throw new Error('Failed to load chart detail');
  return res.json();
}
