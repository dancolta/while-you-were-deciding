"use client";

import { useRef, useEffect, useCallback } from "react";

interface DateValue {
  month: number;
  day: number;
  year: number;
}

interface DateDrumPickerProps {
  value: DateValue;
  onChange: (value: DateValue) => void;
}

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 5;
const COLUMN_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}

function DrumColumn({
  items,
  selectedIndex,
  onSelect,
  width,
}: {
  items: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  width: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const suppressScrollRef = useRef(false);

  // Drag state
  const dragRef = useRef({
    active: false,
    startY: 0,
    startScroll: 0,
    moved: false,
  });

  // Scroll to selected index on mount and when selectedIndex changes externally
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    suppressScrollRef.current = true;
    el.scrollTo({
      top: selectedIndex * ITEM_HEIGHT,
      behavior: "smooth",
    });
    const timer = setTimeout(() => {
      suppressScrollRef.current = false;
    }, 300);
    return () => clearTimeout(timer);
  }, [selectedIndex, items.length]);

  const handleScroll = useCallback(() => {
    if (suppressScrollRef.current) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const el = scrollRef.current;
      if (!el) return;
      const index = Math.round(el.scrollTop / ITEM_HEIGHT);
      const clamped = Math.max(0, Math.min(index, items.length - 1));
      if (clamped !== selectedIndex) {
        onSelect(clamped);
      }
    }, 80);
  }, [items.length, selectedIndex, onSelect]);

  // Pointer drag handlers
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    dragRef.current = {
      active: true,
      startY: e.clientY,
      startScroll: el.scrollTop,
      moved: false,
    };
    el.style.scrollSnapType = "none";
    el.style.scrollBehavior = "auto";
    el.setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag.active) return;
    const delta = drag.startY - e.clientY;
    if (Math.abs(delta) > 3) drag.moved = true;
    const el = scrollRef.current;
    if (el) el.scrollTop = drag.startScroll + delta;
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag.active) return;
    drag.active = false;
    const el = scrollRef.current;
    if (!el) return;
    // Snap to nearest item
    const index = Math.round(el.scrollTop / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(index, items.length - 1));
    el.style.scrollSnapType = "y mandatory";
    el.style.scrollBehavior = "smooth";
    el.scrollTo({ top: clamped * ITEM_HEIGHT, behavior: "smooth" });
    if (clamped !== selectedIndex) {
      onSelect(clamped);
    }
    // Release capture
    el.releasePointerCapture(e.pointerId);
  }, [items.length, selectedIndex, onSelect]);

  const handleItemClick = useCallback(
    (i: number) => {
      // Don't fire click if we were dragging
      if (dragRef.current.moved) return;
      onSelect(i);
    },
    [onSelect]
  );

  const padCount = Math.floor(VISIBLE_ITEMS / 2);

  return (
    <div
      style={{
        width,
        height: `${COLUMN_HEIGHT}px`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Gradient fade top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: `${ITEM_HEIGHT * 2}px`,
          background:
            "linear-gradient(to bottom, var(--bg-surface) 0%, transparent 100%)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
      {/* Gradient fade bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: `${ITEM_HEIGHT * 2}px`,
          background:
            "linear-gradient(to top, var(--bg-surface) 0%, transparent 100%)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
      {/* Accent highlight bar */}
      <div
        style={{
          position: "absolute",
          top: `${ITEM_HEIGHT * padCount}px`,
          left: "4px",
          right: "4px",
          height: `${ITEM_HEIGHT}px`,
          backgroundColor: "var(--accent)",
          opacity: 0.12,
          borderRadius: "8px",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
      {/* Hide scrollbar */}
      <style>{`
        .drum-scroll::-webkit-scrollbar { display: none; }
      `}</style>
      {/* Scrollable area */}
      <div
        ref={scrollRef}
        className="drum-scroll"
        onScroll={handleScroll}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          height: "100%",
          overflowY: "scroll",
          scrollSnapType: "y mandatory",
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
          position: "relative",
          zIndex: 1,
          scrollbarWidth: "none",
          cursor: "grab",
          touchAction: "none",
        }}
      >
        {/* Top padding */}
        <div style={{ height: `${ITEM_HEIGHT * padCount}px` }} />
        {items.map((item, i) => (
          <div
            key={`${item}-${i}`}
            style={{
              height: `${ITEM_HEIGHT}px`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              scrollSnapAlign: "center",
              fontFamily: "var(--font-mono)",
              fontSize: "15px",
              fontWeight: i === selectedIndex ? 700 : 400,
              color:
                i === selectedIndex ? "var(--accent)" : "var(--fg-muted)",
              transition: "color 150ms, font-weight 150ms",
              cursor: "pointer",
              userSelect: "none",
            }}
            onClick={() => handleItemClick(i)}
          >
            {item}
          </div>
        ))}
        {/* Bottom padding */}
        <div style={{ height: `${ITEM_HEIGHT * padCount}px` }} />
      </div>
    </div>
  );
}

export default function DateDrumPicker({
  value,
  onChange,
}: DateDrumPickerProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1950 + 1 },
    (_, i) => 1950 + i
  );
  const maxDay = getDaysInMonth(value.month, value.year);
  const days = Array.from({ length: maxDay }, (_, i) => i + 1);

  const handleMonthSelect = useCallback(
    (index: number) => {
      const newMonth = index + 1;
      const newMaxDay = getDaysInMonth(newMonth, value.year);
      onChange({
        month: newMonth,
        day: Math.min(value.day, newMaxDay),
        year: value.year,
      });
    },
    [value.day, value.year, onChange]
  );

  const handleDaySelect = useCallback(
    (index: number) => {
      onChange({ ...value, day: index + 1 });
    },
    [value, onChange]
  );

  const handleYearSelect = useCallback(
    (index: number) => {
      const newYear = 1950 + index;
      const newMaxDay = getDaysInMonth(value.month, newYear);
      onChange({
        month: value.month,
        day: Math.min(value.day, newMaxDay),
        year: newYear,
      });
    },
    [value.month, value.day, onChange]
  );

  return (
    <div
      style={{
        display: "flex",
        gap: "2px",
        borderRadius: "12px",
        border: "2px solid var(--border)",
        backgroundColor: "var(--bg-surface)",
        overflow: "hidden",
      }}
    >
      <DrumColumn
        items={MONTHS}
        selectedIndex={value.month - 1}
        onSelect={handleMonthSelect}
        width="35%"
      />
      <div
        style={{
          width: "1px",
          backgroundColor: "var(--border)",
          opacity: 0.5,
        }}
      />
      <DrumColumn
        items={days.map(String)}
        selectedIndex={value.day - 1}
        onSelect={handleDaySelect}
        width="30%"
      />
      <div
        style={{
          width: "1px",
          backgroundColor: "var(--border)",
          opacity: 0.5,
        }}
      />
      <DrumColumn
        items={years.map(String)}
        selectedIndex={value.year - 1950}
        onSelect={handleYearSelect}
        width="35%"
      />
    </div>
  );
}
