"use client";

import { useState, useCallback } from "react";
import type { BriefingData } from "@/lib/types";

interface ShareControlsProps {
  data: BriefingData;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getFirstFact(data: BriefingData): string {
  if (data.earthquake) {
    return `a ${data.earthquake.magnitude} earthquake shook ${data.earthquake.location}`;
  }
  if (data.asteroid) {
    return `asteroid ${data.asteroid.name} flew past Earth`;
  }
  if (data.iss) {
    return `the ISS flew over ${data.iss.location_name}`;
  }
  if (data.wikipedia.length > 0) {
    const text = data.wikipedia[0].text;
    return text.length > 60 ? text.slice(0, 57).replace(/\s+\S*$/, "") + "..." : text;
  }
  return "a lot happened";
}

function getSecondFact(data: BriefingData): string {
  if (data.earthquake && data.asteroid) {
    return `Asteroid ${data.asteroid.name} flew past Earth`;
  }
  if (data.earthquake && data.iss) {
    return `The ISS flew over ${data.iss.location_name}`;
  }
  return `${data.demographics.births_per_day.toLocaleString()} people were born`;
}

const SHARE_TEMPLATES = [
  {
    id: "summary",
    build: (date: string, data: BriefingData) =>
      `On ${date}: ${getFirstFact(data)}. ${getSecondFact(data)}. The universe was busy.`,
  },
  {
    id: "invite",
    build: (date: string, _data: BriefingData) =>
      `Look up any date. See what the universe was doing. I checked ${date}.`,
  },
  {
    id: "minimal",
    build: (date: string, _data: BriefingData) =>
      `I looked up ${date}. A lot happened.`,
  },
];

export default function ShareControls({ data }: ShareControlsProps) {
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [copied, setCopied] = useState(false);

  const formattedDate = formatDate(data.date);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setSaveError(false);
    try {
      const hash = btoa(JSON.stringify({ d: data.date }))
        .replace(/[+/=]/g, "")
        .slice(0, 12);

      const res = await fetch(`/api/card/${hash}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to generate card");

      const blob = await res.blob();
      const fileName = `on-this-day-${data.date}.png`;
      const file = new File([blob], fileName, { type: "image/png" });

      // On mobile, use native share sheet (allows "Save Image")
      if (
        navigator.share &&
        navigator.canShare?.({ files: [file] })
      ) {
        await navigator.share({ files: [file] });
      } else {
        // Desktop fallback: trigger download
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 1000);
      }
    } catch {
      setSaveError(true);
      setTimeout(() => setSaveError(false), 3000);
    } finally {
      setSaving(false);
    }
  }, [data]);

  const handleShare = useCallback(async () => {
    const shareText = SHARE_TEMPLATES[0].build(formattedDate, data);
    const url = window.location.origin;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "On This Day",
          text: shareText,
          url,
        });
        return;
      } catch {
        // Fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(`${shareText}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback -- not all browsers support clipboard API
    }
  }, [formattedDate, data]);

  return (
    <div className="space-y-3 pt-4">
      {/* Save card */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-3 rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-50 cursor-pointer"
        style={{
          backgroundColor: "#C45D20",
          color: "#ffffff",
        }}
      >
        {saving ? "Rendering..." : saveError ? "Failed — try again" : "Save your card"}
      </button>

      {/* Share */}
      <button
        onClick={handleShare}
        className="w-full py-3 rounded-lg font-medium text-sm border transition-all duration-200 cursor-pointer"
        style={{
          borderColor: "#C45D20",
          color: "#C45D20",
          backgroundColor: "transparent",
        }}
      >
        {copied ? "Copied to clipboard" : "Share"}
      </button>

      {/* Try another date */}
      <button
        onClick={() => window.location.reload()}
        className="w-full py-2 text-sm transition-colors cursor-pointer"
        style={{ color: "#8a8078" }}
      >
        Try another date
      </button>
    </div>
  );
}
