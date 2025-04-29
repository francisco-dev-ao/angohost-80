
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RotateCw } from "lucide-react";

interface CartHeaderProps {
  timeRange: string;
  setTimeRange: (value: string) => void;
  onRefresh: () => void;
}

export const CartHeader = ({ timeRange, setTimeRange, onRefresh }: CartHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Carrinhos Abandonados</h2>
        <p className="text-muted-foreground">
          Gerencie e recupere carrinhos abandonados pelos clientes
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Últimos 7 dias</SelectItem>
            <SelectItem value="30d">Últimos 30 dias</SelectItem>
            <SelectItem value="90d">Últimos 90 dias</SelectItem>
            <SelectItem value="365d">Último ano</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={onRefresh}>
          <RotateCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>
    </div>
  );
};
