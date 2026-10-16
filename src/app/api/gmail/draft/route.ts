import { NextRequest, NextResponse } from "next/server";
import { gmailRequest, googleAccessToken } from "@/lib/google";
function encodeBase64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function header(headers: any[], name: string) {
  return headers?.find((item) => String(item.name).toLowerCase() === name.toLowerCase())?.value || "";
}
export async function POST(request: NextRequest) {
  try {
    const auth = await googleAccessToken(request);
    if (!auth) return NextResponse.json({ error: "Connect Gmail first." }, { status: 401 });
    const input = await request.json();
    const messageId = typeof input.messageId === "string" ? input.messageId : "";
    const threadId = typeof input.threadId === "string" ? input.threadId : "";
    const body = typeof input.body === "string" ? input.body.trim() : "";
    if (!messageId || !threadId || !body || body.length > 12000) return NextResponse.json({ error: "A message, thread, and reply text are required." }, { status: 400 });
    const original = await gmailRequest(auth.accessToken, "/messages/" + encodeURIComponent(messageId) + "?format=metadata&metadataHeaders=From&metadataHeaders=Reply-To&metadataHeaders=Subject&metadataHeaders=Message-ID&metadataHeaders=References");
    const headers = original.payload?.headers || [];
    const from = header(headers, "Reply-To") || header(headers, "From");
    const subject = header(headers, "Subject") || "(No subject)";
    const replySubject = /^re:/i.test(subject) ? subject : "Re: " + subject;
    const messageIdHeader = header(headers, "Message-ID");
    const references = [header(headers, "References"), messageIdHeader].filter(Boolean).join(" ");
    const safe = (value: string) => value.replace(/[\r\n]+/g, " ").trim();
    const mime = [
      "To: " + safe(from), "Subject: " + safe(replySubject),
      ...(messageIdHeader ? ["In-Reply-To: " + safe(messageIdHeader)] : []),
      ...(references ? ["References: " + safe(references)] : []),
      "MIME-Version: 1.0", 'Content-Type: text/plain; charset="UTF-8"', "Content-Transfer-Encoding: 8bit", "", body,
    ].join("\r\n");
    const draft = await gmailRequest(auth.accessToken, "/drafts", { method: "POST", body: JSON.stringify({ message: { threadId, raw: encodeBase64Url(mime) } }) });
    return NextResponse.json({ ok: true, draftId: draft.id, message: "Reply saved to Gmail Drafts. Nothing was sent." });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not save Gmail draft." }, { status: 502 });
  }
}
