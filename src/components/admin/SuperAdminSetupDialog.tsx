
import React, { useState } from 'react';
import { useAdminSetupUtil } from '@/hooks/useAdminSetupUtil';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SuperAdminSetupDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const SuperAdminSetupDialog = ({ isOpen, onOpenChange }: SuperAdminSetupDialogProps) => {
  const [email] = useState("support@angohost.ao");
  const [password, setPassword] = useState("AngoHost@2025");
  const { ensureAdminExists, isLoading } = useAdminSetupUtil();

  const handleSetup = async () => {
    await ensureAdminExists(email, password);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configurar Super Administrador do Sistema</DialogTitle>
          <DialogDescription>
            Configure o usuário principal com acesso completo a todas as funcionalidades do sistema.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              value={email}
              readOnly
              className="col-span-3 bg-gray-100"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Cancelar
          </Button>
          <Button onClick={handleSetup} disabled={isLoading}>
            {isLoading ? "Configurando..." : "Configurar Super Admin"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SuperAdminSetupDialog;
