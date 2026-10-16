"use client";

import { useState } from "react";

export function CopyPromptButton({ className = "" }: { className?: string }) {
  const [copied, setCopied] = useState(false);

  async function copyPrompt() {
    try {
      const response = await fetch("/prompts/inbox-assistant.md");
      if (!response.ok) throw new Error("Prompt unavailable");
      await navigator.clipboard.writeText(await response.text());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      window.open(
        "https://github.com/Nathan200000000/inbox-assistant/blob/main/prompts/inbox-assistant.md",
        "_blank",
        "noopener,noreferrer",
      );
    }
  }

  return (
    <button className={className} onClick={copyPrompt} type="button">
      {copied ? "Prompt copied" : "Copy setup prompt"}
      <span aria-hidden="true">{copied ? "✓" : "↗"}</span>
    </button>
  );
}
