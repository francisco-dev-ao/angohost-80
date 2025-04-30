
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
import DatabaseConfigDialog from "@/components/admin/DatabaseConfigDialog";
import { Button } from "@/components/ui/button";
import { Settings, Database } from "lucide-react";
import { executeQuery } from "@/integrations/mysql/client";
import { toast } from "sonner";

const Index = () => {
  const [isAdminSetupOpen, setIsAdminSetupOpen] = useState(false);
  const [isDatabaseConfigOpen, setIsDatabaseConfigOpen] = useState(false);
  const [adminConfigured, setAdminConfigured] = useState(false);
  const [dbConfigNeeded, setDbConfigNeeded] = useState(false);
  
  useEffect(() => {
    // Check if database credentials exist in localStorage
    const checkDbCredentials = () => {
      try {
        const storedCredentials = localStorage.getItem('db_credentials');
        if (!storedCredentials) {
          setDbConfigNeeded(true);
          setTimeout(() => {
            toast.info("Configure as credenciais do banco de dados para ativar todas as funcionalidades", {
              duration: 8000
            });
          }, 2000);
          return;
        }
        
        const credentials = JSON.parse(storedCredentials);
        if (!credentials.username) {
          setDbConfigNeeded(true);
          setTimeout(() => {
            toast.info("Configure as credenciais do banco de dados para ativar todas as funcionalidades", {
              duration: 8000
            });
          }, 2000);
        }
      } catch (error) {
        console.error('Erro ao verificar credenciais:', error);
        setDbConfigNeeded(true);
      }
    };
    
    // Check if support admin is already configured
    const checkAdminUser = async () => {
      try {
        const { data, error } = await executeQuery(
          'SELECT role, email FROM users WHERE email = ? AND role = ?',
          ['support@angohost.ao', 'admin']
        );
        
        if (data && Array.isArray(data) && data.length > 0) {
          setAdminConfigured(true);
        }
      } catch (error) {
        console.error('Error checking admin user:', error);
      }
    };
    
    checkDbCredentials();
    checkAdminUser();
  }, []);
  
  return (
    <Layout>
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
        <Button 
          variant={dbConfigNeeded ? "default" : "outline"}
          size="icon"
          className={`h-12 w-12 rounded-full shadow-md hover:shadow-lg ${
            dbConfigNeeded 
              ? "bg-blue-600 hover:bg-blue-700 text-white" 
              : "border-gray-300 bg-white hover:bg-gray-100"
          }`}
          onClick={() => setIsDatabaseConfigOpen(true)}
          title="Configuração do Banco de Dados"
        >
          <Database size={20} />
          {dbConfigNeeded && (
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-ping"></span>
          )}
        </Button>
        
        <Button 
          variant="outline" 
          size="icon"
          className="h-12 w-12 rounded-full border-gray-300 bg-white shadow-md hover:bg-gray-100 hover:shadow-lg"
          onClick={() => setIsAdminSetupOpen(true)}
          title="Configurações do Sistema"
        >
          <Settings size={20} />
          {!adminConfigured && (
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          )}
        </Button>
      </div>
      
      <HeroSection />
      <DomainSearchSection />
      <PricingTabsSection />
      <TrustpilotSection />
      <ServicesSection />
      <TestimonialsSection />
      <SupportSection />
      <CtaSection />

      <AdminSetupDialog
        isOpen={isAdminSetupOpen}
        onOpenChange={setIsAdminSetupOpen}
        defaultEmail="support@angohost.ao"
      />
      
      <DatabaseConfigDialog
        isOpen={isDatabaseConfigOpen}
        onOpenChange={setIsDatabaseConfigOpen}
      />
    </Layout>
  );
};

export default Index;
