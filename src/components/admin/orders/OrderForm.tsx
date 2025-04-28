
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { toast } from 'sonner';
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, MinusCircle, Loader2 } from "lucide-react";

interface OrderFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  onOrderCreate: (orderData: {
    userId: string;
    items: any[];
    totalAmount: number;
  }) => Promise<any>;
}

const OrderForm: React.FC<OrderFormProps> = ({
  isOpen,
  onOpenChange,
  onSuccess,
  onOrderCreate
}) => {
  const { users, isLoading: loadingUsers } = useAdminUsers();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState("");
  const [totalAmount, setTotalAmount] = useState("0");
  const [items, setItems] = useState([
    { name: "", quantity: 1, price: 0 }
  ]);

  useEffect(() => {
    // Calculate total amount whenever items change
    const calculatedTotal = items.reduce((sum, item) => 
      sum + (Number(item.price) * Number(item.quantity)), 0);
    setTotalAmount(calculatedTotal.toFixed(2));
  }, [items]);

  const handleAddItem = () => {
    setItems([...items, { name: "", quantity: 1, price: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      const newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);
    }
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      toast.error("Por favor, selecione um cliente");
      return;
    }
    
    if (items.some(item => !item.name)) {
      toast.error("Todos os itens precisam ter um nome");
      return;
    }

    try {
      setIsSubmitting(true);
      
      await onOrderCreate({
        userId,
        items,
        totalAmount: parseFloat(totalAmount),
      });
      
      onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setUserId("");
    setItems([{ name: "", quantity: 1, price: 0 }]);
    setTotalAmount("0");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Novo Pedido</DialogTitle>
            <DialogDescription>
              Crie um novo pedido manualmente para um cliente.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="user">Cliente</Label>
              <Select value={userId} onValueChange={setUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {loadingUsers ? (
                    <div className="flex items-center justify-center p-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="ml-2">Carregando...</span>
                    </div>
                  ) : (
                    users.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.fullName || user.email}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Itens do Pedido</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={handleAddItem}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Adicionar Item
                </Button>
              </div>
              
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5">
                    <Input
                      placeholder="Nome do item"
                      value={item.name}
                      onChange={(e) => handleItemChange(index, "name", e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      placeholder="Qtd"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value) || 1)}
                      required
                    />
                  </div>
                  <div className="col-span-3">
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Preço"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, "price", parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(index)}
                      disabled={items.length <= 1}
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end mt-2">
              <div className="text-right">
                <Label>Valor Total</Label>
                <div className="text-xl font-semibold">
                  R$ {totalAmount}
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                onOpenChange(false);
                resetForm();
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Criar Pedido
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrderForm;
