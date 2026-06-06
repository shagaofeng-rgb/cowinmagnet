import { NextResponse } from "next/server";
import { createPasswordReset, isConfiguredAdminEmail } from "@/lib/adminAccountStore";
import { sendAdminPasswordResetEmail } from "@/lib/adminEmail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const attempts = new Map();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function clientKey(request) {
  const forwarded = request.headers.get("x-forwarded-for") || "";
  return forwarded.split(",")[0].trim() || request.headers.get("x-real-ip") || "unknown";
}

function rateLimited(key) {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.resetAt <= now) return false;
  return entry.count >= MAX_ATTEMPTS;
}

function recordAttempt(key) {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }
  attempts.set(key, { ...entry, count: entry.count + 1 });
}

function successRedirect(request) {
  return NextResponse.redirect(new URL("/admin/forgot-password?sent=1", request.url), 303);
}

export async function POST(request) {
  const formData = await request.formData();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const key = clientKey(request);

  if (rateLimited(key)) return successRedirect(request);
  recordAttempt(key);

  if (isConfiguredAdminEmail(email)) {
    const { token } = await createPasswordReset(email);
    const siteUrl =
      process.env.SITE_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      `${new URL(request.url).protocol}//${new URL(request.url).host}`;
    const resetUrl = `${siteUrl.replace(/\/$/, "")}/admin/reset-password?token=${encodeURIComponent(token)}`;

    try {
      await sendAdminPasswordResetEmail({ to: email, resetUrl });
    } catch (error) {
      console.error("Admin reset email failed", error);
    }
  }

  return successRedirect(request);
}
