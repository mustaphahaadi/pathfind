import { trustedCompanies } from "../../data/trustedCompanies";

const TrustedBy = () => {
  return (
    <section className="px-5 py-10 sm:px-8 sm:py-14">
      <p className="text-center text-xs font-medium tracking-wide text-muted">
        Mentors from Ghana's leading tech companies &amp; alumni networks
      </p>
      <div className="mx-auto mt-6 flex max-w-4xl flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {trustedCompanies.map((company) => {
          const Icon = company.icon;
          return (
            <div
              key={company.name}
              className="flex items-center gap-2 text-ink/70"
            >
              {Icon && <Icon size={18} strokeWidth={1.75} />}
              <span className="text-lg font-semibold">{company.name}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TrustedBy;
