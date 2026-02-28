import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface DatePickerSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string; // "YYYY-MM-DD"
  onSelect: (date: string) => void;
}

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getCalendarDays(year: number, month: number) {
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const days: { day: number; currentMonth: boolean; date: string }[] = [];

  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const m = month === 0 ? 11 : month - 1;
    const y = month === 0 ? year - 1 : year;
    days.push({
      day: d,
      currentMonth: false,
      date: `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
    });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      day: i,
      currentMonth: true,
      date: `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`,
    });
  }

  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    const m = month === 11 ? 0 : month + 1;
    const y = month === 11 ? year + 1 : year;
    days.push({
      day: i,
      currentMonth: false,
      date: `${y}-${String(m + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`,
    });
  }

  return days;
}

export function DatePickerSheet({
  isOpen,
  onClose,
  selectedDate,
  onSelect,
}: DatePickerSheetProps) {
  const now = new Date();
  const initial = selectedDate ? new Date(selectedDate + "T00:00") : now;
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());

  if (!isOpen) return null;

  const days = getCalendarDays(viewYear, viewMonth);
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleDayClick = (date: string) => {
    onSelect(date);
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
          className="shrink-0 flex items-center"
          style={{
            padding: "8px 24px 16px",
            gap: "8px",
            borderBottom: "1px solid rgba(174, 177, 231, 0.08)",
          }}
        >
          <Calendar size={16} color="var(--color-accent-pink)" style={{ flexShrink: 0 }} />
          <h3
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "18px",
              fontWeight: 600,
              color: "var(--color-text-white)",
              letterSpacing: "0.3px",
            }}
          >
            Select Date
          </h3>
        </div>

        {/* Calendar */}
        <div style={{ padding: "16px 20px 28px" }}>
          {/* Month / Year navigation */}
          <div className="flex items-center justify-between" style={{ marginBottom: "16px" }}>
            <button
              onClick={prevMonth}
              className="cursor-pointer flex items-center justify-center"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "rgba(174, 177, 231, 0.06)",
                border: "none",
                transition: "background 150ms ease",
              }}
            >
              <ChevronLeft size={18} color="var(--color-accent-pink)" />
            </button>
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "16px",
                fontWeight: 600,
                color: "var(--color-text-white)",
                letterSpacing: "0.5px",
              }}
            >
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              onClick={nextMonth}
              className="cursor-pointer flex items-center justify-center"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "rgba(174, 177, 231, 0.06)",
                border: "none",
                transition: "background 150ms ease",
              }}
            >
              <ChevronRight size={18} color="var(--color-accent-pink)" />
            </button>
          </div>

          {/* Weekday headers */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              marginBottom: "4px",
            }}
          >
            {WEEKDAYS.map((d, i) => (
              <div
                key={i}
                style={{
                  textAlign: "center",
                  fontFamily: "var(--font-heading)",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "var(--color-accent-pink)",
                  opacity: 0.5,
                  letterSpacing: "1px",
                  padding: "6px 0",
                }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: "3px",
            }}
          >
            {days.map((d, i) => {
              const isSelected = d.date === selectedDate;
              const isToday = d.date === todayStr && !isSelected;

              return (
                <button
                  key={`${d.date}-${i}`}
                  onClick={() => d.currentMonth && handleDayClick(d.date)}
                  className="cursor-pointer"
                  style={{
                    width: "100%",
                    aspectRatio: "1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: isToday ? "1px solid var(--color-accent-pink)" : "1px solid transparent",
                    borderRadius: "50%",
                    backgroundColor: isSelected ? "var(--color-accent-pink)" : "transparent",
                    color: isSelected
                      ? "#fff"
                      : d.currentMonth
                        ? "var(--color-text-primary)"
                        : "rgba(174, 177, 231, 0.18)",
                    fontFamily: "var(--font-heading)",
                    fontSize: "13px",
                    fontWeight: isSelected ? 600 : 400,
                    transition: "all 150ms ease",
                    boxShadow: isSelected ? "0 0 16px rgba(255, 92, 117, 0.3)" : "none",
                    animation: `searchSlideIn 200ms ease-out ${60 + i * 6}ms backwards`,
                  }}
                >
                  {d.day}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
