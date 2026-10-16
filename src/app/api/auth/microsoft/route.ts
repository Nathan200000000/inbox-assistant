import { NextRequest, NextResponse } from "next/server";
import { createState, microsoftConfig, setStateCookie } from "@/lib/microsoft";
export async function GET(request: NextRequest) {
  try {
    const config = microsoftConfig();
    const state = createState();
    const url = new URL("https://login.microsoftonline.com/" + config.tenant + "/oauth2/v2.0/authorize");
    url.searchParams.set("client_id", config.clientId);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("redirect_uri", config.baseUrl + "/api/auth/microsoft/callback");
    url.searchParams.set("response_mode", "query");
    url.searchParams.set("scope", "openid profile email offline_access User.Read Mail.ReadWrite");
    url.searchParams.set("state", state);
    url.searchParams.set("prompt", "select_account");
    const response = NextResponse.redirect(url);
    setStateCookie(response, state);
    return response;
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Microsoft sign-in is not configured." }, { status: 500 });
  }
}
