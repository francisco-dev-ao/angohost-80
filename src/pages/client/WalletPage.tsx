
import React from 'react';
import { motion } from 'framer-motion';
import WalletComponent from '@/components/client/WalletPage';

const WalletPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <WalletComponent />
    </motion.div>
  );
};

export default WalletPage;
