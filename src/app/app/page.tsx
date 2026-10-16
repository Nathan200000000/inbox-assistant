"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Mail = { id: string; threadId?: string; subject?: string; from?: { emailAddress?: { name?: string; address?: string } }; receivedDateTime?: string; bodyPreview?: string; webLink?: string; isRead?: boolean };
const samples: Mail[] = [
  { id: "demo-1", subject: "Revised project timeline", from: { emailAddress: { name: "Jordan Lee", address: "jordan@example.com" } }, receivedDateTime: new Date(Date.now() - 32 * 60000).toISOString(), bodyPreview: "Could you take a look at the revised timeline and let me know if Friday still works?" },
  { id: "demo-2", subject: "Quick feedback on the proposal", from: { emailAddress: { name: "Morgan Patel", address: "morgan@example.com" } }, receivedDateTime: new Date(Date.now() - 3 * 3600000).toISOString(), bodyPreview: "Would you be able to share your feedback on the proposal before our meeting tomorrow?" },
  { id: "demo-3", subject: "Coffee next week?", from: { emailAddress: { name: "Alex Rivera", address: "alex@example.com" } }, receivedDateTime: new Date(Date.now() - 6 * 3600000).toISOString(), bodyPreview: "Are you free to catch up over coffee sometime next week?" },
];
const suggested = (mail: Mail) => {
  const name = mail.from?.emailAddress?.name?.split(" ")[0] || "there";
  if (/coffee|lunch|meet/i.test(mail.subject || "")) return "Hi " + name + ",\n\nThanks for reaching out! I'd be happy to find a time. Could you share a couple of options that work for you?\n\nBest";
  if (/feedback|proposal|review/i.test(mail.subject || "")) return "Hi " + name + ",\n\nThanks for sending this over. I'll take a look and share my feedback before our meeting.\n\nBest";
  return "Hi " + name + ",\n\nThanks for the update. Friday works for me. I'll review the details and let you know if anything needs discussion.\n\nBest";
};
function formatDate(value?: string) { return value ? new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date(value)) : ""; }

export default function AppDashboard() {
  const [connected, setConnected] = useState(false);
  const [liveMode, setLiveMode] = useState(false);
  const [provider, setProvider] = useState<"gmail" | "outlook">("gmail");
  const [accountEmail, setAccountEmail] = useState("");
  const [messages, setMessages] = useState<Mail[]>(samples);
  const [selectedId, setSelectedId] = useState("demo-1");
  const [reply, setReply] = useState(suggested(samples[0]));
  const [status, setStatus] = useState("Demo mode · sample emails only");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const selected = messages.find((mail) => mail.id === selectedId) || messages[0];
  const reload = useCallback(async () => {
    const requested = new URLSearchParams(window.location.search).get("provider");
    const providers: Array<"gmail" | "outlook"> = requested === "outlook" ? ["outlook", "gmail"] : ["gmail", "outlook"];
    for (const candidate of providers) {
      try {
        const response = await fetch(candidate === "gmail" ? "/api/gmail/messages" : "/api/outlook/messages", { cache: "no-store" });
        const data = await response.json();
        if (response.ok && data.connected) {
          setMessages(data.messages || []);
          setConnected(true);
          setLiveMode(true);
          setProvider(candidate);
          setAccountEmail(data.email || "");
          setStatus("Connected to " + (candidate === "gmail" ? "Gmail" : "Outlook") + (data.email ? " · " + data.email : "") + " · live inbox");
          setError("");
          if (data.messages?.length) setSelectedId((current: string) => data.messages.some((m: Mail) => m.id === current) ? current : data.messages[0].id);
          return;
        }
        if (response.status !== 401 && data.error && candidate === requested) {
          setError(data.error);
        }
      } catch { /* Try the other provider or keep the demo available. */ }
    }
  }, []);
  useEffect(() => { void reload(); }, [reload]);
  useEffect(() => { if (selected) setReply(suggested(selected)); }, [selectedId]); // eslint-disable-line react-hooks/exhaustive-deps
  const savedCount = savedIds.length;
  const attentionCount = useMemo(() => messages.length, [messages]);
  async function saveDraft() {
    if (!selected || selected.id.startsWith("demo-")) {
      setStatus("Demo preview only · connect Gmail or Outlook to save a real draft");
      return;
    }
    setBusy(true); setError("");
    try {
      const response = await fetch(provider === "gmail" ? "/api/gmail/draft" : "/api/outlook/draft", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId: selected.id, threadId: selected.threadId, body: reply }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Draft could not be saved.");
      setSavedIds((items) => [...items, selected.id]);
      setStatus("Saved to " + (provider === "gmail" ? "Gmail" : "Outlook") + " Drafts · nothing was sent");
    } catch (e) { setError(e instanceof Error ? e.message : "Draft could not be saved."); }
    finally { setBusy(false); }
  }
  async function disconnect() {
    await fetch("/api/auth/logout", { method: "POST" });
    setConnected(false); setLiveMode(false); setAccountEmail(""); setMessages(samples); setSelectedId(samples[0].id); setReply(suggested(samples[0]));
    setStatus("Demo mode · sample emails only"); setError("");
    window.history.replaceState({}, "", "/app");
  }
  return <main className="workspace">
    <header className="app-topbar">
      <a className="brand" href="/"><span className="brand-mark">i</span><span>inbox assistant</span></a>
      <div className="app-nav"><a href="/">Home</a><a href="/privacy">Privacy</a><a href="https://github.com/Nathan200000000/inbox-assistant" target="_blank" rel="noreferrer">GitHub ↗</a><span className={connected ? "connection-pill connected" : "connection-pill"}>{connected ? "● " + (provider === "gmail" ? "Gmail" : "Outlook") + " connected" : "● Demo mode"}</span></div>
    </header>
    <div className="app-shell">
      <aside className="app-sidebar">
        <p className="eyebrow">WORKSPACE</p><h1>Review queue</h1><p className="sidebar-copy">A thoughtful first draft, always yours to approve.</p>
        <a className="button button-primary connect-button" href="/api/auth/google">Connect Gmail ↗</a>
        <a className="button button-secondary connect-button" href="/api/auth/microsoft">Connect Outlook ↗</a>
        {connected && <button className="text-button" onClick={() => void disconnect()}>Disconnect mailbox</button>}
        <div className="sidebar-stats"><div><strong>{attentionCount}</strong><span>Inbox messages</span></div><div><strong>{savedCount}</strong><span>Drafts saved this session</span></div></div>
        <div className="sidebar-info"><span className="shield">✓</span><div><strong>Approval stays with you</strong><p>This app can save reply drafts. There is no send-email action.</p></div></div>
        <p className="sidebar-foot">OAuth sessions are encrypted in HTTP-only cookies. Email content is fetched on demand.</p>
      </aside>
      <section className="mail-panel">
        <div className="panel-heading"><div><p className="eyebrow">{liveMode ? "YOUR " + (provider === "gmail" ? "GMAIL" : "OUTLOOK") + " INBOX" : "INTERACTIVE PREVIEW"}</p><h2>Messages to review</h2></div><span className="count-pill">{messages.length} messages</span></div>
        <p className="mode-note">{status}</p>
        {error && <p className="error-note" role="alert">{error}</p>}
        <div className="mail-list">
          {messages.map((mail) => <button key={mail.id} className={mail.id === selectedId ? "mail-row selected" : "mail-row"} onClick={() => setSelectedId(mail.id)}>
            <span className="mail-avatar">{(mail.from?.emailAddress?.name || "?").split(" ").map((x) => x[0]).join("").slice(0, 2).toUpperCase()}</span>
            <span className="mail-summary"><strong>{mail.from?.emailAddress?.name || mail.from?.emailAddress?.address || "Unknown sender"}</strong><span className="mail-subject">{mail.subject || "(No subject)"}</span><span className="mail-excerpt">{mail.bodyPreview || "No preview available."}</span></span>
            <span className="mail-time">{formatDate(mail.receivedDateTime)}{savedIds.includes(mail.id) && <i>Draft saved</i>}</span>
          </button>)}
          {messages.length === 0 && <div className="empty-state"><strong>Your inbox is clear.</strong><p>No messages were returned. Switch back to the sample preview if you want to explore the interface.</p><button className="button button-secondary" onClick={() => { setMessages(samples); setSelectedId(samples[0].id); setLiveMode(false); setStatus("Demo mode · sample emails only"); }}>Open demo preview</button></div>}
        </div>
      </section>
      <section className="draft-panel">
        <div className="draft-panel-head"><div><p className="eyebrow">COMPOSE WITH CARE</p><h2>Reply draft</h2></div><span className="draft-status">Not sent</span></div>
        {selected ? <>
          <div className="reply-context"><span>TO</span><strong>{selected.from?.emailAddress?.name || selected.from?.emailAddress?.address}</strong><span>SUBJECT</span><strong>Re: {selected.subject || "(No subject)"}</strong>{selected.webLink && <a href={selected.webLink} target="_blank" rel="noreferrer">Open original email ↗</a>}</div>
          <div className="original-message"><span>ORIGINAL MESSAGE</span><p>{selected.bodyPreview || "No message preview available."}</p></div>
          <label className="reply-label" htmlFor="reply-body">Suggested reply · edit before saving</label>
          <textarea id="reply-body" value={reply} onChange={(event) => setReply(event.target.value)} rows={8} />
          <button className="button button-primary save-draft-button" disabled={busy || !reply.trim()} onClick={() => void saveDraft()}>{busy ? "Saving draft…" : liveMode ? "Save reply to " + (provider === "gmail" ? "Gmail" : "Outlook") + " Drafts" : "Preview draft action"}</button>
          <p className="draft-disclaimer">Saving creates a reply draft in your mailbox. This app never sends it. Demo mode does not write to any mailbox.</p>
        </> : <div className="empty-state">Choose a message to draft a reply.</div>}
      </section>
    </div>
    <footer className="app-footer"><span>Inbox Assistant · Open source</span><span>Drafts only. Your approval is the final step.</span><a href="/">Project overview ↗</a></footer>
  </main>;
}
