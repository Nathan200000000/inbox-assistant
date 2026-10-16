import { NextRequest, NextResponse } from "next/server";
import { clearStateCookie, microsoftConfig, readStateCookie, setSessionCookie } from "@/lib/microsoft";
export async function GET(request: NextRequest) {
  const config = microsoftConfig();
  const incomingState = request.nextUrl.searchParams.get("state");
  const savedState = readStateCookie(request);
  const code = request.nextUrl.searchParams.get("code");
  if (!incomingState || !savedState || incomingState !== savedState || !code) {
    const response = NextResponse.redirect(new URL("/app?connection=failed", config.baseUrl));
    clearStateCookie(response); return response;
  }
  try {
    const body = new URLSearchParams({ client_id: config.clientId, client_secret: config.clientSecret, grant_type: "authorization_code", code, redirect_uri: config.baseUrl + "/api/auth/microsoft/callback", scope: "openid profile email offline_access User.Read Mail.ReadWrite" });
    const tokenResponse = await fetch("https://login.microsoftonline.com/" + config.tenant + "/oauth2/v2.0/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body, cache: "no-store" });
    const tokens = await tokenResponse.json();
    if (!tokenResponse.ok || !tokens.access_token) throw new Error("Microsoft token exchange failed.");
    const response = NextResponse.redirect(new URL("/app?connection=connected", config.baseUrl));
    clearStateCookie(response);
    await setSessionCookie(response, { accessToken: tokens.access_token, refreshToken: tokens.refresh_token, expiresAt: Date.now() + Number(tokens.expires_in || 3600) * 1000, connectedAt: Date.now() });
    return response;
  } catch {
    const response = NextResponse.redirect(new URL("/app?connection=failed", config.baseUrl));
    clearStateCookie(response); return response;
  }
}
