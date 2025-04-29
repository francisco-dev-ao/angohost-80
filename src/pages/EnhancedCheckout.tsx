
import React from 'react';
import Layout from '@/components/Layout';
import EnhancedCheckout from '@/components/checkout/EnhancedCheckout';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

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
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Carrinho vazio</h1>
            <p className="mb-8">Não há itens no seu carrinho para finalizar a compra.</p>
            <Button onClick={() => navigate('/domains')}>Pesquisar domínios</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-12">
        <EnhancedCheckout />
      </div>
    </Layout>
  );
};

export default EnhancedCheckoutPage;
