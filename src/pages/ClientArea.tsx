
import React, { useEffect } from "react";
import Layout from "@/components/Layout";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useNavigate } from "react-router-dom";
import ClientSidebar from "@/components/client/ClientSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useClientRoutes } from "@/hooks/useClientRoutes";

const ClientArea = () => {
  const { user, loading } = useSupabaseAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentComponent } = useClientRoutes();

  useEffect(() => {
    if (!loading && !user) {
      toast.error('Faça login para acessar a área do cliente');
      navigate('/register', { state: { returnUrl: location.pathname } });
    }
  }, [user, loading, navigate, location.pathname]);

  if (loading) {
    return (
      <Layout>
        <div className="container py-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Carregando...</h1>
            <p>Por favor, aguarde enquanto carregamos suas informações.</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <Layout>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <ClientSidebar />
          <div className="flex-1 p-6">
            {currentComponent}
          </div>
        </div>
      </SidebarProvider>
    </Layout>
  );
};

export default ClientArea;
