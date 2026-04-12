import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FloatingConnectionBridge from "@/components/FloatingConnectionBridge";
import CategoriesSection from "@/components/CategoriesSection";
import MachinesSection from "@/components/MachinesSection";
import HowItWorks from "@/components/HowItWorks";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
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
  );
};

export default Index;
