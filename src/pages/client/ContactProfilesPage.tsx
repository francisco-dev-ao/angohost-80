
import React from 'react';
import { motion } from 'framer-motion';
import ContactProfilesComponent from '@/components/client/ContactProfilesPage';

const ContactProfilesPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ContactProfilesComponent />
    </motion.div>
  );
};

export default ContactProfilesPage;
