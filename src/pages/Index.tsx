
import React, { useState, useEffect } from "react";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FaqSection from "@/components/home/FaqSection";
import CallToActionSection from "@/components/home/CallToActionSection";
import Layout from "@/components/Layout";
import ClientLogosCarousel from "@/components/home/ClientLogosCarousel";
import PartnerLogos from "@/components/home/PartnerLogos";
import AdminSetupDialog from "@/components/admin/AdminSetupDialog";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ServicesOverview from "@/components/home/ServicesOverview";
import EmailPlansSection from "@/components/home/EmailPlansSection";
import TablePricing from "@/components/TablePricing";

const Index = () => {
  const [isAdminSetupOpen, setIsAdminSetupOpen] = useState(false);
  const [adminConfigured, setAdminConfigured] = useState(false);
  
  useEffect(() => {
    // Check if support admin is already configured
    const checkAdminUser = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role, email')
          .eq('email', 'support@angohost.ao')
          .eq('role', 'admin')
          .single();
        
        if (data) {
          setAdminConfigured(true);
        }
      } catch (error) {
        console.error('Error checking admin user:', error);
      }
    };
    
    checkAdminUser();
  }, []);
  
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
          {!adminConfigured && (
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          )}
        </Button>
      </div>
      
      {/* Hero section with domain search below it */}
      <HeroSection />
      
      {/* Services Overview Grid */}
      <div className="pt-32">
        <ServicesOverview />
      </div>
      
      {/* Main Features */}
      <FeaturesSection />
      
      {/* Email Plans Section */}
      <EmailPlansSection />
      
      {/* Detailed Pricing Table */}
      <section className="py-20 bg-gray-50">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Planos e Preços Detalhados</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Compare nossos planos e escolha a melhor opção para o seu negócio
            </p>
          </div>
          
          <TablePricing />
        </div>
      </section>
      
      {/* Partners and Clients */}
      <PartnerLogos />
      <ClientLogosCarousel />
      
      {/* Testimonials */}
      <TestimonialsSection />
      
      {/* FAQ */}
      <FaqSection />
      
      {/* Call to Action */}
      <CallToActionSection />
      
      <AdminSetupDialog
        isOpen={isAdminSetupOpen}
        onOpenChange={setIsAdminSetupOpen}
        defaultEmail="support@angohost.ao"
      />
    </Layout>
  );
};

export default Index;
