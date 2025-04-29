
import { formatPrice } from '@/utils/formatters';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface CartStatisticsProps {
  cartsCount: number;
  totalValue: number;
}

export const CartStatistics = ({ cartsCount, totalValue }: CartStatisticsProps) => {
  const averageValue = cartsCount > 0 ? totalValue / cartsCount : 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">{cartsCount}</CardTitle>
          <CardDescription>Carrinhos abandonados</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">{formatPrice(totalValue)}</CardTitle>
          <CardDescription>Valor total</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">{formatPrice(averageValue)}</CardTitle>
          <CardDescription>Valor médio</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};
