"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { BriefingData, DatePrecision } from "@/lib/types";
import Logo from "@/components/Logo";
import DateDrumPicker from "@/components/DateDrumPicker";

interface InputFormProps {
  onBriefingReady: (data: BriefingData) => void;
  onLoadingStart: (label: string, date: string) => void;
}

interface DateValue {
  month: number;
  day: number;
  year: number;
}

function dateValueToString(v: DateValue): string {
  const mm = String(v.month).padStart(2, "0");
  const dd = String(v.day).padStart(2, "0");
  return `${v.year}-${mm}-${dd}`;
}

function validateDateValue(v: DateValue): string | null {
  const date = new Date(v.year, v.month - 1, v.day);
  if (isNaN(date.getTime())) return "Pick a valid date.";
  const now = new Date();
  now.setHours(23, 59, 59, 999);
  if (date > now) return "That date hasn't happened yet.";
  if (v.year < 1950) return "We can only go back to 1950.";
  return null;
}

const LABEL_SUGGESTIONS = [
  "My birthday",
  "Our wedding",
  "First day at work",
  "Graduation",
];

const EXAMPLES: Array<{ date: string; label: string; bullets: string[] }> = [
  {
    date: "July 20, 1969",
    label: "Moon landing day",
    bullets: [
      "Apollo 11 landed on the Sea of Tranquility",
      "A 4.2 earthquake rattled the Philippines",
      "385,000 people took their first breath",
      "The sun set at 8:31 PM in Houston",
    ],
  },
  {
    date: "November 9, 1989",
    label: "The wall came down",
    bullets: [
      "The Berlin Wall fell after 28 years",
      "A 5.0 earthquake shook Papua New Guinea",
      "The ISS wasn\u2019t built yet \u2014 Mir was orbiting",
      "385,000 new lives began that day",
    ],
  },
  {
    date: "February 14, 2005",
    label: "Our anniversary",
    bullets: [
      "YouTube was founded in San Mateo, CA",
      "Asteroid 2005-CR passed at 4.7M miles",
      "The ISS flew over the Atlantic",
      "385,000 people were born worldwide",
    ],
  },
];

function getToday(): DateValue {
  const now = new Date();
  return {
    month: now.getMonth() + 1,
    day: now.getDate(),
    year: now.getFullYear(),
  };
}

export default function InputForm({
  onBriefingReady,
  onLoadingStart,
}: InputFormProps) {
  const [dateValue, setDateValue] = useState<DateValue>(getToday);
  const [label, setLabel] = useState("");
  const [dateError, setDateError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [exampleIndex, setExampleIndex] = useState(0);
  const [exampleOpacity, setExampleOpacity] = useState(1);
  const [labelFocused, setLabelFocused] = useState(false);

  const parsedRef = useRef<{ date: string; precision: DatePrecision } | null>(
    null
  );
  const geoRef = useRef<{ latitude: number; longitude: number } | null>(null);

  // Request geolocation on mount (for sun data)
  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          geoRef.current = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          };
        },
        () => {
          // Permission denied or error — sun section will just not show
          geoRef.current = null;
        },
        { timeout: 5000, maximumAge: 300000 }
      );
    }
  }, []);

  // Cycle examples
  useEffect(() => {
    const interval = setInterval(() => {
      setExampleOpacity(0);
      setTimeout(() => {
        setExampleIndex((i) => (i + 1) % EXAMPLES.length);
        setExampleOpacity(1);
      }, 400);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Validate whenever dateValue changes
  useEffect(() => {
    const error = validateDateValue(dateValue);
    setDateError(error);
    if (error) {
      parsedRef.current = null;
    } else {
      parsedRef.current = {
        date: dateValueToString(dateValue),
        precision: "exact",
      };
    }
  }, [dateValue]);

  const handleDateChange = useCallback((v: DateValue) => {
    setDateValue(v);
    setApiError(null);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!parsedRef.current || loading) return;

      setLoading(true);
      setApiError(null);

      onLoadingStart(label.trim(), parsedRef.current.date);

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: parsedRef.current.date,
            precision: parsedRef.current.precision,
            label: label.trim() || undefined,
            ...(geoRef.current && {
              latitude: geoRef.current.latitude,
              longitude: geoRef.current.longitude,
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            }),
          }),
        });

        if (!res.ok) {
          const err = await res
            .json()
            .catch(() => ({ error: "Request failed" }));
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
    [label, loading, onBriefingReady, onLoadingStart]
  );

  const canSubmit = !dateError && !loading;

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-5 py-10 md:py-16 relative">
      {/* Radial warm glow */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "500px",
          background:
            "radial-gradient(ellipse at center, var(--accent-light) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Floating particles */}
      {[
        { top: "18%", left: "12%", duration: "20s", delay: "0s", size: "2px" },
        { top: "35%", left: "85%", duration: "17s", delay: "3s", size: "3px" },
        { top: "65%", left: "8%", duration: "23s", delay: "7s", size: "2.5px" },
        { top: "50%", left: "90%", duration: "19s", delay: "11s", size: "2px" },
      ].map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            backgroundColor: "var(--accent)",
            opacity: 0.12,
            pointerEvents: "none",
            zIndex: 0,
            animation: `floatParticle${i} ${p.duration} ease-in-out ${p.delay} infinite`,
          }}
        />
      ))}

      <style>{`
        @keyframes floatParticle0 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(15px, -20px); }
          50% { transform: translate(-10px, -35px); }
          75% { transform: translate(20px, -15px); }
        }
        @keyframes floatParticle1 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-20px, 15px); }
          50% { transform: translate(10px, 30px); }
          75% { transform: translate(-15px, 10px); }
        }
        @keyframes floatParticle2 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(25px, 10px); }
          50% { transform: translate(5px, -25px); }
          75% { transform: translate(-20px, 5px); }
        }
        @keyframes floatParticle3 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-10px, -25px); }
          50% { transform: translate(20px, -10px); }
          75% { transform: translate(-5px, 20px); }
        }
        @keyframes ctaPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.01); }
        }
      `}</style>

      <div className="w-full max-w-lg mx-auto" style={{ position: "relative", zIndex: 1 }}>
        {/* Hero logo */}
        <div className="text-center mb-8 md:mb-12">
          <div className="flex justify-center mb-5">
            <Logo size="hero" />
          </div>
          <p
            className="text-lg md:text-xl font-medium leading-relaxed"
            style={{ color: "var(--fg)", maxWidth: "380px", margin: "0 auto" }}
          >
            Enter a date.
            <br />
            See what the world was doing.
          </p>
        </div>

        {/* Example Preview */}
        <div
          className="relative mb-8 rounded-xl border-2 p-5 overflow-hidden"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--bg-surface)",
            borderLeft: "3px solid var(--accent)",
            minHeight: "180px",
          }}
        >
          <div
            style={{
              opacity: exampleOpacity,
              transition: "opacity 400ms ease-in-out",
            }}
          >
            <p
              className="font-mono text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: "var(--accent)" }}
            >
              {EXAMPLES[exampleIndex].date} &middot;{" "}
              {EXAMPLES[exampleIndex].label}
            </p>
            <ul className="space-y-1.5">
              {EXAMPLES[exampleIndex].bullets.map((bullet, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm leading-relaxed"
                  style={{ color: "var(--fg)", opacity: 0.7 }}
                >
                  <span
                    className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: "var(--accent)" }}
                  />
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Date drum picker */}
          <div className="space-y-2">
            <label
              className="block text-sm font-semibold"
              style={{ color: "var(--fg-heading)" }}
            >
              Pick a date
            </label>
            <DateDrumPicker value={dateValue} onChange={handleDateChange} />
            {dateError && (
              <p
                className="text-sm font-medium"
                style={{ color: "var(--accent-warn)" }}
              >
                {dateError}
              </p>
            )}
          </div>

          {/* Label field */}
          <div className="space-y-2">
            <label
              htmlFor="label-input"
              className="block text-sm font-semibold"
              style={{ color: "var(--fg-heading)" }}
            >
              What was this day?{" "}
              <span style={{ color: "var(--fg-muted)", fontWeight: 400 }}>
                (optional)
              </span>
            </label>
            <div
              className="rounded-lg border-2 overflow-hidden transition-all duration-200"
              style={{
                borderColor: label || labelFocused ? "var(--accent)" : "var(--border)",
                backgroundColor: "var(--bg-card)",
                boxShadow: labelFocused
                  ? "0 0 0 3px rgba(196, 93, 32, 0.12)"
                  : "none",
              }}
            >
              <input
                id="label-input"
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                onFocus={() => setLabelFocused(true)}
                onBlur={() => setLabelFocused(false)}
                placeholder="My birthday, our wedding..."
                className="w-full px-4 py-3 text-base bg-transparent focus:outline-none placeholder:text-[var(--fg-muted)] placeholder:opacity-50"
                style={{ color: "var(--fg-heading)" }}
              />
            </div>
            <div className="flex flex-wrap gap-2 pt-1 justify-center">
              {LABEL_SUGGESTIONS.map((suggestion, idx) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setLabel(suggestion)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200${idx >= 3 ? " hidden sm:inline-flex" : ""}`}
                  style={{
                    backgroundColor:
                      label === suggestion
                        ? "var(--accent)"
                        : "var(--bg-surface)",
                    color:
                      label === suggestion ? "#ffffff" : "var(--fg-muted)",
                    border: `1.5px solid ${
                      label === suggestion
                        ? "var(--accent)"
                        : "var(--border)"
                    }`,
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full text-base font-bold uppercase tracking-widest py-4 rounded-xl transition-all duration-300"
              style={{
                backgroundColor: canSubmit
                  ? "var(--accent)"
                  : "var(--bg-surface)",
                color: canSubmit ? "#ffffff" : "var(--fg-muted)",
                border: canSubmit ? "none" : "2px solid var(--border)",
                boxShadow: canSubmit
                  ? "0 4px 20px rgba(184, 101, 20, 0.35)"
                  : "none",
                cursor: canSubmit ? "pointer" : "not-allowed",
                opacity: canSubmit ? 1 : 0.5,
                animation: canSubmit
                  ? "ctaPulse 3s ease-in-out infinite"
                  : "none",
              }}
            >
              {loading ? "Looking up..." : "EXPLORE"}
            </button>
          </div>

          {apiError && (
            <p
              className="text-sm font-medium text-center"
              style={{ color: "var(--accent-warn)" }}
            >
              {apiError}
            </p>
          )}

          <p
            className="text-xs text-center pt-1"
            style={{ color: "var(--fg-muted)", opacity: 0.6 }}
          >
            No account needed. Nothing is stored. This is just yours.
          </p>
        </form>
      </div>
    </div>
  );
}
