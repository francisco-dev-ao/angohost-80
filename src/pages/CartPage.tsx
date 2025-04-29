
import React from "react";
import Layout from "@/components/Layout";
import EnhancedCartPage from "@/components/cart/EnhancedCartPage";
import { motion } from "framer-motion";

const CartPage = () => {
  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-[80vh] bg-gradient-to-b from-gray-50 to-white"
      >
        <EnhancedCartPage />
      </motion.div>
    </Layout>
  );
};

export default CartPage;
