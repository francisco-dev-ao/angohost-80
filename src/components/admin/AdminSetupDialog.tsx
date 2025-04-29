
import React, { useState, useEffect } from 'react';
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
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface AdminSetupDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultEmail?: string;
}

const AdminSetupDialog = ({ isOpen, onOpenChange, defaultEmail = "support@angohost.ao" }: AdminSetupDialogProps) => {
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("AngoHost@2025");
  const [isAdminConfigured, setIsAdminConfigured] = useState(false);
  const { ensureAdminExists, isLoading } = useAdminSetupUtil();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('email')
          .eq('email', defaultEmail)
          .eq('role', 'admin')
          .maybeSingle();
          
        setIsAdminConfigured(!!data);
      } catch (error) {
        console.error("Erro ao verificar status do admin:", error);
      }
    };
    
    if (isOpen) {
      checkAdminStatus();
    }
  }, [isOpen, defaultEmail]);

  const handleSetup = async () => {
    if (isAdminConfigured) {
      toast.info('O super administrador já está configurado.');
      onOpenChange(false);
      return;
    }
    
    await ensureAdminExists(email, password);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configuração do Sistema AngoHost</DialogTitle>
          <DialogDescription>
            {isAdminConfigured 
              ? 'O super administrador já está configurado no sistema.' 
              : 'Configure o usuário principal com acesso completo a todas as funcionalidades do sistema.'}
          </DialogDescription>
        </DialogHeader>
        {!isAdminConfigured && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="setup-email" className="text-right">
                Email
              </Label>
              <Input
                id="setup-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="setup-password" className="text-right">
                Senha
              </Label>
              <Input
                id="setup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="col-span-3"
              />
            </div>
            {isAdminConfigured && (
              <div className="bg-green-50 text-green-800 p-3 rounded border border-green-200">
                O usuário administrador já existe no sistema.
              </div>
            )}
          </div>
        )}
        <DialogFooter>
          {isAdminConfigured ? (
            <Button onClick={() => onOpenChange(false)}>
              OK
            </Button>
          ) : (
            <>
              <Button onClick={() => onOpenChange(false)} variant="outline">
                Cancelar
              </Button>
              <Button onClick={handleSetup} disabled={isLoading}>
                {isLoading ? "Configurando..." : "Configurar Super Admin"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminSetupDialog;
