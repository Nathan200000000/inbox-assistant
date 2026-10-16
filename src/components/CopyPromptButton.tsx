"use client";

import { useState } from "react";

export function CopyPromptButton({ className = "" }: { className?: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "unavailable">("idle");

  async function copyPrompt() {
    try {
      const response = await fetch("/prompts/inbox-assistant.md");
      if (!response.ok) throw new Error("Prompt unavailable");
      await navigator.clipboard.writeText(await response.text());
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 2400);
    } catch {
      setStatus("unavailable");
    }
  }

  return (
    <span className="copy-control">
      <button className={className} onClick={copyPrompt} type="button">
        {status === "copied" ? "Prompt copied" : "Copy setup prompt"}
        <span aria-hidden="true">{status === "copied" ? "✓" : "↗"}</span>
      </button>
      <span className="copy-status" aria-live="polite">
        {status === "unavailable" ? (
          <a href="https://github.com/Nathan200000000/inbox-assistant/blob/main/prompts/inbox-assistant.md" target="_blank" rel="noreferrer">
            Open the prompt on GitHub
          </a>
        ) : ""}
      </span>
    </span>
  );
}
