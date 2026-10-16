import { NextRequest, NextResponse } from "next/server";
import { getSession, graphRequest, microsoftConfig, setSessionCookie } from "@/lib/microsoft";
export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session?.accessToken) return NextResponse.json({ connected: false, messages: [] }, { status: 401 });
  try {
    let accessToken = String(session.accessToken);
    if (Number(session.expiresAt || 0) < Date.now() + 60000 && session.refreshToken) {
      const config = microsoftConfig();
      const refreshResponse = await fetch("https://login.microsoftonline.com/" + config.tenant + "/oauth2/v2.0/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ client_id: config.clientId, client_secret: config.clientSecret, grant_type: "refresh_token", refresh_token: String(session.refreshToken), scope: "openid profile email offline_access User.Read Mail.ReadWrite" }), cache: "no-store" });
      const refreshed = await refreshResponse.json();
      if (!refreshResponse.ok || !refreshed.access_token) throw new Error("Outlook session expired. Please reconnect.");
      accessToken = refreshed.access_token; session.accessToken = refreshed.access_token;
      session.refreshToken = refreshed.refresh_token || session.refreshToken;
      session.expiresAt = Date.now() + Number(refreshed.expires_in || 3600) * 1000;
    }
    const data = await graphRequest(accessToken, "/me/mailFolders/inbox/messages?$select=id,subject,from,receivedDateTime,bodyPreview,webLink,isRead,conversationId&$orderby=receivedDateTime%20desc&$top=30");
    const response = NextResponse.json({ connected: true, messages: data.value || [] });
    if (session.expiresAt && Number(session.expiresAt) > Date.now()) await setSessionCookie(response, session);
    return response;
  } catch (error) { return NextResponse.json({ connected: false, error: error instanceof Error ? error.message : "Could not read Outlook." }, { status: 502 }); }
}
