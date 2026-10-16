import { NextRequest, NextResponse } from "next/server";
import { clearGoogleStateCookie, googleConfig, readGoogleStateCookie, setGoogleSessionCookie } from "@/lib/google";
export async function GET(request: NextRequest) {
  const config = googleConfig();
  const incomingState = request.nextUrl.searchParams.get("state");
  const savedState = readGoogleStateCookie(request);
  const code = request.nextUrl.searchParams.get("code");
  const providerError = request.nextUrl.searchParams.get("error");
  if (providerError || !incomingState || !savedState || incomingState !== savedState || !code) {
    const response = NextResponse.redirect(new URL("/app?connection=google-failed", config.baseUrl));
    clearGoogleStateCookie(response);
    return response;
  }
  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ client_id: config.clientId, client_secret: config.clientSecret, code, grant_type: "authorization_code", redirect_uri: config.baseUrl + "/api/auth/google/callback" }),
      cache: "no-store",
    });
    const tokens = await tokenResponse.json();
    if (!tokenResponse.ok || !tokens.refresh_token) throw new Error("Google did not return a refresh token.");
    const profileResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", { headers: { Authorization: "Bearer " + tokens.access_token }, cache: "no-store" });
    const profile = await profileResponse.json();
    if (!profileResponse.ok || !profile.email) throw new Error("Could not verify the Google account.");
    const response = NextResponse.redirect(new URL("/app?provider=gmail&connection=connected", config.baseUrl));
    clearGoogleStateCookie(response);
    await setGoogleSessionCookie(response, { refreshToken: tokens.refresh_token, email: String(profile.email), sub: String(profile.sub || "") });
    return response;
  } catch {
    const response = NextResponse.redirect(new URL("/app?connection=google-failed", config.baseUrl));
    clearGoogleStateCookie(response);
    return response;
  }
}
