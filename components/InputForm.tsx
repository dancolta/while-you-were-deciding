"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { BriefingData, DatePrecision } from "@/lib/types";

interface InputFormProps {
  onBriefingReady: (data: BriefingData) => void;
}

function parseFlexibleDate(input: string): {
  date: string;
  precision: DatePrecision;
} | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Try exact date: "March 15, 2024" or "2024-03-15" or "03/15/2024"
  const exactDate = new Date(trimmed);
  if (!isNaN(exactDate.getTime()) && trimmed.length > 7) {
    const yyyy = exactDate.getFullYear();
    const mm = String(exactDate.getMonth() + 1).padStart(2, "0");
    const dd = String(exactDate.getDate()).padStart(2, "0");
    return { date: `${yyyy}-${mm}-${dd}`, precision: "exact" };
  }

  // Try month+year: "June 2019" or "Jun 2019"
  const monthYearMatch = trimmed.match(
    /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[\s,]+(\d{4})$/i
  );
  if (monthYearMatch) {
    const months: Record<string, string> = {
      jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
      jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
    };
    const mm = months[monthYearMatch[1].toLowerCase().slice(0, 3)];
    return { date: `${monthYearMatch[2]}-${mm}-15`, precision: "month" };
  }

  // Try year only: "2019"
  const yearMatch = trimmed.match(/^(\d{4})$/);
  if (yearMatch) {
    return { date: `${yearMatch[1]}-06-15`, precision: "year" };
  }

  return null;
}

function validateDate(dateStr: string): string | null {
  const date = new Date(dateStr);
  const now = new Date();
  if (date > now) return "This decision hasn't happened yet. Come back after.";
  if (date.getFullYear() < 1950)
    return "Our instruments can't reach that far back.";
  return null;
}

const PLACEHOLDERS = [
  "to quit my job",
  "to say yes",
  "to leave",
  "to start over",
  "to tell them the truth",
  "to let go",
];

export default function InputForm({ onBriefingReady }: InputFormProps) {
  const [dateInput, setDateInput] = useState("");
  const [decision, setDecision] = useState("");
  const [reason, setReason] = useState("");
  const [dateError, setDateError] = useState<string | null>(null);
  const [dateValid, setDateValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showDecision, setShowDecision] = useState(false);
  const [showReason, setShowReason] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const parsedRef = useRef<{ date: string; precision: DatePrecision } | null>(
    null
  );
  const prefetchRef = useRef<Promise<BriefingData> | null>(null);
  const prefetchDateRef = useRef<string>("");
  const placeholderRef = useRef(
    PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]
  );

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const handleDateChange = useCallback(
    (value: string) => {
      setDateInput(value);
      setDateError(null);
      setDateValid(false);
      setApiError(null);

      const parsed = parseFlexibleDate(value);
      if (!parsed) {
        parsedRef.current = null;
        if (isMobile) setShowDecision(false);
        return;
      }

      const error = validateDate(parsed.date);
      if (error) {
        setDateError(error);
        parsedRef.current = null;
        if (isMobile) setShowDecision(false);
        return;
      }

      parsedRef.current = parsed;
      setDateValid(true);
      if (isMobile) setShowDecision(true);

      // Pre-fetch data silently
      if (prefetchDateRef.current !== parsed.date) {
        prefetchDateRef.current = parsed.date;
        prefetchRef.current = fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: parsed.date,
            precision: parsed.precision,
            decision: "placeholder",
          }),
        })
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null);
      }
    },
    [isMobile]
  );

  const handleDecisionChange = useCallback(
    (value: string) => {
      if (value.length <= 100) {
        setDecision(value);
        if (isMobile && value.length > 0) setShowReason(true);
      }
    },
    [isMobile]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!parsedRef.current || !decision.trim()) return;

      setLoading(true);
      setApiError(null);

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: parsedRef.current.date,
            precision: parsedRef.current.precision,
            decision: decision.trim(),
            reason: reason.trim() || undefined,
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: "Request failed" }));
          throw new Error(err.error || `Request failed (${res.status})`);
        }

        const data: BriefingData = await res.json();
        onBriefingReady(data);
      } catch (err) {
        setApiError(
          err instanceof Error ? err.message : "Something went wrong"
        );
        setLoading(false);
      }
    },
    [decision, reason, onBriefingReady]
  );

  const canSubmit = dateValid && decision.trim().length > 0 && !loading;

  const decisionCharColor =
    decision.length >= 95
      ? "text-accent-warn"
      : decision.length >= 80
        ? "text-accent-amber"
        : "text-fg-muted";

  const reasonCharColor =
    reason.length >= 130
      ? "text-accent-warn"
      : reason.length >= 112
        ? "text-accent-amber"
        : "text-fg-muted";

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto space-y-6">
      {/* Date field */}
      <div className="space-y-2">
        <label className="block font-mono text-xs uppercase tracking-widest text-fg-muted">
          When it happened
        </label>
        <input
          type="text"
          value={dateInput}
          onChange={(e) => handleDateChange(e.target.value)}
          placeholder="March 15, 2024"
          className="w-full bg-transparent border border-border rounded-none px-4 py-3 font-mono text-fg-heading text-lg focus:outline-none focus:border-accent transition-colors placeholder:text-fg-muted/40"
          autoFocus
        />
        {dateError && (
          <p className="font-mono text-xs text-accent-warn">{dateError}</p>
        )}
        {dateValid && !dateError && (
          <p className="font-mono text-xs text-accent">Date locked in.</p>
        )}
      </div>

      {/* Decision field — always on desktop, progressive on mobile */}
      {(!isMobile || showDecision) && (
        <div
          className="space-y-2 animate-in fade-in duration-300"
          style={{ animationFillMode: "both" }}
        >
          <label className="block font-mono text-xs uppercase tracking-widest text-fg-muted">
            The decision
          </label>
          <input
            type="text"
            value={decision}
            onChange={(e) => handleDecisionChange(e.target.value)}
            placeholder={placeholderRef.current}
            maxLength={100}
            className="w-full bg-transparent border border-border rounded-none px-4 py-3 font-sans text-fg-heading text-lg focus:outline-none focus:border-accent transition-colors placeholder:text-fg-muted/40"
          />
          <p className={`font-mono text-xs text-right ${decisionCharColor}`}>
            {decision.length}/100
          </p>
        </div>
      )}

      {/* Reason field — always on desktop, progressive on mobile */}
      {(!isMobile || showReason) && (
        <div
          className="space-y-2 animate-in fade-in duration-300"
          style={{ animationFillMode: "both" }}
        >
          <label className="block font-mono text-xs uppercase tracking-widest text-fg-muted">
            Why it felt enormous{" "}
            <span className="text-fg-muted/60 normal-case tracking-normal">
              (optional)
            </span>
          </label>
          <textarea
            value={reason}
            onChange={(e) =>
              e.target.value.length <= 140 && setReason(e.target.value)
            }
            placeholder="One word is enough"
            maxLength={140}
            rows={2}
            className="w-full bg-transparent border border-border rounded-none px-4 py-3 font-sans text-fg resize-none focus:outline-none focus:border-accent transition-colors placeholder:text-fg-muted/40"
          />
          <div className="flex justify-between items-center">
            <p className="font-mono text-[10px] text-fg-muted/50">
              This stays between you and the cosmos.
            </p>
            <p className={`font-mono text-xs ${reasonCharColor}`}>
              {reason.length}/140
            </p>
          </div>
        </div>
      )}

      {/* Submit */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={!canSubmit}
          className={`w-full font-mono text-sm uppercase tracking-[0.3em] py-4 border transition-all duration-300 ${
            canSubmit
              ? "border-accent text-accent hover:bg-accent/10 cursor-pointer"
              : "border-border text-fg-muted/40 cursor-not-allowed"
          } ${loading ? "animate-pulse" : ""}`}
        >
          {loading ? "Decrypting..." : "Declassify"}
        </button>
      </div>

      {apiError && (
        <p className="font-mono text-xs text-accent-warn text-center">
          {apiError}
        </p>
      )}

      <p className="font-mono text-[10px] text-fg-muted/40 text-center">
        No account needed. Nothing is stored. This is just yours.
      </p>
    </form>
  );
}
