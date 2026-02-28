import { useState, useRef, useEffect, useCallback } from "react";
import { Clock } from "lucide-react";

interface TimePickerSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTime: string; // "HH:MM"
  onSelect: (time: string) => void;
}

const ITEM_H = 42;
const VISIBLE = 5;
const PAD = Math.floor(VISIBLE / 2);

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, "0"));

/* ─── Scroll‑snap drum column ─── */

function ScrollColumn({
  items,
  selectedIndex,
  onChange,
}: {
  items: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const scrollTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const initialised = useRef(false);

  /* scroll to selected item on mount */
  useEffect(() => {
    const el = ref.current;
    if (el && !initialised.current) {
      el.scrollTop = selectedIndex * ITEM_H;
      initialised.current = true;
    }
  }, [selectedIndex]);

  const settle = useCallback(() => {
    clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => {
      const el = ref.current;
      if (!el) return;
      const idx = Math.round(el.scrollTop / ITEM_H);
      const clamped = Math.max(0, Math.min(items.length - 1, idx));
      onChange(clamped);
      el.scrollTo({ top: clamped * ITEM_H, behavior: "smooth" });
    }, 90);
  }, [items.length, onChange]);

  const tapItem = (i: number) => {
    onChange(i);
    ref.current?.scrollTo({ top: i * ITEM_H, behavior: "smooth" });
  };

  return (
    <div style={{ position: "relative", height: ITEM_H * VISIBLE, flex: 1 }}>
      {/* highlight band */}
      <div
        style={{
          position: "absolute",
          top: ITEM_H * PAD,
          height: ITEM_H,
          left: 6,
          right: 6,
          background: "rgba(174, 177, 231, 0.07)",
          borderRadius: "12px",
          border: "1px solid rgba(174, 177, 231, 0.1)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* top gradient */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: ITEM_H * PAD,
          background: "linear-gradient(to bottom, var(--color-bg-primary) 30%, transparent)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* bottom gradient */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: ITEM_H * PAD,
          background: "linear-gradient(to top, var(--color-bg-primary) 30%, transparent)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      <div
        ref={ref}
        onScroll={settle}
        className="hide-scrollbar"
        style={{
          height: "100%",
          overflowY: "auto",
          scrollSnapType: "y mandatory",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* top spacer */}
        <div style={{ height: ITEM_H * PAD }} />

        {items.map((item, i) => {
          const active = i === selectedIndex;
          return (
            <div
              key={item}
              onClick={() => tapItem(i)}
              style={{
                height: ITEM_H,
                scrollSnapAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: active ? "var(--color-text-white)" : "var(--color-text-primary)",
                opacity: active ? 1 : 0.28,
                fontSize: active ? "24px" : "18px",
                fontFamily: "var(--font-heading)",
                fontWeight: active ? 700 : 400,
                letterSpacing: active ? "2px" : "1px",
                transition: "all 120ms ease",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              {item}
            </div>
          );
        })}

        {/* bottom spacer */}
        <div style={{ height: ITEM_H * PAD }} />
      </div>
    </div>
  );
}

/* ─── Sheet ─── */

export function TimePickerSheet({
  isOpen,
  onClose,
  selectedTime,
  onSelect,
}: TimePickerSheetProps) {
  const [h, m] = (selectedTime || "12:00").split(":").map(Number);
  const [hour, setHour] = useState(h || 0);
  const [minuteIdx, setMinuteIdx] = useState(
    Math.max(
      0,
      MINUTES.indexOf(String(Math.round((m || 0) / 5) * 5).padStart(2, "0")),
    ),
  );

  if (!isOpen) return null;

  const handleDone = () => {
    const time = `${HOURS[hour]}:${MINUTES[minuteIdx]}`;
    onSelect(time);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        maxWidth: "393px",
        margin: "0 auto",
        backgroundColor: "var(--color-bg-overlay)",
        zIndex: 30,
        animation: "fadeIn 200ms ease-out",
      }}
      onClick={onClose}
    >
      <div
        className="absolute bottom-0 left-0 right-0 flex flex-col"
        style={{
          backgroundColor: "var(--color-bg-primary)",
          borderRadius: "20px 20px 0 0",
          animation: "slideUpSheet 350ms cubic-bezier(0.16, 1, 0.3, 1)",
          borderTop: "1px solid rgba(174, 177, 231, 0.15)",
          boxShadow: "0 -8px 40px rgba(0, 0, 0, 0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="flex justify-center shrink-0" style={{ padding: "12px 0 4px" }}>
          <div
            style={{
              width: "36px",
              height: "4px",
              borderRadius: "2px",
              backgroundColor: "rgba(174, 177, 231, 0.2)",
            }}
          />
        </div>

        {/* Header */}
        <div
          className="shrink-0 flex items-center justify-between"
          style={{
            padding: "8px 24px 16px",
            borderBottom: "1px solid rgba(174, 177, 231, 0.08)",
          }}
        >
          <div className="flex items-center" style={{ gap: "8px" }}>
            <Clock size={16} color="var(--color-accent-pink)" style={{ flexShrink: 0 }} />
            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "18px",
                fontWeight: 600,
                color: "var(--color-text-white)",
                letterSpacing: "0.3px",
              }}
            >
              Select Time
            </h3>
          </div>
          <button
            onClick={handleDone}
            className="cursor-pointer"
            style={{
              background: "none",
              border: "none",
              fontFamily: "var(--font-heading)",
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--color-accent-pink)",
              letterSpacing: "0.3px",
            }}
          >
            Done
          </button>
        </div>

        {/* Labels */}
        <div
          className="flex"
          style={{ padding: "12px 48px 0", opacity: 0.45 }}
        >
          <span
            style={{
              flex: 1,
              textAlign: "center",
              fontFamily: "var(--font-heading)",
              fontSize: "11px",
              fontWeight: 600,
              color: "var(--color-accent-pink)",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
            }}
          >
            Hour
          </span>
          <span style={{ width: "24px" }} />
          <span
            style={{
              flex: 1,
              textAlign: "center",
              fontFamily: "var(--font-heading)",
              fontSize: "11px",
              fontWeight: 600,
              color: "var(--color-accent-pink)",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
            }}
          >
            Min
          </span>
        </div>

        {/* Scroll wheels */}
        <div className="flex items-center" style={{ padding: "0 48px 28px" }}>
          <ScrollColumn items={HOURS} selectedIndex={hour} onChange={setHour} />

          {/* Colon separator */}
          <div
            style={{
              width: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-heading)",
              fontSize: "28px",
              fontWeight: 700,
              color: "var(--color-text-white)",
              opacity: 0.6,
              lineHeight: 1,
            }}
          >
            :
          </div>

          <ScrollColumn items={MINUTES} selectedIndex={minuteIdx} onChange={setMinuteIdx} />
        </div>
      </div>
    </div>
  );
}
