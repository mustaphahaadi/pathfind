import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-5 text-center">
      <p className="font-display text-6xl font-semibold text-ink">404</p>
      <h1 className="mt-3 font-display text-2xl font-semibold text-ink">
        This path doesn&rsquo;t exist
      </h1>
      <p className="mt-2 max-w-sm text-ink-soft">
        The page you&rsquo;re looking for may have moved. Let&rsquo;s get you
        back on track.
      </p>
      <Link to="/" className="mt-6 inline-block">
        <Button>Back to home</Button>
      </Link>
    </div>
  )
}
