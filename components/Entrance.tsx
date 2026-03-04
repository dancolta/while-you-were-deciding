"use client";

import { useState, useEffect, useRef } from "react";

interface EntranceProps {
  onComplete: () => void;
}

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*";
const TITLE = "WHILE YOU WERE DECIDING";

function useDecryptText(text: string, active: boolean) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!active) return;

    const chars = text.split("");
    const resolved = new Array(chars.length).fill(false);
    const current = new Array(chars.length).fill(" ");

    // Pre-resolve spaces
    chars.forEach((c, i) => {
      if (c === " ") {
        resolved[i] = true;
        current[i] = " ";
      }
    });

    const interval = setInterval(() => {
      const firstUnresolved = resolved.indexOf(false);
      if (firstUnresolved === -1) {
        clearInterval(interval);
        return;
      }

      if (Math.random() < 0.35) {
        resolved[firstUnresolved] = true;
        current[firstUnresolved] = chars[firstUnresolved];
      }

      for (let i = 0; i < chars.length; i++) {
        if (!resolved[i]) {
          current[i] = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
      }

      setDisplayed(current.join(""));
    }, 45);

    return () => clearInterval(interval);
  }, [text, active]);

  return displayed;
}

export default function Entrance({ onComplete }: EntranceProps) {
  const [phase, setPhase] = useState(0);
  const [scanlineY, setScanlineY] = useState(0);
  const [coordLines, setCoordLines] = useState<string[]>([]);
  const skipRef = useRef(false);

  const titleText = useDecryptText(TITLE, phase >= 3);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onComplete();
      return;
    }

    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 700),
      setTimeout(() => setPhase(3), 1100),
      setTimeout(() => setPhase(4), 2200),
      setTimeout(() => {
        if (!skipRef.current) onComplete();
      }, 3000),
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  // Scanline sweep
  useEffect(() => {
    if (phase < 1) return;
    let y = 0;
    const interval = setInterval(() => {
      y += 2.5;
      setScanlineY(y);
      if (y > 110) clearInterval(interval);
    }, 12);
    return () => clearInterval(interval);
  }, [phase]);

  // Coordinate ticker
  useEffect(() => {
    if (phase < 2) return;
    const lines = [
      "41.8781°N  87.6298°W",
      "FREQ 14.221 GHz",
      "ACQ ██████░░░░ 62%",
      "SIGNAL LOCKED",
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < lines.length) {
        setCoordLines((prev) => [...prev, lines[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 250);
    return () => clearInterval(interval);
  }, [phase]);

  const handleSkip = () => {
    if (skipRef.current) return;
    skipRef.current = true;
    onComplete();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#050810] flex items-center justify-center overflow-hidden cursor-pointer"
      onClick={handleSkip}
    >
      {/* Scanline sweep */}
      {phase >= 1 && scanlineY <= 110 && (
        <div
          className="absolute left-0 right-0 h-px pointer-events-none"
          style={{
            top: `${scanlineY}%`,
            background:
              "linear-gradient(90deg, transparent, rgba(78, 204, 163, 0.12), transparent)",
            boxShadow: "0 0 30px rgba(78, 204, 163, 0.06)",
          }}
        />
      )}

      {/* Coordinates - top left */}
      {phase >= 2 && (
        <div className="absolute top-6 left-6 font-mono text-[10px] text-accent/25 leading-relaxed">
          {coordLines.map((line, i) => (
            <div key={i} className="animate-fade-in">
              {line}
            </div>
          ))}
        </div>
      )}

      {/* Center content */}
      <div className="text-center z-10 px-6">
        {phase >= 3 && (
          <h1
            className="font-mono text-base md:text-xl tracking-[0.35em] text-fg-heading/80 mb-6"
            style={{ minHeight: "1.5em" }}
          >
            {titleText}
          </h1>
        )}

        {phase >= 4 && (
          <p className="font-sans text-sm text-fg-muted/50 animate-fade-in max-w-xs mx-auto leading-relaxed">
            You made a decision that changed everything.
            <br />
            The universe didn&apos;t pause.
          </p>
        )}
      </div>

      {/* Skip hint */}
      {phase >= 2 && (
        <p className="absolute bottom-8 font-mono text-[9px] text-fg-muted/20 tracking-widest uppercase animate-fade-in">
          tap to skip
        </p>
      )}
    </div>
  );
}
