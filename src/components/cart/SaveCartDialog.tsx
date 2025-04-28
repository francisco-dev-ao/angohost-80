
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useCartAbandonment } from '@/hooks/useCartAbandonment';

interface SaveCartDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SaveCartDialog = ({ isOpen, onClose }: SaveCartDialogProps) => {
  const [cartName, setCartName] = useState('Meu Carrinho');
  const [isPublic, setIsPublic] = useState(false);
  const { saveCart, isSaving } = useCartAbandonment();

  const handleSaveCart = async () => {
    if (!cartName.trim()) return;
    
    const success = await saveCart(cartName, isPublic);
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Salvar Carrinho</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="cartName">Nome do Carrinho</Label>
            <Input
              id="cartName"
              value={cartName}
              onChange={(e) => setCartName(e.target.value)}
              placeholder="Meu Carrinho"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="public-cart"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
            <Label htmlFor="public-cart">Permitir compartilhar este carrinho</Label>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button 
            onClick={handleSaveCart} 
            disabled={isSaving || !cartName.trim()}
          >
            {isSaving ? 'Salvando...' : 'Salvar Carrinho'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SaveCartDialog;
