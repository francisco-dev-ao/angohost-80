
import React from 'react';
import Layout from '@/components/Layout';
import { useCart } from '@/contexts/CartContext';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/utils/formatters';

const Checkout = () => {
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
        <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <CheckoutForm />
          </div>

          <div className="border rounded-lg p-6 h-fit sticky top-8">
            <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
            <ul className="space-y-4 mb-6">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    {item.quantity > 1 && (
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} x {formatPrice(item.basePrice)}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </li>
              ))}
            </ul>
            <div className="space-y-2 mb-6 pt-4 border-t">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{formatPrice(items.reduce((acc, item) => acc + item.price * item.quantity, 0))}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
