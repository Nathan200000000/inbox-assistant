# Inbox Assistant

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FNathan200000000%2Finbox-assistant)


Inbox Assistant is a portfolio-ready email workflow demo with a real Microsoft Outlook integration. Browse a sample inbox without signing in, edit suggested replies, or connect your own Outlook mailbox to read messages and save reply drafts.

**Safety by design: the app can save drafts but does not implement sending email.** Review and send drafts yourself from Outlook.

## Try it

- Visit the site and open the **Interactive inbox demo** at `/app`.
- Sample messages are fictional and stay in the browser.
- To use a real mailbox, configure a Microsoft Entra app registration and the environment variables described in [the Outlook setup guide](docs/OUTLOOK_SETUP.md).

## Features

- Responsive inbox dashboard with sample data for a no-credentials demo.
- Microsoft OAuth authorization-code flow.
- Reads recent inbox messages using Microsoft Graph.
- Editable suggested replies and saves them as reply drafts in Outlook.
- No send endpoint or send button.
- Encrypted, HTTP-only session cookie for OAuth tokens.
- Next.js App Router, TypeScript, React, and Vercel deployment support.

## Local development

Requires Node.js 20.9 or newer.

```bash
npm install
cp .env.example .env.local
npm run dev
```

The demo works without environment variables. The Outlook connection needs a registered Microsoft application and the variables in `.env.local`. See [docs/OUTLOOK_SETUP.md](docs/OUTLOOK_SETUP.md).

## Deploy to Vercel

1. Import this GitHub repository in the [Vercel dashboard](https://vercel.com/new).
2. Set the project root to the repository root. Vercel should detect Next.js automatically.
3. Add `MICROSOFT_CLIENT_ID`, `MICROSOFT_CLIENT_SECRET`, `MICROSOFT_TENANT_ID`, `APP_URL`, and `SESSION_SECRET` as environment variables.
4. Add the production OAuth callback URL to the Microsoft app registration: `https://YOUR-VERCEL-DOMAIN/api/auth/microsoft/callback`.
5. Deploy, then test `/app` with sample data before connecting Outlook.

See [the Outlook setup guide](docs/OUTLOOK_SETUP.md) for full instructions. Do not commit real credentials or `.env.local`.

## Security notes

- The live integration uses delegated Microsoft Graph permissions for the signed-in account.
- `Mail.ReadWrite` allows reading mail and creating drafts; the app intentionally has no send-mail action.
- Treat this as a single-user portfolio starter, not a public multi-tenant email service. Add a full production security review, abuse protections, monitoring, and privacy disclosures before inviting general users.
- Never share client secrets, session secrets, OAuth tokens, real email contents, or mailbox exports in GitHub issues or portfolio screenshots.

## Project

- Interactive dashboard: `/app`
- Outlook integration setup: [docs/OUTLOOK_SETUP.md](docs/OUTLOOK_SETUP.md)
- Original ChatGPT Work prompt: [prompts/inbox-assistant.md](prompts/inbox-assistant.md)
- License: MIT
