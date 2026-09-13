import { Star } from "lucide-react";
import type { Testimonial } from "../../types/testimonial";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
  return (
    <article className="flex flex-col rounded-2xl border border-line bg-white p-5">
      <div className="flex text-accent-gold">
        {Array.from({ length: testimonial.rating }).map((_, index) => (
          <Star key={index} size={14} fill="currentColor" strokeWidth={0} />
        ))}
      </div>
      <p className="mt-3 flex-1 text-sm italic leading-relaxed text-ink/80">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <div className="mt-5 flex items-center gap-3">
        <img
          src={testimonial.avatarUrl}
          alt=""
          className="h-9 w-9 rounded-full object-cover"
          loading="lazy"
        />
        <div>
          <p className="text-sm font-semibold text-ink">{testimonial.name}</p>
          <p className="text-xs text-muted">{testimonial.outcome}</p>
        </div>
      </div>
    </article>
  );
};

export default TestimonialCard;
