import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

/** Rendered inside ContentLayout's <Outlet />, which supplies the header/footer shell. */
const PlaceholderPage = ({ title, description }: PlaceholderPageProps) => {
  return (
    <>
      <h1 className="max-w-lg text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
        {title}
      </h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-ink/60">
        {description}
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-1.5 rounded-xl bg-ink px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        <ArrowLeft size={16} />
        Back to home
      </Link>
    </>
  );
};

export default PlaceholderPage;
