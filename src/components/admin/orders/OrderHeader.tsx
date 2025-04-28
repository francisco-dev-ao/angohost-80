
import { PlusCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface OrderHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setIsOrderFormOpen: (open: boolean) => void;
}

const OrderHeader = ({ searchQuery, setSearchQuery, setIsOrderFormOpen }: OrderHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Gerenciar Pedidos</h1>
      <div className="flex space-x-2">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Pesquisar pedidos..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsOrderFormOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Pedido
        </Button>
      </div>
    </div>
  );
};

export default OrderHeader;
