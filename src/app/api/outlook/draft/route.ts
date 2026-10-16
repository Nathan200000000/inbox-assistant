import { NextRequest, NextResponse } from "next/server";
import { getSession, graphRequest } from "@/lib/microsoft";
export async function POST(request: NextRequest) {
  const session = await getSession(request);
  if (!session?.accessToken) return NextResponse.json({ error: "Connect Outlook first." }, { status: 401 });
  try {
    const input = await request.json();
    const messageId = typeof input.messageId === "string" ? input.messageId : "";
    const body = typeof input.body === "string" ? input.body.trim() : "";
    if (!messageId || !body || body.length > 12000) return NextResponse.json({ error: "A message and reply text are required." }, { status: 400 });
    const draft = await graphRequest(String(session.accessToken), "/me/messages/" + encodeURIComponent(messageId) + "/createReply", { method: "POST" });
    await graphRequest(String(session.accessToken), "/me/messages/" + encodeURIComponent(draft.id), { method: "PATCH", body: JSON.stringify({ body: { contentType: "Text", content: body } }) });
    return NextResponse.json({ ok: true, draftId: draft.id, message: "Reply saved to Outlook Drafts. Nothing was sent." });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Could not save draft." }, { status: 502 }); }
}
