const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

type Entry = { count: number; resetAt: number };

const attempts = new Map<string, Entry>();

export function checkPontoRateLimit(cpf: string): boolean {
  const now = Date.now();
  const entry = attempts.get(cpf);

  if (!entry || now > entry.resetAt) {
    attempts.set(cpf, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return false;
  }

  entry.count += 1;
  return true;
}
