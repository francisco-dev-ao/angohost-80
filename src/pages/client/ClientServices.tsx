
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
  
  // Check if this is the support email and show admin setup if needed
  useEffect(() => {
    if (user?.email === 'support@angohost.ao') {
      // We'll only show the dialog if it's needed
      // This should be determined based on some condition (first login, etc)
      // For now, we'll not show it automatically to avoid disruption
      // setShowAdminSetup(true);
      
      // Instead, we'll silently ensure the admin status
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
