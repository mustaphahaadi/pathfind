interface SelectableCardProps {
  title: string
  description: string
  meta?: string
  selected: boolean
  onSelect: () => void
}

export function SelectableCard({
  title,
  description,
  meta,
  selected,
  onSelect,
}: SelectableCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex w-full items-start gap-3.5 rounded-xl border p-4 text-left transition-colors sm:p-5 ${
        selected
          ? 'border-ink bg-mist/60 ring-1 ring-ink'
          : 'border-line bg-white hover:border-ink/25'
      }`}
    >
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
          selected ? 'border-ink' : 'border-line'
        }`}
      >
        {selected && <span className="h-2.5 w-2.5 rounded-full bg-ink" />}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-semibold text-ink">{title}</span>
          {meta && (
            <span className="rounded-full bg-line/70 px-2.5 py-0.5 text-xs font-medium text-ink-soft">
              {meta}
            </span>
          )}
          {selected && !meta && (
            <span className="rounded-full bg-ink px-2.5 py-0.5 text-xs font-medium text-paper">
              Selected
            </span>
          )}
        </span>
        <span className="mt-0.5 block text-sm text-ink-soft">
          {description}
        </span>
      </span>
    </button>
  )
}
