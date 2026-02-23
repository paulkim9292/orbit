interface OptionButtonProps {
  label: string
  selected?: boolean
  onClick?: () => void
}

export function OptionButton({ label, selected, onClick }: OptionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full rounded-full border
        flex items-center justify-center
        text-center transition-all duration-250
        ${
          selected
            ? 'border-(--color-text-primary) bg-(--color-text-primary) text-(--color-bg-primary)'
            : 'border-(--color-border-button) bg-transparent text-(--color-text-primary) hover:bg-(--color-bg-overlay)'
        }
      `}
      style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', height: '43px' }}
    >
      {label}
    </button>
  )
}
