
import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import ClientSidebar from '@/components/client/ClientSidebar';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ClientLayout = () => {
  const { user, loading } = useSupabaseAuth();
  const navigate = useNavigate();
  
  // Ensure user is authenticated, otherwise redirect to login
  useEffect(() => {
    if (!loading && !user) {
      toast.error('Por favor, faça login para acessar a área do cliente');
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Ensure all client features are activated for the current user
  useEffect(() => {
    const activateClientFeatures = async () => {
      if (!user) return;
      
      try {
        // Update or create user feature settings to enable all features
        const { error } = await supabase
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
          
        if (error) {
          console.error('Error activating client features:', error);
        } else {
          console.log('Client features activated successfully');
        }
      } catch (error) {
        console.error('Error in feature activation process:', error);
      }
    };
    
    activateClientFeatures();
  }, [user]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg">Carregando...</p>
      </div>
    );
  }
  
  if (!user) {
    return null; // Will be redirected by the useEffect
  }
  
  return (
    <div className="flex min-h-screen">
      <ClientSidebar />
      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default ClientLayout;
