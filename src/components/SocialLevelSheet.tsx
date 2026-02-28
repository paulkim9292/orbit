import { X } from "lucide-react";

export const SOCIAL_LEVELS = [
  { id: "cosmic-dust", label: "Cosmic Dust", image: "/images/cosmic-dust.png" },
  { id: "comet", label: "Comet", image: "/images/comet.png" },
  { id: "moon", label: "Moon", image: "/images/moon.png" },
  { id: "planet", label: "Planet", image: "/images/planet.png" },
  { id: "stardust", label: "Stardust", image: "/images/stardust.png" },
  { id: "galaxy", label: "Galaxy", image: "/images/galaxy.png" },
] as const;

interface SocialLevelSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevelId: string;
}

export function SocialLevelSheet({
  isOpen,
  onClose,
  currentLevelId,
}: SocialLevelSheetProps) {
  if (!isOpen) return null;

  const currentIndex = SOCIAL_LEVELS.findIndex((l) => l.id === currentLevelId);

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
          maxHeight: "78%",
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
          className="shrink-0 flex items-center justify-between"
          style={{
            padding: "8px 24px 16px",
            borderBottom: "1px solid rgba(174, 177, 231, 0.08)",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "18px",
              fontWeight: 600,
              color: "var(--color-text-white)",
              letterSpacing: "0.3px",
            }}
          >
            Social Levels
          </h3>
          <button
            onClick={onClose}
            className="flex items-center justify-center cursor-pointer"
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              border: "none",
              backgroundColor: "rgba(174, 177, 231, 0.08)",
            }}
          >
            <X size={14} color="var(--color-text-primary)" />
          </button>
        </div>

        {/* Level list */}
        <div
          className="flex-1 overflow-y-auto hide-scrollbar"
          style={{ padding: "16px 24px 32px" }}
        >
          {/* Level list with connector segments between circles */}
          <div style={{ position: "relative" }}>
            {SOCIAL_LEVELS.map((level, i) => {
              const isCurrent = level.id === currentLevelId;
              const isReached = i <= currentIndex;
              // Each row is 56px circle + 20px vertical padding (10px top + 10px bottom) = 76px
              // Connector goes from bottom of this circle to top of next circle
              // i.e. the 20px gap between rows (10px bottom padding + 10px top padding)
              const showConnector = i < SOCIAL_LEVELS.length - 1;
              const connectorOpacity =
                i < currentIndex
                  ? 0.4 - i * 0.06
                  : 0.12;

              return (
                <div
                  key={level.id}
                  className="flex items-center"
                  style={{
                    position: "relative",
                    padding: "10px 0",
                    gap: "16px",
                    animation: "searchSlideIn 300ms ease-out",
                    animationDelay: `${80 + i * 50}ms`,
                    animationFillMode: "backwards",
                  }}
                >
                  {/* Connector line to next circle */}
                  {showConnector && (
                    <div
                      style={{
                        position: "absolute",
                        left: "27px",
                        top: "66px", /* 10px padding + 56px circle */
                        height: "20px", /* gap between circles (10px + 10px) */
                        width: "2px",
                        backgroundColor: `rgba(${i < currentIndex ? "255, 92, 117" : "174, 177, 231"}, ${connectorOpacity})`,
                        borderRadius: "1px",
                      }}
                    />
                  )}
                  {/* Level image with ring */}
                  <div
                    className="flex items-center justify-center shrink-0"
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "50%",
                      background: isCurrent
                        ? "linear-gradient(135deg, rgba(255, 92, 117, 0.2), rgba(174, 177, 231, 0.15))"
                        : isReached
                          ? "rgba(174, 177, 231, 0.06)"
                          : "rgba(174, 177, 231, 0.03)",
                      border: isCurrent
                        ? "1.5px solid var(--color-accent-pink)"
                        : isReached
                          ? "1.5px solid rgba(174, 177, 231, 0.2)"
                          : "1.5px solid rgba(174, 177, 231, 0.08)",
                      transition: "all 300ms",
                    }}
                  >
                    <img
                      src={level.image}
                      alt={level.label}
                      style={{
                        width: "36px",
                        height: "36px",
                        objectFit: "contain",
                        opacity: isReached ? 1 : 0.3,
                        filter: isReached ? "none" : "grayscale(0.8)",
                      }}
                    />
                  </div>

                  {/* Label + indicator */}
                  <div className="flex flex-col" style={{ gap: "2px", flex: 1 }}>
                    <span
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "15px",
                        fontWeight: isCurrent ? 700 : 400,
                        color: isCurrent
                          ? "var(--color-text-white)"
                          : isReached
                            ? "var(--color-text-primary)"
                            : "rgba(174, 177, 231, 0.35)",
                        letterSpacing: "0.3px",
                      }}
                    >
                      {level.label}
                    </span>
                    {isCurrent && (
                      <span
                        style={{
                          fontFamily: "var(--font-heading)",
                          fontSize: "11px",
                          fontWeight: 500,
                          color: "var(--color-accent-pink)",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Your current level
                      </span>
                    )}
                  </div>

                  {/* Level number */}
                  <span
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "12px",
                      fontWeight: 500,
                      color: isCurrent
                        ? "rgba(255, 92, 117, 0.6)"
                        : "rgba(174, 177, 231, 0.2)",
                      letterSpacing: "0.5px",
                    }}
                  >
                    LV.{i + 1}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
