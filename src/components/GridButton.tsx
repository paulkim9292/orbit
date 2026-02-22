interface GridButtonProps {
  label: string
  selected?: boolean
  onClick?: () => void
  fontSize?: number
}

export function GridButton({ label, selected, onClick, fontSize = 16 }: GridButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        rounded-full border
        flex items-center justify-center
        text-center transition-colors duration-200
        ${
          selected
            ? 'border-(--color-text-primary) bg-(--color-text-primary) text-(--color-bg-primary)'
            : 'border-(--color-border-button) bg-transparent text-(--color-text-primary) hover:bg-(--color-bg-overlay)'
        }
      `}
      style={{
        fontFamily: 'var(--font-heading)',
        fontSize: `${fontSize}px`,
        height: '43px',
        padding: '2px 4px',
        lineHeight: '1.2',
        overflow: 'hidden',
      }}
    >
      <span
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {label}
      </span>
    </button>
  )
}
