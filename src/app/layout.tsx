import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Inbox Assistant — thoughtful replies, on your time",
  description:
    "A portfolio-ready email dashboard with a sample inbox and Microsoft Outlook reply drafts for your review.",
  openGraph: {
    title: "Inbox Assistant",
    description: "Explore the inbox demo or connect Outlook to save reply drafts. Nothing is sent automatically.",
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
