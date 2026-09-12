import { Check } from 'lucide-react'

interface CheckboxCardProps {
  title: string
  description: string
  checked: boolean
  onToggle: () => void
}

export function CheckboxCard({
  title,
  description,
  checked,
  onToggle,
}: CheckboxCardProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={checked}
      className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
        checked
          ? 'border-ink bg-mist/60 ring-1 ring-ink'
          : 'border-line bg-white hover:border-ink/25'
      }`}
    >
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 ${
          checked ? 'border-ink bg-ink' : 'border-line'
        }`}
      >
        {checked && <Check size={12} strokeWidth={3} className="text-paper" />}
      </span>
      <span className="min-w-0">
        <span className="block font-semibold text-ink">{title}</span>
        <span className="mt-0.5 block text-sm text-ink-soft">
          {description}
        </span>
      </span>
    </button>
  )
}
