"use client";

import { FC, useEffect, useRef, useCallback, useState } from "react";
import type { BriefingData } from "@/lib/types";
import ShareCard from "@/components/ShareCard";
import ShareControls from "@/components/ShareControls";

interface BriefingCardProps {
  isOpen: boolean;
  onClose: () => void;
  data: BriefingData;
}

const CARD_W = 1080;

const BriefingCard: FC<BriefingCardProps> = ({ isOpen, onClose, data }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [scale, setScale] = useState(0.36);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, handleClose]);

  // Lock body scroll + manage focus
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => cardRef.current?.focus());
    } else {
      document.body.style.overflow = "";
      previousFocusRef.current?.focus();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Compute scale from preview container width
  useEffect(() => {
    if (!isOpen || !previewRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        if (w > 0) setScale(w / CARD_W);
      }
    });
    observer.observe(previewRef.current);
    return () => observer.disconnect();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      style={{ backgroundColor: "rgba(42, 37, 32, 0.6)" }}
      onClick={(e) => {
        if (e.target === overlayRef.current) handleClose();
      }}
    >
      <div
        ref={cardRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Share card preview"
        className="relative w-full outline-none overflow-y-auto"
        style={{
          maxWidth: "440px",
          maxHeight: "90dvh",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          boxShadow:
            "0 25px 50px -12px rgba(42, 37, 32, 0.25), 0 0 0 1px rgba(42, 37, 32, 0.05)",
          animation:
            "scaleBlurIn 300ms cubic-bezier(0.34, 1.56, 0.64, 1) both",
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          aria-label="Close preview"
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-200 cursor-pointer"
          style={{
            color: "#8a8078",
            backgroundColor: "rgba(42, 37, 32, 0.05)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(42, 37, 32, 0.1)";
            e.currentTarget.style.color = "#2a2520";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(42, 37, 32, 0.05)";
            e.currentTarget.style.color = "#8a8078";
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>

        {/* Share card preview (scaled to fit modal) */}
        <div className="p-6 pb-2">
          <div
            ref={previewRef}
            style={{
              width: "100%",
              aspectRatio: "9 / 16",
              position: "relative",
              overflow: "hidden",
              borderRadius: "8px",
              border: "1px solid rgba(42, 37, 32, 0.08)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "1080px",
                height: "1920px",
                transformOrigin: "top left",
                transform: `scale(${scale})`,
              }}
            >
              <ShareCard data={data} />
            </div>
          </div>
        </div>

        {/* Share controls */}
        <div className="px-6 pb-6">
          <ShareControls data={data} />
        </div>
      </div>
    </div>
  );
};

export default BriefingCard;
