
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from "@/utils/formatters";
import { useContactProfiles } from '@/hooks/useContactProfiles';
import { useOwnership } from '@/contexts/OwnershipContext';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash, Check, Info, Calendar, ShoppingCart } from "lucide-react";
import { toast } from 'sonner';
import { useCheckoutProcess } from '@/hooks/useCheckoutProcess';
import CartEmailSuggestions from './CartEmailSuggestions';
import OwnershipProfileSelector from '@/components/OwnershipProfileSelector';
import DomainOwnership from '@/components/DomainOwnership';

const EnhancedCartPage = () => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const { items, removeFromCart } = useCart();
  const [isOwnershipDialogOpen, setIsOwnershipDialogOpen] = useState(false);
  const { addProfile } = useOwnership();
  
  const {
    step,
    nextStep,
    selectedContactProfile,
    setSelectedContactProfile,
    selectedDuration,
    handleDurationChange,
    shouldShowEmailSuggestions,
    domainItems,
    calculateDiscount
  } = useCheckoutProcess();

  if (items.length === 0) {
    return (
      <div className="container py-12">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow text-center">
          <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Seu carrinho está vazio</h2>
          <p className="text-gray-500 mb-6">Adicione itens ao seu carrinho para continuar.</p>
          <Button onClick={() => navigate('/domains')} className="w-full mb-2">
            Pesquisar Domínios
          </Button>
          <Button variant="outline" onClick={() => navigate('/')} className="w-full">
            Continuar Explorando
          </Button>
        </div>
      </div>
    );
  }

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const discount = calculateDiscount(parseInt(selectedDuration));
  const discountAmount = subtotal * discount;
  const total = subtotal - discountAmount;

  // Handler for domain ownership submission
  const handleOwnershipSubmit = (_: string, data: any) => {
    // Make sure all required fields are present and satisfy the required type
    if (data.name && data.email && data.document && data.phone && data.address) {
      addProfile({
        name: data.name,
        email: data.email,
        document: data.document,
        phone: data.phone,
        address: data.address
      });
      setIsOwnershipDialogOpen(false);
      toast.success("Perfil de titularidade criado com sucesso");
    } else {
      toast.error("Todos os campos são obrigatórios");
    }
  };

  // Function to proceed to checkout - modified to match new flow
  const handleProceedToCheckout = () => {
    navigate('/enhanced-checkout');
  };

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6">Seu Carrinho</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* Duration Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Selecione a duração
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedDuration} onValueChange={handleDurationChange} className="grid grid-cols-5 gap-4">
                {["1", "2", "3", "4", "5"].map((year) => {
                  const yearNum = parseInt(year);
                  const discount = calculateDiscount(yearNum);
                  const showDiscount = discount > 0;
                  
                  return (
                    <div key={year} className="relative">
                      <RadioGroupItem value={year} id={`duration-${year}`} className="peer sr-only" />
                      <Label
                        htmlFor={`duration-${year}`}
                        className="flex flex-col items-center justify-center border rounded-md p-4 cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground hover:bg-muted/50"
                      >
                        <span className="text-lg font-bold">{year}</span>
                        <span className="text-sm">{parseInt(year) === 1 ? 'ano' : 'anos'}</span>
                        {showDiscount && (
                          <span className="mt-1 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                            -{discount * 100}%
                          </span>
                        )}
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
              <div className="mt-4 text-sm text-muted-foreground">
                <Info className="inline-block h-4 w-4 mr-1" />
                <span>
                  Planos de email podem ser adquiridos por até 3 anos. Domínios por até 5 anos.
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Cart Items */}
          <Card>
            <CardHeader>
              <CardTitle>Itens no carrinho</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(item.price)}
                      {item.years && item.years > 1 && ` por ${item.years} anos`}
                    </p>
                  </div>
                  <Button 
                    size="icon" 
                    variant="ghost"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Email Plan Suggestions for Domain Customers */}
          {shouldShowEmailSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <CartEmailSuggestions />
            </motion.div>
          )}
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Price Summary */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Desconto ({discount * 100}%)</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <Button 
                  className="w-full" 
                  onClick={handleProceedToCheckout}
                  disabled={items.length === 0}
                >
                  Finalizar Compra
                </Button>
                
                <Button variant="outline" className="w-full" onClick={() => navigate('/')}>
                  Continuar Comprando
                </Button>
              </div>

              {/* Payment Info */}
              <div className="text-sm text-muted-foreground pt-2">
                <div className="flex items-center gap-1 mb-1">
                  <Check className="h-3 w-3" />
                  <span>Pagamento 100% seguro</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  <span>Suporte técnico gratuito</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {isOwnershipDialogOpen && (
        <DomainOwnership
          domain=""
          isOpen={isOwnershipDialogOpen}
          onClose={() => setIsOwnershipDialogOpen(false)}
          onSubmit={handleOwnershipSubmit}
        />
      )}
    </div>
  );
};

export default EnhancedCartPage;
