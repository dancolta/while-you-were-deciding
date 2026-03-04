"use client";

import { useState, useCallback } from "react";
import type { BriefingData } from "@/lib/types";
import Entrance from "@/components/Entrance";
import InputForm from "@/components/InputForm";
import RevealSequence from "@/components/RevealSequence";
import MissionCard from "@/components/MissionCard";
import ShareControls from "@/components/ShareControls";

type AppPhase = "entrance" | "input" | "reveal" | "card";

export default function Home() {
  const [phase, setPhase] = useState<AppPhase>("entrance");
  const [briefingData, setBriefingData] = useState<BriefingData | null>(null);

  const handleEntranceComplete = useCallback(() => {
    setPhase("input");
  }, []);

  const handleBriefingReady = useCallback((data: BriefingData) => {
    setBriefingData(data);
    setPhase("reveal");
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const handleRevealComplete = useCallback(() => {
    setPhase("card");
  }, []);

  return (
    <>
      {/* Entrance */}
      {phase === "entrance" && (
        <Entrance onComplete={handleEntranceComplete} />
      )}

      {/* Main content */}
      {phase !== "entrance" && (
        <main className="min-h-[100dvh] flex flex-col items-center justify-center px-5 py-12 md:py-20 grid-texture relative">
          {/* Input Phase */}
          {phase === "input" && (
            <div className="w-full animate-fade-in">
              <InputForm onBriefingReady={handleBriefingReady} />
            </div>
          )}

          {/* Reveal Phase */}
          {phase === "reveal" && briefingData && (
            <div className="w-full animate-fade-in">
              <RevealSequence
                data={briefingData}
                onComplete={handleRevealComplete}
              />
            </div>
          )}

          {/* Card Phase */}
          {phase === "card" && briefingData && (
            <div className="w-full animate-fade-in space-y-0">
              <MissionCard data={briefingData} />
              <ShareControls data={briefingData} />
            </div>
          )}
        </main>
      )}
    </>
  );
}
