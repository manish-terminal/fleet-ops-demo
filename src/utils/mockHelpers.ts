const MIN_DELAY = 300;
const MAX_DELAY = 900;

export async function simulateDelay(ms?: number): Promise<void> {
  // @ts-ignore
  const delayMs = ms ?? Number(import.meta.env.VITE_MOCK_DELAY_MS ?? 600);
  const jitter = Math.random() * (MAX_DELAY - MIN_DELAY) + MIN_DELAY;
  await new Promise(resolve => setTimeout(resolve, ms ?? jitter));
}

export async function simulateError(probability = 0.02): Promise<void> {
  if (Math.random() < probability) {
    throw new Error('Simulated network error — retry or check console');
  }
}

export function paginate<T>(items: T[], page: number, limit: number) {
  const start = (page - 1) * limit;
  return {
    data:     items.slice(start, start + limit),
    total:    items.length,
    page,
    pageSize: limit,
  };
}

export function filterBySearch<T>(
  items: T[],
  search: string,
  fields: (keyof T)[]
): T[] {
  if (!search) return items;
  const q = search.toLowerCase();
  return items.filter(item =>
    fields.some(field => String(item[field]).toLowerCase().includes(q))
  );
}
