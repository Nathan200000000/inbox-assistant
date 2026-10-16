import { createHash, randomBytes } from "node:crypto";
import { EncryptJWT, jwtDecrypt } from "jose";
import type { NextRequest, NextResponse } from "next/server";
const cookieName = "ia_session";
const stateCookie = "ia_oauth_state";
function encryptionKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("SESSION_SECRET must be at least 32 characters.");
  return createHash("sha256").update(secret).digest();
}
export function microsoftConfig() {
  const clientId = process.env.MICROSOFT_CLIENT_ID;
  const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;
  const tenant = process.env.MICROSOFT_TENANT_ID || "common";
  const baseUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL;
  if (!clientId || !clientSecret || !baseUrl) throw new Error("Set MICROSOFT_CLIENT_ID, MICROSOFT_CLIENT_SECRET, and APP_URL.");
  return { clientId, clientSecret, tenant, baseUrl: baseUrl.replace(/\/$/, "") };
}
export function createState() { return randomBytes(24).toString("hex"); }
export function setStateCookie(response: NextResponse, state: string) {
  response.cookies.set(stateCookie, state, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 600 });
}
export function readStateCookie(request: NextRequest) { return request.cookies.get(stateCookie)?.value; }
export function clearStateCookie(response: NextResponse) {
  response.cookies.set(stateCookie, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
}
export async function setSessionCookie(response: NextResponse, tokens: Record<string, unknown>) {
  const token = await new EncryptJWT(tokens).setProtectedHeader({ alg: "dir", enc: "A256GCM" }).setIssuedAt().setExpirationTime("7d").encrypt(encryptionKey());
  response.cookies.set(cookieName, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 604800 });
}
export async function getSession(request: NextRequest) {
  const value = request.cookies.get(cookieName)?.value;
  if (!value) return null;
  try { const { payload } = await jwtDecrypt(value, encryptionKey()); return payload as Record<string, unknown>; } catch { return null; }
}
export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(cookieName, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
}
export async function graphRequest(accessToken: string, path: string, init: RequestInit = {}) {
  const response = await fetch("https://graph.microsoft.com/v1.0" + path, { ...init, headers: { Authorization: "Bearer " + accessToken, "Content-Type": "application/json", ...init.headers }, cache: "no-store" });
  if (!response.ok) { const message = await response.text(); throw new Error("Microsoft Graph returned " + response.status + ": " + message.slice(0, 300)); }
  if (response.status === 204) return null;
  return response.json();
}
