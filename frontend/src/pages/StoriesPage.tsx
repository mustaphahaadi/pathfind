import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Quote, Sparkles, CheckCircle2, HeartHandshake } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { testimonials } from "../data/testimonials";

const extendedStories = [
  ...testimonials,
  {
    id: "kwame-mensah",
    quote:
      "Transitioning into cloud architecture felt impossible until my Pathfind mentor walked me through real Terraform modules and AWS IAM policies. Within 2 months, I landed my AWS Associate position!",
    name: "Kwame Mensah",
    outcome: "Now Cloud Engineer @ AWS",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces&q=80",
    rating: 5,
    category: "Cloud & DevOps",
  },
  {
    id: "amara-okafor",
    quote:
      "As a self-taught frontend developer, I struggled with mock interview anxiety. My mentor conducted 3 live whiteboarding sessions and gave detailed code review feedback. I owe my offer to Pathfind!",
    name: "Amara Okafor",
    outcome: "Now Frontend Developer @ Paystack",
    avatarUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=faces&q=80",
    rating: 5,
    category: "Frontend Engineering",
  },
  {
    id: "david-kim",
    quote:
      "Pathfind eliminated the barrier to senior engineering guidance. Having a Staff Engineer review my portfolio projects gave me the exact confidence I needed to ace technical rounds.",
    name: "David Kim",
    outcome: "Now Fullstack Engineer @ Stripe",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces&q=80",
    rating: 5,
    category: "Fullstack Engineering",
  },
];

const StoriesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Software Engineering", "Product Design", "Cloud & DevOps", "Frontend Engineering", "Fullstack Engineering"];

  const filteredStories =
    selectedCategory === "All"
      ? extendedStories
      : extendedStories.filter(
          (story) =>
            story.category === selectedCategory ||
            (selectedCategory === "Software Engineering" && story.outcome.includes("SWE")) ||
            (selectedCategory === "Product Design" && story.outcome.includes("Designer")),
        );

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <Header variant="solid" />

      <main className="flex-1 px-5 py-10 sm:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          {/* Header Banner */}
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-green/10 px-3.5 py-1 text-xs font-semibold text-accent-green">
              <Sparkles size={14} />
              REAL CAREER TRANSITIONS
            </span>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-ink sm:text-4xl lg:text-5xl">
              Community Success Stories
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink/70 sm:text-lg">
              Discover how aspiring tech talents gained clarity, mastered interview loops, and landed dream roles with 100% free volunteer mentorship.
            </p>
          </div>

          {/* Category Filter */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-ink text-white shadow-sm"
                    : "bg-white text-ink/70 hover:bg-cream-dark border border-surface-line"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid of Success Stories */}
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredStories.map((story) => (
              <div
                key={story.id}
                className="flex flex-col justify-between rounded-3xl border border-surface-line bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <Quote className="h-8 w-8 text-accent-gold/40" />
                    <div className="flex text-accent-gold">
                      {Array.from({ length: story.rating }).map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                      ))}
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-ink/80 italic">
                    "{story.quote}"
                  </p>
                </div>

                <div className="mt-6 border-t border-surface-line pt-4 flex items-center gap-3">
                  <img
                    src={story.avatarUrl}
                    alt={story.name}
                    className="h-11 w-11 rounded-full object-cover shrink-0 ring-2 ring-cream-dark"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-ink">{story.name}</h3>
                    <p className="text-xs font-semibold text-accent-green flex items-center gap-1 mt-0.5">
                      <CheckCircle2 size={12} />
                      {story.outcome}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Card */}
          <div className="mt-16 rounded-3xl bg-navy p-8 text-center text-white sm:p-12 shadow-xl">
            <h2 className="text-2xl font-black sm:text-3xl">Ready to write your own success story?</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/80 sm:text-base">
              Connect with vetted senior engineers, product managers, and cloud architects who volunteer their time 100% free.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/mentors"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-ink transition-opacity hover:opacity-90"
              >
                Find a Free Mentor
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/join/mentor"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                Volunteer as a Mentor
                <HeartHandshake size={16} />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StoriesPage;
