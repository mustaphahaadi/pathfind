import { testimonials } from "../../data/testimonials";
import TestimonialCard from "./TestimonialCard";

const TestimonialsSection = () => {
  return (
    <section className="px-5 py-14 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-medium uppercase tracking-wide text-accent-green">
          Community Success
        </p>
        <div className="mt-2 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <h2 className="max-w-xl text-2xl font-extrabold leading-tight text-ink sm:text-3xl">
            Real career switchers. Genuine offers. 100% free.
          </h2>
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-cream-dark px-3 py-1.5 text-sm font-medium text-ink/80">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-green" />
            Zero paywalls. Always community-funded.
          </span>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
