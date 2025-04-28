import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Trash } from 'lucide-react';
import DomainValidator from '@/components/DomainValidator';
import AdditionalProducts from '@/components/AdditionalProducts';

const Cart = () => {
  const { items, removeFromCart } = useCart();
  const [domainType, setDomainType] = useState('new');
  const [validatedDomain, setValidatedDomain] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return `${Math.round(price).toLocaleString()}kz`;
  };

  const calculateSubtotal = () => {
    return items.reduce((acc, item) => {
      if (item.title.toLowerCase().includes('domínio') && domainType === 'existing') {
        return acc;
      }
      return acc + item.price * item.quantity;
    }, 0);
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

  const calculateRenewalDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date.toLocaleDateString('pt-BR');
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
    toast.success('Item removido do carrinho!');
  };

  const handleCheckout = () => {
    if (!validatedDomain) {
      toast.error('Por favor, configure um domínio antes de continuar.');
      return;
    }
    // Proceed with checkout
    toast.success('Prosseguindo para o pagamento...');
  };

  const handleDomainValidated = (domain: string) => {
    setValidatedDomain(domain);
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
                  <DomainValidator onDomainValidated={handleDomainValidated} />
                </div>
              </div>

              {items.map((item) => (
                <div key={item.id} className="border rounded-lg p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <div className="mt-2 text-muted-foreground">
                        <p>Quantidade: {item.quantity}</p>
                        <p>Preço unitário: {formatPrice(item.basePrice)}</p>
                        <p>Total: {formatPrice(item.price)}</p>
                        {item.title.toLowerCase().includes('domínio') && (
                          <p className="mt-1 text-sm">
                            Próxima renovação: {calculateRenewalDate()}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <AdditionalProducts />
            </div>

            <div className="border rounded-lg p-6 h-fit">
              <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(calculateSubtotal())}</span>
                </div>
                {calculateDiscount() > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Desconto ({(calculateDiscount() * 100)}%)</span>
                    <span>-{formatPrice(calculateSubtotal() * calculateDiscount())}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold pt-2 border-t">
                  <span>Total</span>
                  <span>{formatPrice(calculateTotal())}</span>
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  <p>Renovação: {formatPrice(calculateTotal())}/ano</p>
                </div>
              </div>
              <Button 
                className="w-full mt-4" 
                onClick={handleCheckout}
                disabled={!validatedDomain}
              >
                Finalizar Compra
              </Button>
              {!validatedDomain && (
                <p className="text-sm text-red-500 mt-2">
                  Configure um domínio para prosseguir
                </p>
              )}
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
