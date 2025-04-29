
import React from 'react';
import { motion } from 'framer-motion';
import NotificationsComponent from '@/components/client/NotificationsPage';

const NotificationsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <NotificationsComponent />
    </motion.div>
  );
};

export default NotificationsPage;
