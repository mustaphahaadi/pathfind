import type { Offering } from "../../types/offering";

interface OfferingCardProps {
  offering: Offering;
}

const OfferingCard = ({ offering }: OfferingCardProps) => {
  const Icon = offering.icon;
  return (
    <div className="rounded-2xl bg-cream p-5">
      <Icon size={20} strokeWidth={1.75} className="text-ink" />
      <h3 className="mt-4 text-base font-bold text-ink">{offering.title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">
        {offering.description}
      </p>
    </div>
  );
};

export default OfferingCard;
