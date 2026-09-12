import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { Button } from '@/components/ui/Button'

interface NavLink {
  label: string
  href: string
}

interface NavbarProps {
  links: NavLink[]
  transparent?: boolean
  sticky?: boolean
}

export function Navbar({ links, transparent = false, sticky = true }: NavbarProps) {
  const [open, setOpen] = useState(false)

  return (
    <header
      className={
        sticky
          ? transparent
            ? 'absolute inset-x-0 top-0 z-30'
            : 'sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur'
          : 'relative z-30'
      }
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
        <Logo light={transparent} />

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                transparent
                  ? 'text-paper/85 hover:bg-white/10 hover:text-paper'
                  : 'text-ink-soft hover:bg-mist hover:text-ink'
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/sign-in"
            className={`text-sm font-medium ${
              transparent ? 'text-paper/85 hover:text-paper' : 'text-ink-soft hover:text-ink'
            }`}
          >
            Sign In
          </Link>
          <Link to="/join">
            <Button
              variant={transparent ? 'secondary' : 'primary'}
              shape="pill"
              size="sm"
              icon={<ArrowUpRight size={15} />}
            >
              Sign Up
            </Button>
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`inline-flex h-10 w-10 items-center justify-center rounded-full lg:hidden ${
            transparent ? 'text-paper' : 'text-ink'
          }`}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="absolute inset-x-0 top-full border-t border-line bg-white px-5 pb-6 pt-2 shadow-lift lg:hidden">
          <div className="flex flex-col gap-1 pt-2">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-[15px] font-medium text-ink-soft hover:bg-mist"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/sign-in"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-[15px] font-medium text-ink-soft hover:bg-mist"
            >
              Sign In
            </Link>
          </div>
          <Link to="/join" onClick={() => setOpen(false)} className="mt-3 block">
            <Button
              variant="primary"
              shape="pill"
              className="w-full"
              icon={<ArrowUpRight size={15} />}
            >
              Sign Up
            </Button>
          </Link>
        </div>
      )}
    </header>
  )
}
