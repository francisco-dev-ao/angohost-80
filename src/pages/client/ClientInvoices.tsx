
import React from 'react';
import { InvoicesPage } from '@/components/client/InvoicesPage';
import { motion } from 'framer-motion';

const ClientInvoices = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <InvoicesPage />
    </motion.div>
  );
};

export default ClientInvoices;
