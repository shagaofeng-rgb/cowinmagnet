export function databaseUrl() {
  const value = process.env.DATABASE_URL || "";
  if (!value || value.includes("localhost")) return value;

  try {
    const url = new URL(value);
    url.searchParams.delete("sslmode");
    return url.toString();
  } catch {
    return value;
  }
}

// Vercel functions normally use the pooled Neon URL.  A direct URL is kept as
// a short-lived fallback for maintenance work when the pooler is temporarily
// unavailable.  Callers must never expose these values to a response or log.
export function databaseUrlFallbacks() {
  const values = [
    process.env.DATABASE_URL,
    process.env.DATABASE_URL_UNPOOLED,
    process.env.POSTGRES_URL,
    process.env.POSTGRES_URL_NON_POOLING
  ].filter(Boolean);

  return [...new Set(values.map((value) => {
    try {
      const url = new URL(value);
      url.searchParams.delete("sslmode");
      return url.toString();
    } catch {
      return value;
    }
  }))];
}

export function databaseSsl() {
  const value = process.env.DATABASE_URL || "";
  return value.includes("localhost") ? false : { rejectUnauthorized: false };
}

export function databasePoolMax(localDefault = 3) {
  const configured = Number(process.env.DATABASE_POOL_MAX);
  if (Number.isFinite(configured) && configured > 0) return Math.min(10, Math.floor(configured));
  return process.env.VERCEL ? 1 : localDefault;
}

export function isTransientDatabaseError(error) {
  const code = String(error?.code || "").toUpperCase();
  const message = String(error?.message || "").toUpperCase();
  return ["ETIMEDOUT", "ECONNRESET", "ECONNREFUSED", "EHOSTUNREACH", "57P01", "57P02", "53300"].includes(code)
    || /TIMEOUT|CONNECTION TERMINATED|CONNECTION RESET|TOO MANY CONNECTIONS/.test(message);
}

export async function withDatabaseRetry(operation, { attempts = 2, delayMs = 180 } = {}) {
  let lastError;
  const safeAttempts = Math.max(1, Math.min(3, Number(attempts) || 1));

  for (let attempt = 1; attempt <= safeAttempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt >= safeAttempts || !isTransientDatabaseError(error)) throw error;
      await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
    }
  }

  throw lastError;
}
