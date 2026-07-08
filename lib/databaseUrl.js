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

export function databaseSsl() {
  const value = process.env.DATABASE_URL || "";
  return value.includes("localhost") ? false : { rejectUnauthorized: false };
}
