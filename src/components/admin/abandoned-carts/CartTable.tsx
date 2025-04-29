
import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatPrice } from '@/utils/formatters';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Bell, Loader2, CheckCircle, ShoppingCart } from "lucide-react";

interface CartItem {
  price?: number;
  quantity?: number;
}

interface AbandonedCart {
  id: string;
  email?: string;
  created_at: string;
  cart_items?: CartItem[];
  notification_count?: number;
  last_notification_at?: string;
  profiles?: {
    full_name?: string;
  };
}

interface CartTableProps {
  abandonedCarts: AbandonedCart[];
  isLoading: boolean;
  processingCart: string | null;
  onSendReminder: (cartId: string) => Promise<void>;
  onMarkRecovered: (cartId: string) => Promise<void>;
  searchTerm: string;
}

export const CartTable = ({ 
  abandonedCarts, 
  isLoading, 
  processingCart, 
  onSendReminder, 
  onMarkRecovered,
  searchTerm
}: CartTableProps) => {
  const getCartTotal = (cart: AbandonedCart) => {
    if (!cart.cart_items || !Array.isArray(cart.cart_items)) return 0;
    return cart.cart_items.reduce((total: number, item: CartItem) => {
      const price = item.price || 0;
      const quantity = item.quantity || 1;
      return total + (price * quantity);
    }, 0);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Carregando...</span>
      </div>
    );
  } 
  
  if (abandonedCarts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <ShoppingCart className="h-10 w-10 text-muted-foreground/50 mb-3" />
        <p className="font-medium">Nenhum carrinho abandonado encontrado</p>
        <p className="text-sm text-muted-foreground mt-1">
          {searchTerm ? 'Tente uma busca diferente' : 'Todos os carrinhos foram recuperados ou foram criados há mais de 30 dias'}
        </p>
      </div>
    );
  }
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Itens</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Lembretes</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {abandonedCarts.map((cart) => (
            <TableRow key={cart.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{cart.profiles?.full_name || 'Cliente não identificado'}</p>
                  <p className="text-sm text-muted-foreground">{cart.email || 'Sem e-mail'}</p>
                </div>
              </TableCell>
              <TableCell>
                {format(new Date(cart.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
              </TableCell>
              <TableCell>
                {Array.isArray(cart.cart_items) ? cart.cart_items.length : 0} itens
              </TableCell>
              <TableCell>
                {formatPrice(getCartTotal(cart))}
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <span className="mr-2">{cart.notification_count || 0}</span>
                  {cart.last_notification_at && (
                    <span className="text-xs text-muted-foreground">
                      último em {format(new Date(cart.last_notification_at), 'dd/MM HH:mm', { locale: ptBR })}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={processingCart === cart.id}
                    onClick={() => onSendReminder(cart.id)}
                  >
                    {processingCart === cart.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Bell className="h-4 w-4" />
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={processingCart === cart.id}
                    onClick={() => onMarkRecovered(cart.id)}
                  >
                    {processingCart === cart.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
