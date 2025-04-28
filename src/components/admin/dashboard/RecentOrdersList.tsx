
import { Order } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Eye, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "@/utils/formatters";

interface RecentOrdersListProps {
  orders: Order[];
}

const RecentOrdersList = ({ orders }: RecentOrdersListProps) => {
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800">Processando</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Concluído</Badge>;
      case "canceled":
        return <Badge className="bg-red-100 text-red-800">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pedidos Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between border-b pb-2"
              >
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm", {
                      locale: ptBR,
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div>{formatPrice(order.totalAmount)}</div>
                  <div>{getStatusBadge(order.status)}</div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/admin/orders?id=${order.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/admin/orders")}
            >
              Ver Todos os Pedidos
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <ShoppingCart className="h-12 w-12 text-muted-foreground/50 mb-2" />
            <p>Nenhum pedido recente encontrado</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentOrdersList;
