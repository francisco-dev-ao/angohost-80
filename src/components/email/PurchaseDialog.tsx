
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatPrice } from "@/utils/formatters";

interface PurchaseDialogProps {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  userCount: number;
  handleUserCountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  period: string;
  setPeriod: (period: string) => void;
  selectedPlan: { title: string; basePrice: number; } | null;
  calculatePrice: (basePrice: number) => string;
  onConfirm: () => void;
}

const PurchaseDialog: React.FC<PurchaseDialogProps> = ({
  showDialog,
  setShowDialog,
  userCount,
  handleUserCountChange,
  period,
  setPeriod,
  selectedPlan,
  calculatePrice,
  onConfirm,
}) => {
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configurar plano</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <Label htmlFor="userCountDialog">Número de usuários (1-1000)</Label>
            <Input
              id="userCountDialog"
              type="number"
              min="1"
              max="1000"
              value={userCount}
              onChange={handleUserCountChange}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="period">Período de contratação</Label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger id="period" className="mt-2">
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
          {selectedPlan && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Preço total:</p>
              <p className="text-lg font-semibold">
                {calculatePrice(selectedPlan.basePrice)}
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowDialog(false)}>
            Cancelar
          </Button>
          <Button onClick={onConfirm}>
            Continuar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseDialog;
