
import React, { useEffect } from 'react';
import ServicesPage from '@/components/client/ServicesPage';
import { motion } from 'framer-motion';
import { useAdminSetupUtil } from '@/hooks/useAdminSetupUtil';
import { useState } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const ClientServices = () => {
  const [showAdminSetup, setShowAdminSetup] = useState(false);
  const { ensureAdminExists } = useAdminSetupUtil();
  const { user } = useSupabaseAuth();
  
  // Check if this is the support email and setup admin privileges automatically
  useEffect(() => {
    if (user?.email === 'support@angohost.ao') {
      // Auto setup the admin for the support account with full permissions
      ensureAdminExists('support@angohost.ao', 'AngoHost@2025');
      toast.success('Usuário support@angohost.ao: acesso de super administrador com permissões totais configuradas automaticamente', {
        duration: 5000,
        position: 'top-center',
      });
    }

    // Ensure all client features are activated for the current user
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
  }, [user, ensureAdminExists]);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ServicesPage />
    </motion.div>
  );
};

export default ClientServices;
