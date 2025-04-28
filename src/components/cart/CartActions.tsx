
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Save, List } from "lucide-react";
import SaveCartDialog from './SaveCartDialog';
import SavedCartsDialog from './SavedCartsDialog';
import { useCartAbandonment } from '@/hooks/useCartAbandonment';

const CartActions = () => {
  const [isSaveDialogOpen, setSaveDialogOpen] = useState(false);
  const [isCartsDialogOpen, setCartsDialogOpen] = useState(false);
  const { settings, isLoading } = useCartAbandonment();

  if (isLoading || !settings?.allow_save_carts) {
    return null;
  }

  return (
    <>
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setSaveDialogOpen(true)}
        >
          <Save className="mr-2 h-4 w-4" />
          Salvar Carrinho
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setCartsDialogOpen(true)}
        >
          <List className="mr-2 h-4 w-4" />
          Meus Carrinhos
        </Button>
      </div>

      <SaveCartDialog 
        isOpen={isSaveDialogOpen} 
        onClose={() => setSaveDialogOpen(false)} 
      />

      <SavedCartsDialog 
        isOpen={isCartsDialogOpen} 
        onClose={() => setCartsDialogOpen(false)} 
      />
    </>
  );
};

export default CartActions;
