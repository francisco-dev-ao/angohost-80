
import React, { useState, useEffect } from "react";
import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import PricingTabsSection from "@/components/home/PricingTabsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import SupportSection from "@/components/home/SupportSection";
import CtaSection from "@/components/home/CtaSection";
import DomainSearchSection from "@/components/home/DomainSearchSection";
import Layout from "@/components/Layout";
import TrustpilotSection from "@/components/home/TrustpilotSection";
import AdminSetupDialog from "@/components/admin/AdminSetupDialog";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
      
      <HeroSection />
      <DomainSearchSection />
      <ServicesSection />
      <PricingTabsSection />
      <TrustpilotSection />
      <TestimonialsSection />
      <SupportSection />
      <CtaSection />
      
      <AdminSetupDialog
        isOpen={isAdminSetupOpen}
        onOpenChange={setIsAdminSetupOpen}
        defaultEmail="support@angohost.ao"
      />
    </Layout>
  );
};

export default Index;
