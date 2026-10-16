# Gmail setup

This app supports per-user Google OAuth sign-in and Gmail inbox access. Each user connects their own Google account; the app does not use a shared mailbox or a service account.

## Google Cloud setup

1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Create/select a project and enable the **Gmail API**.
3. Configure Google Auth Platform branding, audience, and data access. Add the app name, support email, homepage URL, and privacy-policy URL (\`https://YOUR_DOMAIN/privacy\`).
4. Create an OAuth client ID of type **Web application**.
5. Add this authorized redirect URI exactly: \`https://YOUR_DOMAIN/api/auth/google/callback\`. For local development, add \`http://localhost:3000/api/auth/google/callback\`.
6. Add the Google client ID and secret to Vercel Environment Variables and redeploy.

Required environment variables:

- \`GOOGLE_CLIENT_ID\`
- \`GOOGLE_CLIENT_SECRET\`
- \`APP_URL\` (the canonical public URL, with no trailing slash)
- \`SESSION_SECRET\` (random secret, at least 32 characters)

The existing \`SESSION_SECRET\` is used to encrypt the signed-in user's refresh-token session cookie. Never commit secrets to GitHub.

## OAuth scopes

- \`openid email profile\`: identify the signed-in account.
- \`https://www.googleapis.com/auth/gmail.readonly\`: display recent inbox messages and their contents.
- \`https://www.googleapis.com/auth/gmail.compose\`: create reply drafts. The app has no send-email endpoint.

Gmail scopes that expose mailbox contents are sensitive or restricted and Google may require OAuth app verification before general users can authorize the app. Because this app accesses Gmail data through a server, Google may also require an independent security assessment for restricted-scope access. Follow the current [Google OAuth production-readiness requirements](https://developers.google.com/identity/protocols/oauth2/production-readiness/restricted-scope-verification) and [sensitive-scope verification guide](https://developers.google.com/identity/protocols/oauth2/production-readiness/sensitive-scope-verification). Until review is approved, an app in Testing may only be available to configured test users and can show an unverified-app warning.

## Testing

1. Add your own Google account as a test user while the consent screen is in Testing.
2. Open \`/app\`, choose **Connect Gmail**, and approve the requested scopes.
3. Confirm inbox messages load and save a test reply draft.
4. Verify the reply appears in Gmail Drafts and was not sent.
5. Test disconnect, token expiry, OAuth denial, and a second Google account.

## Public launch checklist

- Publish a clear privacy policy and terms/contact information.
- Complete Google branding and scope verification, if required.
- Complete a security review, rate limiting, abuse protection, monitoring, and incident response plan before inviting the public.
- Consider moving refresh tokens to a dedicated encrypted database/session store with explicit account deletion and revocation handling before production scale.
- Do not claim the app is Google-verified until Google approves it.
