import { Link } from "react-router-dom";
import { ArrowUpRight, Star } from "lucide-react";
import Header from "../layout/Header";

const avatarUrls = [
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=faces&q=80",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop&crop=faces&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=faces&q=80",
];

const Hero = () => {
  return (
    <section className="px-5 pt-5 sm:px-8 sm:pt-8 lg:px-12 lg:pt-10">
      <div className="mx-auto max-w-7xl">
        <div
          className="relative overflow-hidden rounded-[32px] bg-cover bg-center shadow-lg"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=80&auto=format&fit=crop')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

          <div className="relative flex min-h-[560px] flex-col justify-between sm:min-h-[640px]">
            <Header variant="overlay" />

            <div className="flex flex-1 flex-col justify-center px-6 pb-10 sm:px-12 sm:pb-12 lg:px-16 lg:pb-16">
            <h1 className="max-w-xl text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
              Feel Supported.
              <br />
              Move Freely.
              <br />
              Break Into Tech.
            </h1>

            <p className="mt-5 max-w-md text-base leading-relaxed text-white/80 sm:text-lg">
              Personalized mentorship designed to guide your career, review
              your portfolio, and land your next role — delivered 100% free
              by volunteer industry experts.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to="/mentors"
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-ink transition-opacity hover:opacity-90"
              >
                Find a Free Mentor
              </Link>
              <Link
                to="/join/mentor"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                Volunteer
                <ArrowUpRight size={16} />
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-4">
              <div>
                <p className="text-lg font-bold text-white">15k+</p>
                <p className="text-xs text-white/70">Guided Mentees</p>
              </div>
              <div className="h-8 w-px bg-white/20" aria-hidden="true" />
              <div className="flex items-center gap-1.5">
                <div className="flex text-accent-gold">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={14} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <span className="text-sm font-semibold text-white">4.9</span>
              </div>
              <div className="h-8 w-px bg-white/20" aria-hidden="true" />
              <div className="flex -space-x-2">
                {avatarUrls.map((url, index) => (
                  <img
                    key={url}
                    src={url}
                    alt=""
                    className="h-8 w-8 rounded-full border-2 border-white/80 object-cover"
                    style={{ zIndex: avatarUrls.length - index }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
};

export default Hero;
