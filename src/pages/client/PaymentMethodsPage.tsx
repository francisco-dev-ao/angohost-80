
import React from 'react';
import { motion } from 'framer-motion';
import PaymentMethodsComponent from '@/components/client/PaymentMethodsPage';

const PaymentMethodsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <PaymentMethodsComponent />
    </motion.div>
  );
};

export default PaymentMethodsPage;
