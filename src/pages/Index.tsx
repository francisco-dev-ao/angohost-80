
import React, { useState } from "react";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import PricingSection from "@/components/home/PricingSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FaqSection from "@/components/home/FaqSection";
import CallToActionSection from "@/components/home/CallToActionSection";
import DomainSearchSection from "@/components/home/DomainSearchSection";
import Layout from "@/components/Layout";
import ClientLogosCarousel from "@/components/home/ClientLogosCarousel";
import PartnerLogos from "@/components/home/PartnerLogos";
import AdminSetupDialog from "@/components/admin/AdminSetupDialog";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

const Index = () => {
  const [isAdminSetupOpen, setIsAdminSetupOpen] = useState(false);
  
  return (
    <Layout>
      <div className="fixed bottom-5 right-5 z-50">
        <Button 
          variant="outline" 
          size="icon"
          className="h-10 w-10 rounded-full border-gray-300 bg-white shadow-md hover:bg-gray-100"
          onClick={() => setIsAdminSetupOpen(true)}
          title="Configurações do Sistema"
        >
          <Settings size={18} />
        </Button>
      </div>
      
      <HeroSection />
      <PartnerLogos />
      <DomainSearchSection />
      <FeaturesSection />
      <ClientLogosCarousel />
      <PricingSection />
      <TestimonialsSection />
      <FaqSection />
      <CallToActionSection />
      
      <AdminSetupDialog
        isOpen={isAdminSetupOpen}
        onOpenChange={setIsAdminSetupOpen}
      />
    </Layout>
  );
};

export default Index;
