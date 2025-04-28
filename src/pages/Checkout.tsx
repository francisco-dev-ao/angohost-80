
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';

const Checkout = () => {
  const navigate = useNavigate();
  
  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Redirecionando...</h1>
          <p className="mb-8">Você está sendo redirecionado para finalizar sua compra.</p>
          <Button onClick={() => navigate('/cart')}>Voltar para o carrinho</Button>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
