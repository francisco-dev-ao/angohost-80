
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { CartSearch } from './CartSearch';
import { CartTable } from './CartTable';

interface AbandonedCart {
  id: string;
  email?: string;
  created_at: string;
  cart_items?: any[];
  notification_count?: number;
  last_notification_at?: string;
  profiles?: {
    full_name?: string;
  };
}

interface CartListContentProps {
  abandonedCarts: AbandonedCart[];
  isLoading: boolean;
  processingCart: string | null;
  onSendReminder: (cartId: string) => Promise<void>;
  onMarkRecovered: (cartId: string) => Promise<void>;
}

export const CartListContent = ({
  abandonedCarts,
  isLoading,
  processingCart,
  onSendReminder,
  onMarkRecovered
}: CartListContentProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredCarts = searchTerm 
    ? abandonedCarts.filter(cart => 
        (cart.email && cart.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (cart.profiles?.full_name && cart.profiles.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : abandonedCarts;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Carrinhos Abandonados</CardTitle>
        <CardDescription>
          Envie lembretes ou recupere carrinhos abandonados
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CartSearch 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
        />
        
        <CartTable 
          abandonedCarts={filteredCarts}
          isLoading={isLoading}
          processingCart={processingCart}
          onSendReminder={onSendReminder}
          onMarkRecovered={onMarkRecovered}
          searchTerm={searchTerm}
        />
      </CardContent>
    </Card>
  );
};
