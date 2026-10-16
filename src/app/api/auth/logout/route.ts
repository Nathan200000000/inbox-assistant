import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/microsoft";
import { clearGoogleSessionCookie } from "@/lib/google";
export async function POST() {
  const response = NextResponse.json({ ok: true });
  clearSessionCookie(response);
  clearGoogleSessionCookie(response);
  return response;
}
