
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPrice } from "@/utils/formatters";
import { Check } from "lucide-react";

interface EmailPlanDialogProps {
  selectedPlan: any;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (config: { userCount: number; period: string }) => void;
}

const EmailPlanDialog = ({
  selectedPlan,
  isOpen,
  onClose,
  onConfirm,
}: EmailPlanDialogProps) => {
  const [config, setConfig] = useState({
    userCount: 1,
    period: "1",
  });

  const handleUserCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 1000) {
      setConfig(prev => ({ ...prev, userCount: value }));
    }
  };

  const calculatePrice = () => {
    return formatPrice(selectedPlan.basePrice * config.userCount * parseInt(config.period));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{selectedPlan?.title}</DialogTitle>
          <DialogDescription>
            Configure o seu plano de email profissional
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="users" className="text-right">
              Usuários
            </Label>
            <Input
              id="users"
              type="number"
              min="1"
              max="1000"
              value={config.userCount}
              onChange={handleUserCountChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="period" className="text-right">
              Período
            </Label>
            <Select
              value={config.period}
              onValueChange={(value) => setConfig(prev => ({ ...prev, period: value }))}
            >
              <SelectTrigger id="period" className="col-span-3">
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 ano</SelectItem>
                <SelectItem value="2">2 anos</SelectItem>
                <SelectItem value="3">3 anos</SelectItem>
                <SelectItem value="4">4 anos</SelectItem>
                <SelectItem value="5">5 anos</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Preço Total</Label>
            <div className="col-span-3 font-medium">
              {calculatePrice()}
            </div>
          </div>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Recursos incluídos:</h3>
          <ul className="space-y-1.5">
            {selectedPlan.features.map((feature: any, index: number) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                {feature.included ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <span className="h-4 w-4 block" />
                )}
                {feature.text}
              </li>
            ))}
          </ul>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={() => onConfirm(config)}>
            Adicionar ao Carrinho
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmailPlanDialog;
