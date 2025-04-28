
import React, { useState } from 'react';
import { useAdminSetup } from '@/hooks/useAdminSetup';
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

interface AdminSetupDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultEmail?: string;
}

const AdminSetupDialog = ({ 
  isOpen, 
  onOpenChange,
  defaultEmail = "support@angohost.ao"
}: AdminSetupDialogProps) => {
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("AngoHost@2025");
  const { setupSupportAdmin, isLoading } = useAdminSetup();

  const handleSetup = async () => {
    await setupSupportAdmin(email, password);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configurar Administrador do Sistema</DialogTitle>
          <DialogDescription>
            Configure um usuário administrador para gerenciar o sistema completo.
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
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
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
            {isLoading ? "Configurando..." : "Configurar Administrador"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminSetupDialog;
