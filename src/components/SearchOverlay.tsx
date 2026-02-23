import { useState, useEffect, useRef } from "react";
import { ArrowLeft, X, Search, Clock, TrendingUp } from "lucide-react";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const recentSearchesData = [
  "Dragon's Back",
  "Kayaking",
  "Running group",
];

const popularTags = [
  { label: "Hiking", emoji: "\u{1F3D4}" },
  { label: "Running", emoji: "\u{1F3C3}" },
  { label: "Kayaking", emoji: "\u{1F6F6}" },
  { label: "Swimming", emoji: "\u{1F3CA}" },
  { label: "Cycling", emoji: "\u{1F6B4}" },
  { label: "Yoga", emoji: "\u{1F9D8}" },
  { label: "Climbing", emoji: "\u{1FA78}" },
];

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState(recentSearchesData);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Small delay so the animation plays before focus
      const t = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(t);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const removeRecent = (term: string) => {
    setRecentSearches((prev) => prev.filter((s) => s !== term));
  };

  return (
    <div
      className="flex flex-col"
      style={{
        position: "fixed",
        inset: 0,
        maxWidth: "393px",
        margin: "0 auto",
        backgroundColor: "var(--color-bg-primary)",
        zIndex: 30,
        animation: "fadeIn 250ms ease-out",
      }}
    >
      {/* Atmospheric background glow */}
      <div
        className="absolute"
        style={{
          top: "-40px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "300px",
          height: "200px",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(134, 140, 228, 0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Search bar */}
      <div
        className="shrink-0 relative"
        style={{
          padding: "20px 20px 0",
          animation: "searchSlideIn 350ms ease-out",
        }}
      >
        <div className="flex items-center" style={{ gap: "14px" }}>
          <button
            onClick={onClose}
            className="shrink-0 flex items-center justify-center cursor-pointer"
            style={{
              background: "none",
              border: "none",
              padding: "4px",
              borderRadius: "8px",
              transition: "background 200ms",
            }}
            aria-label="Back"
          >
            <ArrowLeft size={20} color="var(--color-text-primary)" />
          </button>

          <div
            className="flex items-center flex-1 relative"
            style={{
              backgroundColor: "rgba(174, 177, 231, 0.08)",
              borderRadius: "12px",
              padding: "10px 14px",
              border: "1px solid rgba(174, 177, 231, 0.15)",
              animation: "glowPulseOnce 1.2s ease-out",
              transition: "border-color 300ms",
            }}
          >
            <Search
              size={15}
              color="var(--color-text-primary)"
              style={{ opacity: 0.5, marginRight: "10px", flexShrink: 0 }}
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search activities..."
              className="flex-1"
              style={{
                background: "none",
                border: "none",
                outline: "none",
                color: "var(--color-text-white)",
                fontFamily: "var(--font-heading)",
                fontSize: "15px",
                fontWeight: 400,
                letterSpacing: "0.3px",
              }}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="shrink-0 cursor-pointer flex items-center justify-center"
                style={{
                  background: "rgba(174, 177, 231, 0.15)",
                  border: "none",
                  padding: "3px",
                  borderRadius: "50%",
                  marginLeft: "8px",
                }}
                aria-label="Clear search"
              >
                <X size={12} color="var(--color-text-primary)" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div
        className="flex-1 overflow-y-auto hide-scrollbar"
        style={{ padding: "28px 20px" }}
      >
        {query ? (
          /* Empty results state */
          <div
            className="flex flex-col items-center"
            style={{
              paddingTop: "80px",
              animation: "fadeIn 300ms ease-out",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "rgba(174, 177, 231, 0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
              }}
            >
              <Search size={20} color="var(--color-text-primary)" style={{ opacity: 0.4 }} />
            </div>
            <span
              style={{
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-heading)",
                fontSize: "14px",
                opacity: 0.5,
              }}
            >
              No results for "{query}"
            </span>
          </div>
        ) : (
          <>
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <section
                style={{
                  marginBottom: "32px",
                  animation: "searchSlideIn 400ms ease-out",
                  animationDelay: "50ms",
                  animationFillMode: "backwards",
                }}
              >
                <div
                  className="flex items-center"
                  style={{ gap: "6px", marginBottom: "14px" }}
                >
                  <Clock
                    size={13}
                    color="var(--color-text-primary)"
                    style={{ opacity: 0.4 }}
                  />
                  <h3
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "var(--color-text-primary)",
                      opacity: 0.4,
                      textTransform: "uppercase",
                      letterSpacing: "1.2px",
                    }}
                  >
                    Recent
                  </h3>
                </div>
                <div className="flex flex-col">
                  {recentSearches.map((term, i) => (
                    <div
                      key={term}
                      className="flex items-center justify-between"
                      style={{
                        padding: "12px 0",
                        borderBottom:
                          i < recentSearches.length - 1
                            ? "1px solid rgba(174, 177, 231, 0.08)"
                            : "none",
                      }}
                    >
                      <span
                        className="cursor-pointer flex-1"
                        onClick={() => setQuery(term)}
                        style={{
                          fontFamily: "var(--font-heading)",
                          fontSize: "15px",
                          color: "var(--color-text-primary)",
                          letterSpacing: "0.2px",
                        }}
                      >
                        {term}
                      </span>
                      <button
                        onClick={() => removeRecent(term)}
                        className="shrink-0 cursor-pointer flex items-center justify-center"
                        style={{
                          background: "none",
                          border: "none",
                          padding: "4px",
                        }}
                        aria-label={`Remove ${term}`}
                      >
                        <X
                          size={14}
                          color="var(--color-text-primary)"
                          style={{ opacity: 0.3 }}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Popular Tags */}
            <section
              style={{
                animation: "searchSlideIn 400ms ease-out",
                animationDelay: "120ms",
                animationFillMode: "backwards",
              }}
            >
              <div
                className="flex items-center"
                style={{ gap: "6px", marginBottom: "14px" }}
              >
                <TrendingUp
                  size={13}
                  color="var(--color-text-primary)"
                  style={{ opacity: 0.4 }}
                />
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                    opacity: 0.4,
                    textTransform: "uppercase",
                    letterSpacing: "1.2px",
                  }}
                >
                  Popular
                </h3>
              </div>
              <div className="flex flex-wrap" style={{ gap: "8px" }}>
                {popularTags.map((tag, i) => (
                  <button
                    key={tag.label}
                    onClick={() => setQuery(tag.label)}
                    className="cursor-pointer"
                    style={{
                      height: "34px",
                      padding: "0 14px",
                      borderRadius: "17px",
                      border: "1px solid rgba(174, 177, 231, 0.18)",
                      backgroundColor: "rgba(174, 177, 231, 0.06)",
                      color: "var(--color-text-primary)",
                      fontFamily: "var(--font-heading)",
                      fontSize: "13px",
                      fontWeight: 500,
                      letterSpacing: "0.3px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      transition: "all 200ms",
                      animation: "searchSlideIn 350ms ease-out",
                      animationDelay: `${150 + i * 40}ms`,
                      animationFillMode: "backwards",
                    }}
                  >
                    <span style={{ fontSize: "14px" }}>{tag.emoji}</span>
                    {tag.label}
                  </button>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
