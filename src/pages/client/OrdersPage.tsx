
import React from 'react';
import { motion } from 'framer-motion';
import OrdersComponent from '@/components/client/OrdersPage';

const OrdersPage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <OrdersComponent />
    </motion.div>
  );
};

export default OrdersPage;
