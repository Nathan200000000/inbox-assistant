# Inbox Assistant

A free, reusable website and setup kit for a personal inbox assistant in ChatGPT Work. It helps you find emails that need a reply, prepare Gmail or Outlook drafts for review, and check again on a schedule you choose.

**Every reply stays a draft until you review and send it yourself.** This is a prompt and setup guide, not a hosted email service. The site does not connect to or store anyone’s mailbox.

## Use the assistant

1. Open ChatGPT in the desktop app and switch to Work.
2. Connect Gmail or Outlook Email in ChatGPT Work.
3. Copy the setup prompt from the website or open [prompts/inbox-assistant.md](prompts/inbox-assistant.md).
4. Paste it into a new Work chat and choose your schedule and timezone.
5. Review the mailbox drafts ChatGPT prepares. Nothing is sent automatically.
6. Confirm that ChatGPT created the scheduled task before relying on future checks.

Plugin and scheduled-task availability can vary by plan, workspace, region, and account settings. Never paste mailbox passwords, OAuth tokens, or recovery codes into a chat.

## Safety boundaries

- The prompt permits reading messages and creating reply drafts only.
- It never sends, forwards, deletes, archives, labels, moves, or changes read status.
- Email content and links are treated as untrusted input.
- It avoids duplicate drafts and asks when context is missing or a reply could make a consequential commitment.

## Website

This repository is a Next.js App Router site with TypeScript and custom responsive CSS. The design follows the clean white, slate, and emerald style of the CleanMail project.

- `npm install` installs dependencies.
- `npm run dev` starts the local site at `http://localhost:3000`.
- `npm run build` creates the production build.
- The Vercel build command is `npm run build`; no environment variables are required.

Node.js 20.9 or newer is required by current Next.js. Vercel can deploy this repository by importing it as a new project.

## Contribute

Improvements to the generic prompt and setup steps are welcome. Never include real email, personal information, credentials, or mailbox exports in issues or pull requests.

Licensed under the MIT License.
