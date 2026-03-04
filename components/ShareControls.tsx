"use client";

import { useState, useCallback } from "react";
import type { BriefingData } from "@/lib/types";

interface ShareControlsProps {
  data: BriefingData;
}

const SHARE_TEXTS = [
  {
    label: "The Minimalist",
    template:
      "{date}: The day I {decision}. Here is what else happened.",
  },
  {
    label: "The Challenge",
    template:
      "Look up the day you made your biggest decision. I dare you. The briefing is... a lot.",
  },
  {
    label: "The Poet",
    template:
      "The universe was busy. I decided anyway. That's the whole story.",
  },
  {
    label: "The Mystery",
    template: "I got my briefing. It was... a lot.",
  },
];

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ShareControls({ data }: ShareControlsProps) {
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [editedDecision, setEditedDecision] = useState(data.decision);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const hash = btoa(JSON.stringify({ d: data.date, t: data.decision }))
        .replace(/[+/=]/g, "")
        .slice(0, 12);

      const res = await fetch(`/api/card/${hash}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to generate card");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `briefing-${data.date}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      if (navigator.share) {
        try {
          await navigator.share({
            title: "While You Were Deciding",
            text: `${formatDate(data.date)}: The day I ${data.decision}. Here is what else happened.`,
            url: window.location.origin,
          });
        } catch {
          // User cancelled
        }
      }
    } finally {
      setSaving(false);
    }
  }, [data]);

  const handleCopyLink = useCallback(async (shareText: string) => {
    const url = window.location.origin;
    const fullText = `${shareText}\n${url}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "While You Were Deciding",
          text: shareText,
          url,
        });
        return;
      } catch {
        // Fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  }, []);

  const formattedDate = formatDate(data.date);

  return (
    <div className="w-full max-w-xl mx-auto pt-6 pb-safe">
      {/* Action buttons - fixed on mobile */}
      <div className="space-y-3">
        {/* Save */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full font-mono text-xs uppercase tracking-[0.25em] py-4 border border-accent text-accent hover:bg-accent/10 transition-all duration-300 disabled:opacity-50"
          style={saving ? { animation: "border-sweep 2s ease-in-out infinite" } : undefined}
        >
          {saving ? "[ Rendering briefing... ]" : "[ Save briefing ]"}
        </button>

        {/* Share toggle */}
        <button
          onClick={() => setShowShareOptions(!showShareOptions)}
          className="w-full font-mono text-xs uppercase tracking-[0.25em] py-3 border border-border text-fg-muted/50 hover:border-fg-muted/30 hover:text-fg-muted transition-colors"
        >
          {showShareOptions ? "[ Close ]" : "[ Share ]"}
        </button>
      </div>

      {showShareOptions && (
        <div className="space-y-4 mt-4 animate-slide-up" style={{ animationDuration: "0.3s" }}>
          {/* Edit decision for sharing */}
          <div className="space-y-2">
            <label className="font-mono text-[10px] text-fg-muted/40 uppercase tracking-[0.3em]">
              Edit for sharing (your original stays private)
            </label>
            <div className="flex items-center gap-2">
              <span className="font-mono text-accent/40 text-lg select-none shrink-0">&gt;</span>
              <input
                type="text"
                value={editedDecision}
                onChange={(e) =>
                  e.target.value.length <= 100 &&
                  setEditedDecision(e.target.value)
                }
                className="w-full bg-transparent border-0 border-b border-border px-0 py-2 font-sans text-sm text-fg-heading focus:outline-none focus:border-accent/40 transition-colors"
              />
            </div>
          </div>

          {/* Share text options */}
          <div className="space-y-2">
            <p className="font-mono text-[10px] text-fg-muted/40 uppercase tracking-[0.3em]">
              Pick your share text
            </p>
            {SHARE_TEXTS.map((opt) => {
              const text = opt.template
                .replace("{date}", formattedDate)
                .replace("{decision}", editedDecision);

              return (
                <button
                  key={opt.label}
                  onClick={() => handleCopyLink(text)}
                  className="w-full text-left p-3 border border-border/50 hover:border-accent/20 transition-colors group"
                >
                  <p className="font-mono text-[9px] text-fg-muted/30 uppercase tracking-[0.2em] mb-1">
                    {opt.label}
                  </p>
                  <p className="font-sans text-sm text-fg/70 group-hover:text-fg-heading transition-colors leading-relaxed">
                    {text}
                  </p>
                </button>
              );
            })}
          </div>

          {copied && (
            <p className="font-mono text-xs text-accent text-center animate-fade-in">
              Copied to clipboard.
            </p>
          )}
        </div>
      )}

      {/* New briefing */}
      <button
        onClick={() => window.location.reload()}
        className="w-full font-mono text-[10px] uppercase tracking-[0.3em] py-4 mt-4 text-fg-muted/25 hover:text-fg-muted/50 transition-colors"
      >
        Generate another briefing
      </button>

      <p className="font-mono text-[9px] text-fg-muted/15 text-center pt-2">
        No account needed. Nothing is stored. This is just yours.
      </p>
    </div>
  );
}
