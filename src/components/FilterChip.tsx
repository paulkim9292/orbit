interface FilterChipProps {
  label: string;
  active?: boolean;
  icon?: "filter";
  onClick?: () => void;
}

export function FilterChip({ label, active, icon, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`
        shrink-0 inline-flex items-center justify-center cursor-pointer
        rounded-full border transition-all duration-250
        ${
          active
            ? "border-(--color-text-primary) bg-(--color-text-primary) text-(--color-bg-primary)"
            : "border-(--color-border-button) bg-transparent text-(--color-text-primary)"
        }
      `}
      style={{
        height: "24px",
        padding: "0 10px",
        gap: "4px",
        fontFamily: "var(--font-heading)",
        fontSize: "10px",
        fontWeight: 500,
        letterSpacing: "0.3px",
        whiteSpace: "nowrap",
      }}
      onPointerDown={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "scale(0.93)";
      }}
      onPointerUp={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "";
      }}
      onPointerLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "";
      }}
    >
      {icon === "filter" && (
        <img
          src="/icons/filter.svg"
          alt=""
          style={{ width: "10px", height: "8px", opacity: 0.6 }}
        />
      )}
      {label}
    </button>
  );
}
