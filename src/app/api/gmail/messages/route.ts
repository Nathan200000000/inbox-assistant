import { NextRequest, NextResponse } from "next/server";
import { gmailRequest, googleAccessToken } from "@/lib/google";
function decodePart(data?: string) {
  if (!data) return "";
  try { return Buffer.from(data.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8"); } catch { return ""; }
}
function textBody(payload: any): string {
  if (payload?.mimeType === "text/plain" && payload?.body?.data) return decodePart(payload.body.data);
  for (const part of payload?.parts || []) { const found = textBody(part); if (found) return found; }
  if (payload?.body?.data) return decodePart(payload.body.data);
  return "";
}
function header(headers: any[], name: string) {
  return headers?.find((item) => String(item.name).toLowerCase() === name.toLowerCase())?.value || "";
}
export async function GET(request: NextRequest) {
  try {
    const auth = await googleAccessToken(request);
    if (!auth) return NextResponse.json({ connected: false, messages: [] }, { status: 401 });
    const list = await gmailRequest(auth.accessToken, "/messages?maxResults=30&labelIds=INBOX");
    const messages = await Promise.all((list.messages || []).slice(0, 30).map(async (item: { id: string; threadId: string }) => {
      const data = await gmailRequest(auth.accessToken, "/messages/" + encodeURIComponent(item.id) + "?format=full");
      const headers = data.payload?.headers || [];
      const from = header(headers, "From");
      const match = from.match(/^(.*?)\s*<([^>]+)>$/);
      const senderName = (match?.[1] || from).replace(/^["']|["']$/g, "");
      const senderEmail = match?.[2] || from;
      const plain = textBody(data.payload).replace(/\r/g, "").trim();
      const snippet = String(data.snippet || plain).replace(/\s+/g, " ").slice(0, 500);
      return {
        id: String(data.id), threadId: String(data.threadId || item.threadId),
        subject: header(headers, "Subject") || "(No subject)",
        from: { emailAddress: { name: senderName || senderEmail, address: senderEmail } },
        receivedDateTime: new Date(Number(data.internalDate || Date.now())).toISOString(),
        bodyPreview: snippet, webLink: "https://mail.google.com/mail/u/0/#all/" + encodeURIComponent(String(data.threadId || item.threadId)),
        isRead: !(data.labelIds || []).includes("UNREAD"),
      };
    }));
    return NextResponse.json({ connected: true, provider: "gmail", email: auth.email, messages });
  } catch (error) {
    return NextResponse.json({ connected: false, error: error instanceof Error ? error.message : "Could not read Gmail." }, { status: 502 });
  }
}
