
import React, { useState, useEffect } from 'react';
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
import { initializeDatabase } from '@/integrations/mysql/client';

interface DatabaseConfigDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const DatabaseConfigDialog = ({ isOpen, onOpenChange }: DatabaseConfigDialogProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleSaveConfig = async () => {
    if (!username || !password) {
      toast.error('Nome de usuário e senha são obrigatórios');
      return;
    }

    setIsConnecting(true);
    try {
      // In a production app, you would send this to a secure backend
      // For this demo, we'll just try to initialize the connection
      // Note: This won't actually update the credentials without a backend service
      
      localStorage.setItem('db_credentials', JSON.stringify({
        username,
        password,
        timestamp: new Date().toISOString()
      }));
      
      const connected = await initializeDatabase();
      
      if (connected) {
        toast.success('Configurações de banco de dados salvas com sucesso!');
        onOpenChange(false);
        // In a real implementation, we would need to reload the app or update the connection pool
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast.error('Erro ao conectar ao banco de dados. Verifique as credenciais.');
      }
    } catch (error) {
      console.error('Error saving database config:', error);
      toast.error('Erro ao salvar configurações');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configuração do Banco de Dados</DialogTitle>
          <DialogDescription>
            Configure as credenciais para acessar o banco de dados MySQL
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="host" className="text-right">
              Host
            </Label>
            <Input
              id="host"
              value="194.163.146.215"
              disabled
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="database" className="text-right">
              Banco de Dados
            </Label>
            <Input
              id="database"
              value="angodb11"
              disabled
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Usuário
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
          <Button onClick={handleSaveConfig} disabled={isConnecting}>
            {isConnecting ? "Conectando..." : "Salvar Configuração"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DatabaseConfigDialog;
