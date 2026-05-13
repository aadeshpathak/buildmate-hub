import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FloatingConnectionBridge from "@/components/FloatingConnectionBridge";
import CategoriesSection from "@/components/CategoriesSection";
import MachinesSection from "@/components/MachinesSection";
import HowItWorks from "@/components/HowItWorks";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import PagePreloader from "@/components/PagePreloader";

const Index = () => {
  const [loading, setLoading] = useState(true);

  const handleLoadComplete = useCallback(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <PagePreloader onComplete={handleLoadComplete} />;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />
        <HeroSection />
        <FloatingConnectionBridge />
        <CategoriesSection />
        <MachinesSection />
        <HowItWorks />
        <CTASection />
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Index;
