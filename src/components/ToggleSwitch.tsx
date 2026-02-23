interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function ToggleSwitch({ checked, onChange }: ToggleSwitchProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative shrink-0 cursor-pointer transition-colors duration-200"
      style={{
        width: "56px",
        height: "24.5px",
        borderRadius: "100px",
        backgroundColor: checked
          ? "var(--color-text-primary)"
          : "var(--color-bg-primary)",
        border: checked ? "none" : "1px solid var(--color-text-primary)",
        padding: 0,
      }}
    >
      <img
        src={checked ? "/icons/toggle-circle-on.svg" : "/icons/toggle-circle-off.svg"}
        alt=""
        className="absolute top-1/2 transition-all duration-200"
        style={{
          width: "19.6px",
          height: "19.6px",
          transform: "translateY(-50%)",
          left: checked ? "calc(100% - 19.6px - 2.45px)" : "2.45px",
        }}
      />
    </button>
  );
}
