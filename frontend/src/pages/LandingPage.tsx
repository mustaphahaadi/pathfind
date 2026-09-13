import Hero from "../components/home/Hero";
import TrustedBy from "../components/home/TrustedBy";
import MentorsSection from "../components/home/MentorsSection";
import MissionSection from "../components/home/MissionSection";
import TestimonialsSection from "../components/home/TestimonialsSection";
import CTASection from "../components/home/CTASection";
import Footer from "../components/layout/Footer";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-cream">
      <Hero />
      <TrustedBy />
      <MentorsSection />
      <MissionSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;
