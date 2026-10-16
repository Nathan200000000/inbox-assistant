# Configure the live Outlook integration

The dashboard runs in demo mode without credentials. Real mailbox access requires a Microsoft Entra app registration and environment variables. Never commit secrets to GitHub.

## 1. Register a Microsoft app

1. Open the Microsoft Entra admin center: https://entra.microsoft.com/
2. Create an App registration and choose the account types you want to support.
3. Add a Web redirect URI for local development: http://localhost:3000/api/auth/microsoft/callback
4. After deployment, add https://YOUR-VERCEL-DOMAIN/api/auth/microsoft/callback as another Web redirect URI.
5. Create a client secret and copy its value once. Keep it private.
6. Add delegated Microsoft Graph permissions: User.Read and Mail.ReadWrite, plus openid, profile, email, and offline_access. Grant consent if your organization requires it.

The app requests delegated access for the signed-in user. Mail.ReadWrite is needed to read inbox messages and save reply drafts. There is intentionally no send-mail action.

## 2. Configure environment variables

Set these in Vercel Project Settings → Environment Variables and in an untracked local .env.local file:

- MICROSOFT_CLIENT_ID: application (client) ID
- MICROSOFT_CLIENT_SECRET: secret value
- MICROSOFT_TENANT_ID: common or your tenant ID
- APP_URL: base URL for the environment, such as https://your-app.vercel.app
- SESSION_SECRET: unique random string, at least 32 characters

Generate a local secret with openssl rand -base64 32. Never commit or share it.

## 3. Deploy and test

1. Deploy the repository to Vercel.
2. Set production environment variables and the production redirect URI.
3. Redeploy after changing environment variables.
4. Visit /app, select Connect Outlook, and sign in with Microsoft.
5. Select a message, edit the reply, save it, and check the Outlook Drafts folder.

## Safety and limitations

- The dashboard provides an interactive sample-data demo without mailbox credentials.
- Live inbox reads and reply-draft creation use Microsoft Graph on the server.
- Draft creation does not send the message. There is intentionally no send endpoint or send button.
- This starter is intended for a single-user portfolio/demo deployment. Before opening it to the public as a multi-user service, add a reviewed multi-user auth/session architecture, rate limiting, CSRF protections for state-changing endpoints, security monitoring, and privacy disclosures.
- The encrypted HTTP-only session cookie contains OAuth tokens. Use HTTPS in production and rotate the session secret if exposed.
- Microsoft tenant policies may require admin consent or prevent app registration.
