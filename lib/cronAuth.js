import crypto from "node:crypto";

function secureEqual(left = "", right = "") {
  const leftBuffer = Buffer.from(String(left));
  const rightBuffer = Buffer.from(String(right));
  if (!leftBuffer.length || leftBuffer.length !== rightBuffer.length) return false;
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export function isCronAuthorized(request, { additionalSecrets = [] } = {}) {
  const secrets = [process.env.CRON_SECRET, ...additionalSecrets].filter(Boolean).map(String);
  if (!secrets.length) return process.env.NODE_ENV !== "production" && !process.env.VERCEL;

  const authorization = request.headers.get("authorization") || "";
  const bearer = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  const manualHeader = request.headers.get("x-cron-secret") || "";
  return [bearer, manualHeader].some((candidate) => secrets.some((secret) => secureEqual(candidate, secret)));
}
