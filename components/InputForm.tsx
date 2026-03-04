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
  if (!trimmed || trimmed.toLowerCase() === "right now") return null;

  const exactDate = new Date(trimmed);
  if (!isNaN(exactDate.getTime()) && trimmed.length > 7) {
    const yyyy = exactDate.getFullYear();
    const mm = String(exactDate.getMonth() + 1).padStart(2, "0");
    const dd = String(exactDate.getDate()).padStart(2, "0");
    return { date: `${yyyy}-${mm}-${dd}`, precision: "exact" };
  }

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

  const yearMatch = trimmed.match(/^(\d{4})$/);
  if (yearMatch) {
    return { date: `${yearMatch[1]}-06-15`, precision: "year" };
  }

  return null;
}

function validateDate(dateStr: string): string | null {
  const date = new Date(dateStr + "T12:00:00");
  const now = new Date();
  if (date > now) return "This decision hasn't happened yet. Come back after.";
  if (date.getFullYear() < 1950)
    return "Our instruments can't reach that far back.";
  return null;
}

const PLACEHOLDERS = [
  "to walk away from everything I built",
  "to choose myself for once",
  "to say the thing I'd been holding back",
  "to stop pretending it didn't matter",
  "to let go of the version they needed",
  "to trust my gut over their advice",
  "to close the door I kept leaving open",
  "to bet everything on the idea",
  "to forgive them",
  "to start over at 35",
];

const LOADING_STAGES = [
  "Accessing records...",
  "Cross-referencing orbital data...",
  "Decrypting briefing...",
];

export default function InputForm({ onBriefingReady }: InputFormProps) {
  const [dateInput, setDateInput] = useState("");
  const [decision, setDecision] = useState("");
  const [reason, setReason] = useState("");
  const [dateError, setDateError] = useState<string | null>(null);
  const [dateValid, setDateValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [apiError, setApiError] = useState<string | null>(null);
  const [step, setStep] = useState(1); // 1=date, 2=decision, 3=reason
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [placeholderOpacity, setPlaceholderOpacity] = useState(1);

  const parsedRef = useRef<{ date: string; precision: DatePrecision } | null>(null);

  // Cycle decision placeholders
  useEffect(() => {
    if (decision.length > 0) return;
    const interval = setInterval(() => {
      setPlaceholderOpacity(0);
      setTimeout(() => {
        setPlaceholderIndex((i) => (i + 1) % PLACEHOLDERS.length);
        setPlaceholderOpacity(1);
      }, 350);
    }, 2800);
    return () => clearInterval(interval);
  }, [decision]);

  // Loading stage progression
  useEffect(() => {
    if (!loading) { setLoadingStage(0); return; }
    const t1 = setTimeout(() => setLoadingStage(1), 1500);
    const t2 = setTimeout(() => setLoadingStage(2), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [loading]);

  const handleDateChange = useCallback((value: string) => {
    setDateInput(value);
    setDateError(null);
    setDateValid(false);
    setApiError(null);

    const parsed = parseFlexibleDate(value);
    if (!parsed) {
      parsedRef.current = null;
      return;
    }

    const error = validateDate(parsed.date);
    if (error) {
      setDateError(error);
      parsedRef.current = null;
      return;
    }

    parsedRef.current = parsed;
    setDateValid(true);
    setStep(2);
  }, []);

  const handleRightNow = useCallback(() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    setDateInput("right now");
    parsedRef.current = { date: `${yyyy}-${mm}-${dd}`, precision: "exact" };
    setDateValid(true);
    setDateError(null);
    setStep(2);
  }, []);

  const handleDecisionChange = useCallback((value: string) => {
    if (value.length <= 100) {
      setDecision(value);
      if (value.length > 0 && step < 3) setStep(3);
    }
  }, [step]);

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

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Header */}
      <div className="text-left mb-12 md:mb-16 space-y-4">
        <p className="font-mono text-[10px] text-fg-muted/40 uppercase tracking-[0.4em]">
          File accessed //{" "}
          {new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <h1 className="font-mono text-3xl md:text-5xl text-fg-heading font-bold tracking-tight leading-[0.95]">
          While You Were
          <br />
          <span className="text-accent">Deciding</span>
        </h1>
        <p className="font-sans text-sm text-fg-muted max-w-sm leading-relaxed">
          You made a decision that changed your life.
          <br />
          The universe didn&apos;t pause. Here&apos;s what it was doing.
        </p>
        <div className="w-12 h-px bg-accent/30" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date field */}
        <div className="space-y-2">
          <label className="block font-mono text-[10px] uppercase tracking-[0.3em] text-fg-muted/50">
            Date of decision
          </label>
          <div className="flex items-center gap-2">
            <span className="font-mono text-accent/60 text-lg select-none shrink-0">&gt;</span>
            <input
              type="text"
              value={dateInput}
              onChange={(e) => handleDateChange(e.target.value)}
              placeholder="March 15, 2024"
              className={`w-full bg-transparent border-0 border-b px-0 py-2 font-mono text-fg-heading text-lg focus:outline-none transition-colors placeholder:text-fg-muted/20 ${
                dateValid ? "border-accent/40" : "border-border"
              }`}
              autoFocus
            />
          </div>
          <div className="flex items-center justify-between">
            {dateError && (
              <p className="font-mono text-[10px] text-accent-warn">{dateError}</p>
            )}
            {dateValid && !dateError && (
              <p className="font-mono text-[10px] text-accent/70">Locked in.</p>
            )}
            {!dateValid && !dateError && (
              <button
                type="button"
                onClick={handleRightNow}
                className="font-mono text-[10px] text-accent/40 hover:text-accent/70 transition-colors tracking-wide"
              >
                [ I&apos;m deciding right now ]
              </button>
            )}
          </div>
        </div>

        {/* Divider */}
        {step >= 2 && (
          <div className="overflow-hidden h-px">
            <div
              className="h-px bg-accent/15"
              style={{ animation: "draw-line 0.6s ease-out forwards" }}
            />
          </div>
        )}

        {/* Decision field */}
        {step >= 2 && (
          <div className="space-y-2 animate-slide-up" style={{ animationDuration: "0.4s" }}>
            <label className="block font-mono text-[10px] uppercase tracking-[0.3em] text-fg-muted/50">
              I decided...
            </label>
            <div className="flex items-center gap-2">
              <span className="font-mono text-accent/60 text-lg select-none shrink-0">&gt;</span>
              <div className="relative flex-1">
                <input
                  type="text"
                  value={decision}
                  onChange={(e) => handleDecisionChange(e.target.value)}
                  maxLength={100}
                  className="relative z-10 w-full bg-transparent border-0 border-b border-border px-0 py-2 font-sans text-fg-heading text-lg focus:outline-none focus:border-accent/40 transition-colors"
                />
                {decision.length === 0 && (
                  <span
                    className="absolute left-0 top-2 font-sans text-lg text-fg-muted/20 pointer-events-none transition-opacity duration-300"
                    style={{ opacity: placeholderOpacity }}
                  >
                    {PLACEHOLDERS[placeholderIndex]}
                  </span>
                )}
              </div>
            </div>
            <p
              className={`font-mono text-[10px] text-right ${
                decision.length >= 95
                  ? "text-accent-warn"
                  : decision.length >= 80
                    ? "text-accent-amber"
                    : "text-fg-muted/30"
              }`}
            >
              {decision.length}/100
            </p>
          </div>
        )}

        {/* Divider */}
        {step >= 3 && (
          <div className="overflow-hidden h-px">
            <div
              className="h-px bg-accent/10"
              style={{ animation: "draw-line 0.6s ease-out forwards" }}
            />
          </div>
        )}

        {/* Reason field */}
        {step >= 3 && (
          <div className="space-y-2 animate-slide-up" style={{ animationDuration: "0.4s" }}>
            <label className="block font-mono text-[10px] uppercase tracking-[0.3em] text-fg-muted/50">
              And it mattered because
              <span className="text-fg-muted/20 normal-case tracking-normal ml-1">
                (optional)
              </span>
            </label>
            <div className="flex items-start gap-2">
              <span className="font-mono text-accent/40 text-lg select-none shrink-0 pt-2">&gt;</span>
              <textarea
                value={reason}
                onChange={(e) =>
                  e.target.value.length <= 140 && setReason(e.target.value)
                }
                placeholder="One word is enough"
                maxLength={140}
                rows={2}
                className="w-full bg-transparent border-0 border-b border-border px-0 py-2 font-sans text-fg resize-none focus:outline-none focus:border-accent/30 transition-colors placeholder:text-fg-muted/15"
              />
            </div>
            <div className="flex justify-between items-center">
              <p className="font-mono text-[9px] text-fg-muted/25">
                This stays between you and the cosmos.
              </p>
              <p
                className={`font-mono text-[10px] ${
                  reason.length >= 130 ? "text-accent-warn" : "text-fg-muted/25"
                }`}
              >
                {reason.length}/140
              </p>
            </div>
          </div>
        )}

        {/* Submit */}
        {step >= 2 && (
          <div className="pt-4">
            <button
              type="submit"
              disabled={!canSubmit}
              className={`w-full font-mono text-xs uppercase tracking-[0.25em] md:tracking-[0.4em] py-4 border transition-all duration-300 ${
                canSubmit
                  ? "bg-accent/8 border-accent text-accent hover:bg-accent/15 cursor-pointer"
                  : "border-border/50 text-fg-muted/20 cursor-not-allowed"
              }`}
              style={loading ? { animation: "border-sweep 2s ease-in-out infinite" } : undefined}
            >
              {loading ? `[ ${LOADING_STAGES[loadingStage]} ]` : "[ Declassify ]"}
            </button>
          </div>
        )}

        {apiError && (
          <p className="font-mono text-xs text-accent-warn text-center pt-2">
            {apiError}
          </p>
        )}

        <p className="font-mono text-[9px] text-fg-muted/25 text-center pt-2">
          No account needed. Nothing is stored. This is just yours.
        </p>
      </form>
    </div>
  );
}
