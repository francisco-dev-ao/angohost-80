
import React from 'react';
import ServicesPage from '@/components/client/ServicesPage';
import { motion } from 'framer-motion';

const ClientServices = () => {
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
