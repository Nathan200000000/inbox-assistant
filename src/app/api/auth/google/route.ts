import { NextResponse } from "next/server";
import { createGoogleState, googleConfig, setGoogleStateCookie } from "@/lib/google";
export async function GET() {
  try {
    const config = googleConfig();
    const state = createGoogleState();
    const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    url.searchParams.set("client_id", config.clientId);
    url.searchParams.set("redirect_uri", config.baseUrl + "/api/auth/google/callback");
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", "openid email profile https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.compose");
    url.searchParams.set("access_type", "offline");
    url.searchParams.set("prompt", "consent select_account");
    url.searchParams.set("include_granted_scopes", "true");
    url.searchParams.set("state", state);
    const response = NextResponse.redirect(url);
    setGoogleStateCookie(response, state);
    return response;
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Google sign-in is not configured." }, { status: 500 });
  }
}
