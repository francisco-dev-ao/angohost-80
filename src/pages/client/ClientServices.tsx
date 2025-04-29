
import React, { useEffect } from 'react';
import ServicesPage from '@/components/client/ServicesPage';
import { motion } from 'framer-motion';
import { useAdminSetupUtil } from '@/hooks/useAdminSetupUtil';
import AdminSetupDialog from '@/components/admin/AdminSetupDialog';
import { useState } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

const ClientServices = () => {
  const [showAdminSetup, setShowAdminSetup] = useState(false);
  const { ensureAdminExists } = useAdminSetupUtil();
  const { user } = useSupabaseAuth();
  
  // Check if this is the support email and setup admin privileges automatically
  useEffect(() => {
    if (user?.email === 'support@angohost.ao') {
      // Auto setup the admin for the support account with full permissions
      ensureAdminExists('support@angohost.ao', 'AngoHost@2025');
    }
  }, [user]);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ServicesPage />
      
      <AdminSetupDialog 
        isOpen={showAdminSetup} 
        onOpenChange={setShowAdminSetup} 
        defaultEmail="support@angohost.ao" 
      />
    </motion.div>
  );
};

export default ClientServices;
