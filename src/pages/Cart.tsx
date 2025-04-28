
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Cart = () => {
  const { items } = useCart();
  const [domainType, setDomainType] = useState('new');
  const [domain, setDomain] = useState('');

  const calculateSubtotal = () => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    if (subtotal >= 5000) return 0.1; // 10% discount
    if (subtotal >= 2500) return 0.05; // 5% discount
    return 0;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = subtotal * calculateDiscount();
    return subtotal - discount;
  };

  return (
    <Layout>
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-8">Carrinho de Compras</h1>
        
        {items.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div className="border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Configuração do Domínio</h2>
                <RadioGroup
                  defaultValue="new"
                  onValueChange={(value) => setDomainType(value)}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="new" id="new" />
                    <Label htmlFor="new">Registrar novo domínio</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="existing" id="existing" />
                    <Label htmlFor="existing">Usar domínio existente</Label>
                  </div>
                </RadioGroup>
                
                <div className="mt-4">
                  <Label htmlFor="domain">Domínio</Label>
                  <Input 
                    id="domain"
                    placeholder={domainType === 'new' ? 'Digite o domínio desejado' : 'Digite seu domínio existente'}
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              {items.map((item, index) => (
                <div key={index} className="border rounded-lg p-6">
                  <h3 className="font-semibold">{item.title}</h3>
                  <div className="mt-2 text-muted-foreground">
                    <p>Quantidade: {item.quantity}</p>
                    <p>Preço unitário: {item.basePrice.toFixed(2)} kz</p>
                    <p>Total: {item.price.toFixed(2)} kz</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border rounded-lg p-6 h-fit">
              <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{calculateSubtotal().toFixed(2)} kz</span>
                </div>
                {calculateDiscount() > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Desconto ({(calculateDiscount() * 100)}%)</span>
                    <span>-{(calculateSubtotal() * calculateDiscount()).toFixed(2)} kz</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold pt-2 border-t">
                  <span>Total</span>
                  <span>{calculateTotal().toFixed(2)} kz</span>
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  <p>Renovação: {calculateTotal().toFixed(2)} kz/ano</p>
                </div>
              </div>
              <Button className="w-full mt-4">Finalizar Compra</Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Seu carrinho está vazio</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
