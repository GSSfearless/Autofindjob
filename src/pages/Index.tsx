import Header from "@/components/Header";
import LandingHero from "@/components/LandingHero";
import FeaturesSection from "@/components/FeaturesSection";
import ProcessSection from "@/components/ProcessSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <LandingHero />
      <FeaturesSection />
      <ProcessSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
