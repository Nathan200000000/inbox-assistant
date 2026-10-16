# Handshake portfolio listing

## Project title
Inbox Assistant — Outlook Reply Drafting Dashboard

## Short description
A privacy-conscious email workflow app with an interactive sample inbox and Microsoft Outlook integration. Review incoming messages, edit a suggested response, and save it as a draft. The app intentionally does not send emails.

## Portfolio description
I built Inbox Assistant as a full-stack Next.js project focused on thoughtful email workflows and user control. The dashboard includes a no-login demo with fictional messages, a Microsoft sign-in flow, Microsoft Graph inbox retrieval, and editable replies saved as Outlook drafts. OAuth tokens are kept in an encrypted HTTP-only session cookie, and the product deliberately has no send-email endpoint or send button.

**Stack:** Next.js, React, TypeScript, Microsoft Graph, Microsoft identity platform OAuth, jose, Vercel.

**Safety note:** The public demo uses fictional sample data. Live Outlook access requires the user to configure a Microsoft Entra app registration and private deployment environment variables. This starter is intended for a single-user portfolio demo, not an open multi-user email service.

## Links
- GitHub source: https://github.com/Nathan200000000/inbox-assistant
- Interactive demo path after deployment: /app
- Deployment: add the Vercel URL after the project is imported and deployed.

## Screenshot checklist
1. Landing page hero and interactive demo CTA.
2. Dashboard with the sample inbox and editable reply draft.
3. A clear “Not sent” label and draft-only safety statement.
4. Optional: a short screen recording selecting a sample message and editing its draft.

Use only fictional/sample emails in public screenshots. Never show real email addresses, mailbox contents, OAuth settings, client secrets, or environment variables.
