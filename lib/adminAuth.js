import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_COOKIE_NAME = "cowin_admin_session";

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

function secret() {
  return process.env.ADMIN_JWT_SECRET || "cowinmagnet-local-admin-secret";
}

function base64Url(input) {
  return Buffer.from(input).toString("base64url");
}

function sign(value) {
  return crypto.createHmac("sha256", secret()).update(value).digest("base64url");
}

export function hashAdminPassword(password) {
  return crypto.createHash("sha256").update(`${password}:${secret()}`).digest("hex");
}

export function verifyAdminCredentials(email, password) {
  const adminEmail = process.env.ADMIN_EMAIL || "davidsha@cowinmagnet.com";
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const normalizedAdminEmail = adminEmail.trim().toLowerCase();

  if (!normalizedEmail || normalizedEmail !== normalizedAdminEmail || !password) {
    return false;
  }

  if (process.env.ADMIN_PASSWORD_HASH) {
    return hashAdminPassword(password) === process.env.ADMIN_PASSWORD_HASH;
  }

  if (process.env.ADMIN_PASSWORD) {
    return password === process.env.ADMIN_PASSWORD;
  }

  return false;
}

export function isAdminAuthConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD_HASH || process.env.ADMIN_PASSWORD);
}

export function createAdminSession(email) {
  const payload = {
    email,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS
  };
  const encodedPayload = base64Url(JSON.stringify(payload));
  return `${encodedPayload}.${sign(encodedPayload)}`;
}

export function verifyAdminSession(token) {
  if (!token || !token.includes(".")) return null;

  const [encodedPayload, signature] = token.split(".");
  const expectedSignature = sign(encodedPayload);
  if (!signature || signature.length !== expectedSignature.length) return null;

  if (
    !crypto.timingSafeEqual(
      Buffer.from(signature || ""),
      Buffer.from(expectedSignature || "")
    )
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
    if (!payload?.email || !payload?.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  return verifyAdminSession(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
}

export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS
  };
}
