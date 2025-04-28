
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatPrice } from "@/utils/formatters";
import { Trash, Check, AlertCircle } from "lucide-react";
import { CartItem } from "@/contexts/CartContext";
import { DomainWithOwnership } from "@/types/cart";

interface CartItemsProps {
  items: CartItem[];
  domainItems: CartItem[];
  domainWithOwnershipMap: { [key: string]: DomainWithOwnership };
  onRemoveItem: (itemId: string) => void;
  onOpenOwnershipDialog: (domain: string) => void;
}

const CartItems = ({
  items,
  domainItems,
  domainWithOwnershipMap,
  onRemoveItem,
  onOpenOwnershipDialog,
}: CartItemsProps) => {
  const calculateRenewalDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date.toLocaleDateString('pt-AO');
  };

  return (
    <div className="space-y-6">
      {domainItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Domínios e Titularidade</CardTitle>
            <CardDescription>
              Selecione ou adicione um perfil de titularidade para seus domínios
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {domainItems.map((item) => {
              const domainName = item.title.replace('Domínio ', '');
              const domainWithOwnership = domainWithOwnershipMap[domainName];
              
              return (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <div className="mt-2 text-muted-foreground">
                        <p>Preço: {formatPrice(item.price)}</p>
                        <p className="mt-1 text-sm">
                          Próxima renovação: {calculateRenewalDate()}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="mt-4">
                    {domainWithOwnership?.hasOwnership ? (
                      <div className="flex justify-between items-center">
                        <span className="text-green-600 text-sm flex items-center gap-1">
                          <Check className="h-4 w-4" />
                          Informações de titularidade preenchidas
                        </span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onOpenOwnershipDialog(domainName)}
                        >
                          Editar titularidade
                        </Button>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <span className="text-red-500 text-sm flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          Titularidade não preenchida
                        </span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onOpenOwnershipDialog(domainName)}
                        >
                          Adicionar titularidade
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Outros serviços</CardTitle>
          <CardDescription>
            Serviços adicionados ao carrinho
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {items
            .filter(item => !item.title.toLowerCase().includes('domínio'))
            .map((item) => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <div className="mt-2 text-muted-foreground">
                      <p>Quantidade: {item.quantity}</p>
                      <p>Preço unitário: {formatPrice(item.basePrice)}</p>
                      <p>Total: {formatPrice(item.price)}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default CartItems;
