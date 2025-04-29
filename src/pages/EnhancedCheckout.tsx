
import React from 'react';
import Layout from '@/components/Layout';
import EnhancedCheckout from '@/components/checkout/EnhancedCheckout';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';

const EnhancedCheckoutPage = () => {
  const navigate = useNavigate();
  const { items, isLoading } = useCart();

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-12">
          <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <Skeleton className="w-full h-64" />
              <Skeleton className="w-full h-64" />
            </div>
            <Skeleton className="h-96" />
          </div>
        </div>
      </Layout>
    );
  }

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container py-12">
          <div className="max-w-3xl mx-auto text-center bg-white p-12 rounded-lg shadow-sm">
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                <ShoppingBag className="h-10 w-10 text-muted-foreground" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-4">Seu carrinho está vazio</h1>
            <p className="text-muted-foreground mb-8">Não há itens no seu carrinho para finalizar a compra.</p>
            <div className="space-y-4">
              <Button onClick={() => navigate('/domains')} className="px-8">
                Pesquisar domínios
              </Button>
              <div>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/')}
                  className="px-8"
                >
                  Continuar explorando
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div 
        className="bg-gradient-to-b from-gray-50 to-white min-h-[80vh] py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container">
          <EnhancedCheckout />
        </div>
        <div className="container mt-12 text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-xl font-medium mb-4">Métodos de Pagamento Aceitos</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <img src="/placeholder.svg" alt="Método de Pagamento" className="h-8" />
              </div>
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <img src="/placeholder.svg" alt="Método de Pagamento" className="h-8" />
              </div>
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <img src="/placeholder.svg" alt="Método de Pagamento" className="h-8" />
              </div>
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <img src="/placeholder.svg" alt="Método de Pagamento" className="h-8" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default EnhancedCheckoutPage;
