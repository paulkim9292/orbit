import { Check, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface MonthPickerSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMonth: number;
  selectedYear: number;
  onSelect: (month: number, year: number) => void;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function MonthPickerSheet({
  isOpen,
  onClose,
  selectedMonth,
  selectedYear,
  onSelect,
}: MonthPickerSheetProps) {
  if (!isOpen) return null;

  const handleSelect = (month: number) => {
    onSelect(month, selectedYear);
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
          maxHeight: "72%",
          animation: "slideUpSheet 350ms cubic-bezier(0.16, 1, 0.3, 1)",
          borderTop: "1px solid rgba(174, 177, 231, 0.15)",
          boxShadow: "0 -8px 40px rgba(0, 0, 0, 0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div
          className="flex justify-center shrink-0"
          style={{ padding: "12px 0 4px" }}
        >
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
          className="shrink-0 flex items-center"
          style={{
            padding: "8px 24px 16px",
            gap: "8px",
            borderBottom: "1px solid rgba(174, 177, 231, 0.08)",
          }}
        >
          <Calendar
            size={16}
            color="var(--color-accent-pink)"
            style={{ flexShrink: 0 }}
          />
          <h3
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "18px",
              fontWeight: 600,
              color: "var(--color-text-white)",
              letterSpacing: "0.3px",
            }}
          >
            Select Month
          </h3>
        </div>

        {/* Year selector */}
        <div
          className="shrink-0 flex items-center justify-center"
          style={{ padding: "12px 24px 8px", gap: "16px" }}
        >
          <button
            onClick={() => onSelect(selectedMonth, selectedYear - 1)}
            className="flex items-center justify-center cursor-pointer"
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              border: "none",
              backgroundColor: "rgba(174, 177, 231, 0.08)",
            }}
          >
            <ChevronLeft size={14} color="var(--color-text-primary)" />
          </button>
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "16px",
              fontWeight: 600,
              color: "var(--color-text-white)",
              letterSpacing: "0.5px",
              minWidth: "48px",
              textAlign: "center",
            }}
          >
            {selectedYear}
          </span>
          <button
            onClick={() => onSelect(selectedMonth, selectedYear + 1)}
            className="flex items-center justify-center cursor-pointer"
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              border: "none",
              backgroundColor: "rgba(174, 177, 231, 0.08)",
            }}
          >
            <ChevronRight size={14} color="var(--color-text-primary)" />
          </button>
        </div>

        {/* Month list */}
        <div
          className="flex-1 overflow-y-auto hide-scrollbar"
          style={{ padding: "8px 24px 28px" }}
        >
          {MONTHS.map((month, i) => (
            <button
              key={month}
              onClick={() => handleSelect(i)}
              className="flex items-center justify-between w-full cursor-pointer"
              style={{
                height: "42px",
                background:
                  selectedMonth === i
                    ? "rgba(174, 177, 231, 0.06)"
                    : "none",
                border: "none",
                borderRadius: "8px",
                padding: "0 8px",
                fontFamily: "var(--font-heading)",
                fontSize: "14px",
                fontWeight: 400,
                color:
                  selectedMonth === i
                    ? "var(--color-text-white)"
                    : "var(--color-text-primary)",
                transition: "all 200ms",
                animation: "searchSlideIn 300ms ease-out",
                animationDelay: `${80 + i * 20}ms`,
                animationFillMode: "backwards",
              }}
            >
              {month}
              {selectedMonth === i && (
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255, 92, 117, 0.15)",
                  }}
                >
                  <Check
                    size={12}
                    color="var(--color-accent-pink)"
                    strokeWidth={2.5}
                  />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
