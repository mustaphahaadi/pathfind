import { Link } from 'react-router-dom'
import { ArrowRight, PartyPopper } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { mentors } from '@/data/mentors'
import { useOnboardingStore } from '@/store/onboardingStore'

const navLinks = [
  { label: 'Browse Mentors', href: '/mentors' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Volunteer', href: '/join' },
  { label: 'About', href: '/#about' },
]

export function MentorsPlaceholderPage() {
  const fullName = useOnboardingStore((s) => s.account.fullName)

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Navbar links={navLinks} />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-5 py-16 text-center sm:px-8">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-moss-soft text-moss">
            <PartyPopper size={22} />
          </span>
          <h1 className="mt-5 font-display text-3xl font-semibold text-ink sm:text-4xl">
            {fullName ? `You're all set, ${fullName.split(' ')[0]}.` : "You're all set."}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-ink-soft">
            Your mentee profile is ready. Browsing, matching, and session
            booking live on the next pages of this build.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-5 text-left sm:grid-cols-2 lg:grid-cols-4">
            {mentors.map((mentor) => (
              <div
                key={mentor.id}
                className="overflow-hidden rounded-2xl border border-line bg-white"
              >
                <img
                  src={mentor.photoUrl}
                  alt={mentor.name}
                  className="aspect-[4/3] w-full object-cover"
                  loading="lazy"
                />
                <div className="p-4">
                  <p className="font-semibold text-ink">{mentor.name}</p>
                  <p className="text-sm text-ink-soft">{mentor.role}</p>
                </div>
              </div>
            ))}
          </div>

          <Link to="/" className="mt-10 inline-block">
            <Button variant="secondary" icon={<ArrowRight size={15} />}>
              Back to home
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
