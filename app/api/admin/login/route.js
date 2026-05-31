import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  adminCookieOptions,
  createAdminSession,
  isAdminAuthConfigured,
  verifyAdminCredentials
} from "@/lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  const formData = await request.formData();
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const url = new URL(request.url);

  if (!isAdminAuthConfigured()) {
    return NextResponse.redirect(new URL("/admin/login?error=not-configured", url), 303);
  }

  if (!verifyAdminCredentials(email, password)) {
    return NextResponse.redirect(new URL("/admin/login?error=invalid", url), 303);
  }

  const response = NextResponse.redirect(new URL("/admin", url), 303);
  response.cookies.set(ADMIN_COOKIE_NAME, createAdminSession(email), adminCookieOptions());
  return response;
}
