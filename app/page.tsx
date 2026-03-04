"use client";

import { useState, useCallback } from "react";
import type { BriefingData } from "@/lib/types";
import InputForm from "@/components/InputForm";
import RevealSequence from "@/components/RevealSequence";
import MissionCard from "@/components/MissionCard";
import ShareControls from "@/components/ShareControls";

type AppPhase = "input" | "reveal" | "card";

export default function Home() {
  const [phase, setPhase] = useState<AppPhase>("input");
  const [briefingData, setBriefingData] = useState<BriefingData | null>(null);
  const [showEntrance, setShowEntrance] = useState(true);

  const handleBriefingReady = useCallback((data: BriefingData) => {
    setBriefingData(data);
    setPhase("reveal");
  }, []);

  const handleRevealComplete = useCallback(() => {
    setPhase("card");
  }, []);

  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center px-4 py-12 md:py-20">
      {/* Input Phase */}
      {phase === "input" && (
        <div
          className={`w-full transition-opacity duration-500 ${
            showEntrance ? "animate-in fade-in slide-in-from-bottom-4 duration-700" : ""
          }`}
          onAnimationEnd={() => setShowEntrance(false)}
        >
          <div className="text-center mb-12 space-y-3">
            <h1 className="font-sans text-3xl md:text-4xl text-fg-heading font-semibold tracking-tight">
              While You Were Deciding
            </h1>
            <p className="font-sans text-base text-fg-muted max-w-md mx-auto">
              Enter a decision that changed everything. We&apos;ll show you what
              the universe was doing at the same time.
            </p>
          </div>
          <InputForm onBriefingReady={handleBriefingReady} />
        </div>
      )}

      {/* Reveal Phase */}
      {phase === "reveal" && briefingData && (
        <div className="w-full animate-in fade-in duration-200">
          <RevealSequence
            data={briefingData}
            onComplete={handleRevealComplete}
          />
        </div>
      )}

      {/* Card Phase */}
      {phase === "card" && briefingData && (
        <div className="w-full animate-in fade-in duration-500 space-y-0">
          <MissionCard data={briefingData} />
          <ShareControls data={briefingData} />
        </div>
      )}
    </main>
  );
}
