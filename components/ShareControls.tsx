"use client";

import { useState, useCallback } from "react";
import type { BriefingData } from "@/lib/types";

interface ShareControlsProps {
  data: BriefingData;
}

const SHARE_TEXTS = [
  { label: "The Minimalist", template: "{date}: The day I {decision}. Here is what else happened." },
  { label: "The Challenge", template: "Look up the day you made your biggest decision. I dare you. The briefing is... a lot." },
  { label: "The Poet", template: "The universe was busy. I decided anyway. That's the whole story." },
  { label: "The Data Point", template: "On the day I {decision}, {earthquakeCount} earthquakes happened and an asteroid passed by. I had other things on my mind." },
  { label: "The Mystery", template: "I got my briefing. It was... a lot." },
];

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function ShareControls({ data }: ShareControlsProps) {
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [editedDecision, setEditedDecision] = useState(data.decision);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      // Generate a hash for the card
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
      // Fallback: try Web Share API on mobile
      if (navigator.share) {
        try {
          await navigator.share({
            title: "While You Were Deciding",
            text: `${formatDate(data.date)}: The day I ${data.decision}. Here is what else happened.`,
            url: window.location.origin,
          });
        } catch {
          // User cancelled share
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
    <div className="w-full max-w-lg mx-auto space-y-4 pt-6">
      {/* Primary: Save */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full font-mono text-sm uppercase tracking-[0.2em] py-3 border border-accent text-accent hover:bg-accent/10 transition-colors disabled:opacity-50"
      >
        {saving ? "Rendering briefing..." : "Save briefing"}
      </button>

      {/* Secondary: Share */}
      <button
        onClick={() => setShowShareOptions(!showShareOptions)}
        className="w-full font-mono text-xs uppercase tracking-[0.2em] py-2.5 border border-border text-fg-muted hover:border-fg-muted/40 transition-colors"
      >
        {showShareOptions ? "Close" : "Share"}
      </button>

      {showShareOptions && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Edit decision for sharing */}
          <div className="space-y-2">
            <label className="font-mono text-[10px] text-fg-muted uppercase tracking-widest">
              Edit for sharing (your original stays private)
            </label>
            <input
              type="text"
              value={editedDecision}
              onChange={(e) => e.target.value.length <= 100 && setEditedDecision(e.target.value)}
              className="w-full bg-transparent border border-border px-3 py-2 font-sans text-sm text-fg-heading focus:outline-none focus:border-accent"
            />
          </div>

          {/* Share text options */}
          <div className="space-y-2">
            <p className="font-mono text-[10px] text-fg-muted uppercase tracking-widest">
              Pick your share text
            </p>
            {SHARE_TEXTS.map((opt) => {
              const text = opt.template
                .replace("{date}", formattedDate)
                .replace("{decision}", editedDecision)
                .replace("{earthquakeCount}", data.earthquake ? `${Math.floor(data.earthquake.magnitude * 3)}` : "several");

              return (
                <button
                  key={opt.label}
                  onClick={() => handleCopyLink(text)}
                  className="w-full text-left p-3 border border-border hover:border-fg-muted/30 transition-colors group"
                >
                  <p className="font-mono text-[10px] text-fg-muted/60 uppercase tracking-wider mb-1">
                    {opt.label}
                  </p>
                  <p className="font-sans text-sm text-fg group-hover:text-fg-heading transition-colors">
                    {text}
                  </p>
                </button>
              );
            })}
          </div>

          {copied && (
            <p className="font-mono text-xs text-accent text-center animate-in fade-in">
              Copied to clipboard.
            </p>
          )}
        </div>
      )}

      {/* New briefing */}
      <button
        onClick={() => window.location.reload()}
        className="w-full font-mono text-[10px] uppercase tracking-[0.2em] py-2 text-fg-muted/40 hover:text-fg-muted transition-colors"
      >
        Generate another briefing
      </button>
    </div>
  );
}
