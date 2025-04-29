
import React from 'react';
import { motion } from 'framer-motion';
import PromotionsComponent from '@/components/client/PromotionsPage';

const PromotionsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <PromotionsComponent />
    </motion.div>
  );
};

export default PromotionsPage;
