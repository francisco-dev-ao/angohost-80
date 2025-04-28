
import React, { useEffect } from "react";
import Layout from "@/components/Layout";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useNavigate } from "react-router-dom";
import ClientSidebar from "@/components/client/ClientSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useLocation } from "react-router-dom";
import { useClientRoutes } from "@/hooks/useClientRoutes";
import ClientDashboard from "@/components/client/ClientDashboard";
import ProfilePage from "@/components/client/ProfilePage";

const ClientArea = () => {
  const { user, loading } = useSupabaseAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentComponent } = useClientRoutes();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/register');
    }
  }, [user, loading, navigate]);

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

  // Render the appropriate component based on the route
  const renderComponent = () => {
    // Path-based component rendering
    if (location.pathname === "/client/profile") {
      return <ProfilePage />;
    }
    
    // Default to dashboard for the main client area
    if (location.pathname === "/client") {
      return <ClientDashboard />;
    }
    
    // For any other client routes
    return currentComponent || <ClientDashboard />;
  };

  return (
    <Layout>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <ClientSidebar />
          <div className="flex-1 p-6">
            {renderComponent()}
          </div>
        </div>
      </SidebarProvider>
    </Layout>
  );
};

export default ClientArea;
