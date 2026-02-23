import { Check, MapPin } from "lucide-react";

interface RegionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRegion: string;
  onSelect: (region: string) => void;
}

const regionGroups = [
  {
    label: "Hong Kong Island",
    districts: ["Central & Western", "Wan Chai", "Eastern", "Southern"],
  },
  {
    label: "Kowloon",
    districts: [
      "Yau Tsim Mong",
      "Sham Shui Po",
      "Kowloon City",
      "Wong Tai Sin",
      "Kwun Tong",
    ],
  },
  {
    label: "New Territories",
    districts: [
      "Kwai Tsing",
      "Tsuen Wan",
      "Tuen Mun",
      "Yuen Long",
      "North",
      "Tai Po",
      "Sha Tin",
      "Sai Kung",
      "Islands",
    ],
  },
];

export function RegionSheet({
  isOpen,
  onClose,
  selectedRegion,
  onSelect,
}: RegionSheetProps) {
  if (!isOpen) return null;

  const handleSelect = (region: string) => {
    onSelect(region);
    onClose();
  };

  let itemIndex = 0;

  return (
    /* Backdrop */
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
      {/* Sheet */}
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
          <MapPin
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
            Select Region
          </h3>
        </div>

        {/* Scrollable list */}
        <div
          className="flex-1 overflow-y-auto hide-scrollbar"
          style={{ padding: "8px 24px 28px" }}
        >
          {/* All Region option */}
          <RegionRow
            label="All Region"
            selected={selectedRegion === "All Region"}
            onSelect={() => handleSelect("All Region")}
            style={{
              fontWeight: 500,
              animation: "searchSlideIn 300ms ease-out",
              animationDelay: "80ms",
              animationFillMode: "backwards",
            }}
          />

          {/* Divider */}
          <div
            style={{
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(174, 177, 231, 0.12), transparent)",
              margin: "4px 0",
            }}
          />

          {/* District groups */}
          {regionGroups.map((group) => (
            <div key={group.label} style={{ marginTop: "12px" }}>
              {/* Group header */}
              <div
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "var(--color-accent-pink)",
                  opacity: 0.7,
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  padding: "4px 0 6px",
                }}
              >
                {group.label}
              </div>

              {/* Districts */}
              {group.districts.map((district) => {
                const delay = 100 + itemIndex * 20;
                itemIndex++;
                return (
                  <RegionRow
                    key={district}
                    label={district}
                    selected={selectedRegion === district}
                    onSelect={() => handleSelect(district)}
                    style={{
                      animation: "searchSlideIn 300ms ease-out",
                      animationDelay: `${delay}ms`,
                      animationFillMode: "backwards",
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RegionRow({
  label,
  selected,
  onSelect,
  style,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
  style?: React.CSSProperties;
}) {
  return (
    <button
      onClick={onSelect}
      className="flex items-center justify-between w-full cursor-pointer"
      style={{
        height: "42px",
        background: selected
          ? "rgba(174, 177, 231, 0.06)"
          : "none",
        border: "none",
        borderRadius: "8px",
        padding: "0 8px",
        fontFamily: "var(--font-heading)",
        fontSize: "14px",
        fontWeight: 400,
        color: selected
          ? "var(--color-text-white)"
          : "var(--color-text-primary)",
        transition: "all 200ms",
        ...style,
      }}
    >
      {label}
      {selected && (
        <div
          className="flex items-center justify-center"
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            backgroundColor: "rgba(255, 92, 117, 0.15)",
          }}
        >
          <Check size={12} color="var(--color-accent-pink)" strokeWidth={2.5} />
        </div>
      )}
    </button>
  );
}
