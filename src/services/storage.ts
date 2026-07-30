// Thin, typed wrapper around localStorage that mimics a JSON API.
// Reads return parsed rows (or []), writes persist to localStorage and
// return the updated record so callers can treat them as API responses.

const PREFIX = 'drivenow:';

export function readTable<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as T[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeTable<T>(key: string, rows: T[]): void {
  localStorage.setItem(PREFIX + key, JSON.stringify(rows));
}

// Monotonic id generator scoped to a table.
export function nextId<T extends { id: number }>(rows: T[]): number {
  if (rows.length === 0) return 1;
  return Math.max(...rows.map((r) => r.id)) + 1;
}

// Simulate async network latency so loading states are visible.
export function delay<T>(value: T, ms = 120): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
