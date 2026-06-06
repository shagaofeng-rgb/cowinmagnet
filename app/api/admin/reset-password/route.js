import { NextResponse } from "next/server";
import {
  consumePasswordResetToken,
  passwordMeetsPolicy,
  upsertStoredAdminPassword
} from "@/lib/adminAccountStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  const formData = await request.formData();
  const token = String(formData.get("token") || "");
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");
  const url = new URL(request.url);

  if (!passwordMeetsPolicy(password)) {
    return NextResponse.redirect(new URL(`/admin/reset-password?token=${encodeURIComponent(token)}&error=weak`, url), 303);
  }

  if (password !== confirmPassword) {
    return NextResponse.redirect(new URL(`/admin/reset-password?token=${encodeURIComponent(token)}&error=mismatch`, url), 303);
  }

  const reset = await consumePasswordResetToken(token);
  if (!reset) {
    return NextResponse.redirect(new URL("/admin/reset-password?error=invalid", url), 303);
  }

  await upsertStoredAdminPassword({ email: reset.email, password });
  return NextResponse.redirect(new URL("/admin/login?reset=success", url), 303);
}
