
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PurchaseDialogProps {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  userCount: number;
  handleUserCountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  period: string;
  setPeriod: (period: string) => void;
  selectedPlan: { title: string; basePrice: number } | null;
  calculatePrice: (basePrice: number) => string;
  onConfirm: () => void;
}

const PurchaseDialog = ({
  showDialog,
  setShowDialog,
  userCount,
  handleUserCountChange,
  period,
  setPeriod,
  selectedPlan,
  calculatePrice,
  onConfirm,
}: PurchaseDialogProps) => {
  if (!selectedPlan) return null;

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{selectedPlan.title}</DialogTitle>
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
              value={userCount}
              onChange={handleUserCountChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="period" className="text-right">
              Período
            </Label>
            <Select
              value={period}
              onValueChange={setPeriod}
            >
              <SelectTrigger className="col-span-3">
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
              {calculatePrice(selectedPlan.basePrice)}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowDialog(false)}>
            Cancelar
          </Button>
          <Button onClick={onConfirm}>Adicionar ao Carrinho</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseDialog;
