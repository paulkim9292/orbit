interface ProgressBarProps {
  progress: number // 0 to 100
}

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div
      className="w-full rounded-full"
      style={{ height: "7px", backgroundColor: "var(--color-text-primary)" }}
    >
      <div
        className="h-full rounded-full"
        style={{
          width: `${progress}%`,
          backgroundColor: "#ff5c75",
          transition: "width 500ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />
    </div>
  )
}
