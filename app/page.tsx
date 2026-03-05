"use client";

import { useState, useCallback, useEffect } from "react";
import type { BriefingData } from "@/lib/types";
import SplashScreen from "@/components/SplashScreen";
import InputForm from "@/components/InputForm";
import LoadingTransition from "@/components/LoadingTransition";
import ResultsPage from "@/components/ResultsPage";
import BriefingCard from "@/components/BriefingCard";

type AppPhase = "splash" | "input" | "loading" | "results";

export default function Home() {
  const [phase, setPhase] = useState<AppPhase>("splash");
  const [briefingData, setBriefingData] = useState<BriefingData | null>(null);
  const [loadingInfo, setLoadingInfo] = useState({ label: "", date: "" });
  const [minTimeReached, setMinTimeReached] = useState(false);
  const [dataReady, setDataReady] = useState(false);
  const [showCard, setShowCard] = useState(false);

  const handleLoadingStart = useCallback((label: string, date: string) => {
    setLoadingInfo({ label, date });
    setPhase("loading");
    setMinTimeReached(false);
    setDataReady(false);
  }, []);

  const handleBriefingReady = useCallback((data: BriefingData) => {
    setBriefingData(data);
    setDataReady(true);
  }, []);

  const handleMinTimeReached = useCallback(() => {
    setMinTimeReached(true);
  }, []);

  // Transition to results when both conditions met
  useEffect(() => {
    if (minTimeReached && dataReady && briefingData) {
      setPhase("results");
    }
  }, [minTimeReached, dataReady, briefingData]);

  const handleSplashDone = useCallback(() => {
    setPhase("input");
  }, []);

  return (
    <>
      {phase === "splash" && <SplashScreen onDone={handleSplashDone} />}

      {phase === "input" && (
        <InputForm
          onBriefingReady={handleBriefingReady}
          onLoadingStart={handleLoadingStart}
        />
      )}

      {phase === "loading" && (
        <LoadingTransition
          date={loadingInfo.date}
          onReady={handleMinTimeReached}
        />
      )}

      {phase === "results" && briefingData && (
        <>
          <ResultsPage
            data={briefingData}
            onShare={() => setShowCard(true)}
          />

          {showCard && (
            <BriefingCard
              isOpen={showCard}
              onClose={() => setShowCard(false)}
              data={briefingData}
            />
          )}
        </>
      )}
    </>
  );
}
