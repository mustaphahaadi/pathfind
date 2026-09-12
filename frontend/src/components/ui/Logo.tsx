import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

interface LogoProps {
  withMark?: boolean
  light?: boolean
  className?: string
}

export function Logo({ withMark = false, light = false, className = '' }: LogoProps) {
  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2 font-display text-xl font-semibold tracking-tight ${
        light ? 'text-paper' : 'text-ink'
      } ${className}`}
    >
      {withMark && (
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-ink text-paper">
          <ArrowUpRight size={16} strokeWidth={2.5} />
        </span>
      )}
      Pathfind
    </Link>
  )
}
