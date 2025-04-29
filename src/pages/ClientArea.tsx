import React, { useEffect } from "react";
import { useNavigate, Routes, Route, Link } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { toast } from "sonner";
import ClientSidebar from "@/components/client/ClientSidebar";
import ClientDashboard from "@/components/client/ClientDashboard";
import ProfilePage from "@/components/client/ProfilePage";
import DomainsPage from "@/components/client/DomainsPage";
import ServicesPage from "@/components/client/ServicesPage";
import InvoicesPage from "@/components/client/InvoicesPage";
import PaymentMethodsPage from "@/components/client/PaymentMethodsPage";
import SupportPage from "@/components/client/SupportPage";
import NotificationsPage from "@/components/client/NotificationsPage";
import PromotionsPage from "@/components/client/PromotionsPage";
import OrdersPage from "@/components/client/OrdersPage";
import ContactProfilesPage from "@/components/client/ContactProfilesPage";
import WalletPage from "@/components/client/WalletPage";
import { Button } from "@/components/ui/button";
import { LogOut, Home, Search, ShoppingCart, User } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const ClientArea = () => {
  const { user, loading, signOut } = useSupabaseAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const setupClientAccess = async () => {
      if (!loading && user) {
        try {
          // Ensure all client features are activated
          await supabase
            .from('user_feature_settings')
            .upsert({
              user_id: user.id,
              features_enabled: {
                dashboard: true,
                domains: true,
                services: true,
                invoices: true,
                tickets: true,
                wallet: true,
                notifications: true,
                promotions: true,
                orders: true,
                contact_profiles: true,
                payment_methods: true
              },
              last_updated: new Date().toISOString()
            });
        } catch (error) {
          console.error("Error activating client features:", error);
        }
      } else if (!loading && !user) {
        toast.error('Faça login para acessar a área do cliente');
        navigate('/register');
      }
    };
    
    setupClientAccess();
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="container py-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Carregando...</h1>
          <p>Por favor, aguarde enquanto carregamos suas informações.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Main navigation menu */}
      <motion.header 
        className="border-b bg-background shadow-sm"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="font-bold text-primary text-xl">
              AngoHost
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link to="/" className="text-sm font-medium hover:underline">Início</Link>
              <Link to="/domains" className="text-sm font-medium hover:underline">Domínios</Link>
              <Link to="/wordpress-hosting" className="text-sm font-medium hover:underline">Hospedagem</Link>
              <Link to="/vps-hosting" className="text-sm font-medium hover:underline">VPS</Link>
              <Link to="/professional-email" className="text-sm font-medium hover:underline">E-mail</Link>
              <Link to="/contact" className="text-sm font-medium hover:underline">Contato</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link to="/domains">
                <Search className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="icon" asChild>
              <Link to="/enhanced-checkout">
                <ShoppingCart className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" onClick={handleSignOut} className="hidden md:flex">
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </motion.header>
      
      <div className="flex flex-1">
        <ClientSidebar />
        
        <div className="flex-1">
          <div className="container py-8">
            <Routes>
              <Route path="/" element={<ClientDashboard />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/domains" element={<DomainsPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/invoices" element={<InvoicesPage />} />
              <Route path="/payment-methods" element={<PaymentMethodsPage />} />
              <Route path="/wallet" element={<WalletPage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/promotions" element={<PromotionsPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/contact-profiles" element={<ContactProfilesPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientArea;
