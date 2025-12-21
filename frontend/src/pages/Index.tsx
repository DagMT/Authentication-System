import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { ArchitectureSection } from '@/components/home/ArchitectureSection';
import { SecuritySection } from '@/components/home/SecuritySection';
import { ApiSection } from '@/components/home/ApiSection';
import { CtaSection } from '@/components/home/CtaSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <ArchitectureSection />
        <SecuritySection />
        <ApiSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
