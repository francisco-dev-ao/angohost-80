
import React from 'react';
import { Outlet } from 'react-router-dom';
import ClientSidebar from '@/components/client/ClientSidebar';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const ClientLayout = () => {
  const { user } = useSupabaseAuth();
  
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
        }
      } catch (error) {
        console.error('Error in feature activation process:', error);
      }
    };
    
    activateClientFeatures();
  }, [user]);
  
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
