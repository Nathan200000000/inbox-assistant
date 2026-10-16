import { createHash, randomBytes } from "node:crypto";
import { EncryptJWT, jwtDecrypt } from "jose";
import type { NextRequest, NextResponse } from "next/server";
const sessionCookie = "ia_gmail_session";
const stateCookie = "ia_gmail_oauth_state";
function key() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("SESSION_SECRET must be at least 32 characters.");
  return createHash("sha256").update(secret).digest();
}
export function googleConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const baseUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL;
  if (!clientId || !clientSecret || !baseUrl) throw new Error("Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and APP_URL.");
  return { clientId, clientSecret, baseUrl: baseUrl.replace(/\/$/, "") };
}
export function createGoogleState() { return randomBytes(32).toString("hex"); }
export function setGoogleStateCookie(response: NextResponse, state: string) {
  response.cookies.set(stateCookie, state, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 600 });
}
export function readGoogleStateCookie(request: NextRequest) { return request.cookies.get(stateCookie)?.value; }
export function clearGoogleStateCookie(response: NextResponse) {
  response.cookies.set(stateCookie, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
}
export async function setGoogleSessionCookie(response: NextResponse, data: Record<string, unknown>) {
  const token = await new EncryptJWT(data).setProtectedHeader({ alg: "dir", enc: "A256GCM" }).setIssuedAt().setExpirationTime("30d").encrypt(key());
  response.cookies.set(sessionCookie, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 2592000 });
}
export async function getGoogleSession(request: NextRequest) {
  const value = request.cookies.get(sessionCookie)?.value;
  if (!value) return null;
  try { const { payload } = await jwtDecrypt(value, key()); return payload as Record<string, unknown>; } catch { return null; }
}
export function clearGoogleSessionCookie(response: NextResponse) {
  response.cookies.set(sessionCookie, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
}
export async function googleAccessToken(request: NextRequest) {
  const session = await getGoogleSession(request);
  if (!session?.refreshToken) return null;
  const config = googleConfig();
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: config.clientId, client_secret: config.clientSecret, grant_type: "refresh_token", refresh_token: String(session.refreshToken) }),
    cache: "no-store",
  });
  const tokens = await response.json();
  if (!response.ok || !tokens.access_token) throw new Error("Google session expired. Disconnect and reconnect Gmail.");
  return { accessToken: String(tokens.access_token), email: String(session.email || "") };
}
export async function gmailRequest(accessToken: string, path: string, init: RequestInit = {}) {
  const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me" + path, {
    ...init, headers: { Authorization: "Bearer " + accessToken, ...(init.body ? { "Content-Type": "application/json" } : {}), ...init.headers }, cache: "no-store",
  });
  if (!response.ok) {
    const details = await response.text();
    throw new Error("Gmail API returned " + response.status + (response.status === 403 ? ". Check Gmail API enablement and OAuth verification/testing access." : ".") + " " + details.slice(0, 180));
  }
  if (response.status === 204) return null;
  return response.json();
}
