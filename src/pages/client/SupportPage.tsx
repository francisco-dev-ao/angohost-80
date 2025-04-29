
import React from 'react';
import { motion } from 'framer-motion';
import SupportComponent from '@/components/client/SupportPage';

const SupportPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <SupportComponent />
    </motion.div>
  );
};

export default SupportPage;
