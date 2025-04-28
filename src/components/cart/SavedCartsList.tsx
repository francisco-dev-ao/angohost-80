
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash, Share2, ShoppingCart } from "lucide-react";
import { useCartAbandonment } from '@/hooks/useCartAbandonment';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface SavedCartsListProps {
  onClose?: () => void;
}

const SavedCartsList = ({ onClose }: SavedCartsListProps) => {
  const { savedCarts, deleteSavedCart, loadSavedCart } = useCartAbandonment();
  const { addToCart } = useCart();

  const handleLoadCart = async (cartId: string) => {
    const cartItems = await loadSavedCart(cartId);
    if (cartItems && Array.isArray(cartItems)) {
      // Clear current cart and add items from saved cart
      cartItems.forEach((item: any) => {
        addToCart(item);
      });
      toast.success('Carrinho carregado com sucesso');
      if (onClose) onClose();
    }
  };

  const handleShareCart = (cartToken: string) => {
    const url = `${window.location.origin}/cart/shared/${cartToken}`;
    navigator.clipboard.writeText(url);
    toast.success('Link de compartilhamento copiado para a área de transferência');
  };

  if (savedCarts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Você não tem carrinhos salvos</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {savedCarts.map((cart) => (
        <Card key={cart.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex justify-between items-center">
              <span>{cart.name}</span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(cart.created_at), { addSuffix: true, locale: ptBR })}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-4">
              {Array.isArray(cart.cart_items) && (
                <p>{cart.cart_items.length} {cart.cart_items.length === 1 ? 'item' : 'itens'}</p>
              )}
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="default" 
                size="sm" 
                className="flex-1"
                onClick={() => handleLoadCart(cart.id)}
              >
                <ShoppingCart className="mr-1 h-4 w-4" /> Carregar
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleShareCart(cart.token)}
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-500 hover:text-red-700"
                onClick={() => deleteSavedCart(cart.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SavedCartsList;
