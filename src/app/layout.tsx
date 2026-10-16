import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Inbox Assistant — thoughtful replies, on your time",
  description:
    "A free, reusable ChatGPT Work setup that finds emails needing a reply and prepares drafts for your review.",
  openGraph: {
    title: "Inbox Assistant",
    description: "A calmer way to handle email, with every reply held for your approval.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
