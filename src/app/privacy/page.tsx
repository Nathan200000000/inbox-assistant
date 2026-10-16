export default function PrivacyPolicy() {
  return <main style={{ maxWidth: 780, margin: "60px auto", padding: "0 24px", fontFamily: "Arial, sans-serif", lineHeight: 1.7, color: "#17212b" }}>
    <a href="/">← Inbox Assistant</a>
    <h1>Privacy Policy</h1>
    <p><strong>Last updated: October 16, 2026</strong></p>
    <p>Inbox Assistant helps you review email and prepare reply drafts. You choose whether to connect a mailbox and can disconnect at any time.</p>
    <h2>Information accessed</h2>
    <p>If you connect Gmail, the app requests permission to view messages in your mailbox and create drafts. It uses this access only to display your inbox and create the draft you explicitly request. It does not send email, sell personal data, use mailbox content for advertising, or use mailbox content to train AI models.</p>
    <p>If you connect Outlook, the app uses the Microsoft permissions shown during sign-in to display messages and save reply drafts.</p>
    <h2>Storage and security</h2>
    <p>OAuth refresh tokens are stored in encrypted, HTTP-only, secure cookies and are not intentionally exposed to browser JavaScript. Email content is fetched on demand and is not intentionally stored in an application database. Internet transmission and hosting infrastructure still carry operational risks; do not connect an account unless you trust the service.</p>
    <h2>Sharing and retention</h2>
    <p>Mailbox content and tokens are not sold or shared for advertising. Disconnecting clears the app session cookie. To revoke access fully, remove Inbox Assistant from your Google Account or Microsoft account connected-app permissions. Some service logs may retain limited technical data under hosting-provider policies.</p>
    <h2>Your choices</h2>
    <p>You can decline to connect, disconnect at any time, and revoke the app's permissions through your account provider. Contact the project owner through the public GitHub repository for privacy questions or deletion requests.</p>
    <h2>Changes</h2>
    <p>This policy may be updated as the app changes. The current version will be published on this page.</p>
  </main>;
}
