import type { ReactNode } from 'react'
import { Check, Plus } from 'lucide-react'

interface ChipProps {
  label: string
  active: boolean
  onToggle: () => void
  icon?: ReactNode
}

export function Chip({ label, active, onToggle, icon }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? 'border-ink bg-ink text-paper'
          : 'border-line bg-white text-ink-soft hover:border-ink/30 hover:text-ink'
      }`}
    >
      {icon ? (
        icon
      ) : active ? (
        <Check size={14} strokeWidth={2.5} />
      ) : (
        <Plus size={14} strokeWidth={2.5} />
      )}
      {label}
    </button>
  )
}
