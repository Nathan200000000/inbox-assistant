# Inbox Assistant

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Inbox Assistant is a multi-account email workspace. Users can connect their own Gmail or Microsoft Outlook account, review recent inbox messages, edit a suggested reply, and save it as a draft in their mailbox.

**Safety by design: drafts only. The app does not send email.** Review and send drafts yourself in Gmail or Outlook.

## Features

- Sample inbox demo that works without credentials.
- Per-user Google OAuth sign-in and Gmail API integration.
- Per-user Microsoft OAuth sign-in and Microsoft Graph integration.
- Read recent inbox messages and create reply drafts in the corresponding mailbox.
- Encrypted, HTTP-only session cookies for OAuth sessions.
- Privacy policy at `/privacy`.
- Next.js App Router, TypeScript, React, and Vercel deployment support.

## Try it

Open `/app` on the deployed site. The sample inbox works without signing in. Connect Gmail or Outlook to load a real mailbox.

## Local development

Requires Node.js 20.9 or newer.

```bash
npm install
cp .env.example .env.local
npm run dev
```

The demo works without environment variables. Live providers require OAuth app registrations and environment variables.

## Vercel environment variables

- `APP_URL`: canonical deployed origin, for example `https://your-app.vercel.app`, with no trailing slash.
- `SESSION_SECRET`: random secret at least 32 characters long.
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: Google OAuth web client.
- `MICROSOFT_CLIENT_ID`, `MICROSOFT_CLIENT_SECRET`, `MICROSOFT_TENANT_ID`: Microsoft Entra app registration.

Add the exact redirect URIs to each provider:

- Google: `https://YOUR_DOMAIN/api/auth/google/callback`
- Microsoft: `https://YOUR_DOMAIN/api/auth/microsoft/callback`

See [Gmail setup](docs/GMAIL_SETUP.md) and [Outlook setup](docs/OUTLOOK_SETUP.md). Never commit secrets or `.env.local`.

## Google public-launch requirements

The Gmail integration requests `gmail.readonly` to show inbox content and `gmail.compose` to create drafts. Google may require OAuth app verification, and restricted-scope access through a server may require an independent security assessment. Until Google approves the consent screen and scopes, the app may only work for configured test users. Read the [Gmail setup guide](docs/GMAIL_SETUP.md) before inviting the public.

The current implementation stores the encrypted OAuth refresh token in an HTTP-only session cookie and does not intentionally persist message content in a database. Before public launch, complete a security review and consider a dedicated encrypted session store, rate limits, abuse protection, monitoring, account revocation handling, and incident response.

## Privacy and safety

- The app requests delegated access to the signed-in user's own mailbox.
- It does not have a send-email endpoint or send button.
- Review the [Privacy Policy](/privacy).
- Public availability depends on provider OAuth approval and production configuration; deployment alone does not make Google OAuth verified.

## Project links

- Interactive dashboard: `/app`
- [Gmail setup](docs/GMAIL_SETUP.md)
- [Outlook setup](docs/OUTLOOK_SETUP.md)
- [MIT License](LICENSE)
