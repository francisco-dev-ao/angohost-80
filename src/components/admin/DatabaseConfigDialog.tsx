
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
import { testConnection } from '@/integrations/mysql/client';

interface DatabaseConfigDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const DatabaseConfigDialog = ({ isOpen, onOpenChange }: DatabaseConfigDialogProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('Bayathu60@@'); // Senha padrão definida
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<any>(null);

  // Load stored credentials when dialog opens
  useEffect(() => {
    if (isOpen) {
      const storedCredentials = localStorage.getItem('db_credentials');
      if (storedCredentials) {
        try {
          const credentials = JSON.parse(storedCredentials);
          if (credentials.username) setUsername(credentials.username);
          if (credentials.password) setPassword(credentials.password);
        } catch (error) {
          console.error('Error parsing stored credentials:', error);
        }
      }
    }
  }, [isOpen]);

  const handleTestConnection = async () => {
    setIsConnecting(true);
    try {
      // Save the credentials temporarily for testing
      localStorage.setItem('db_credentials', JSON.stringify({
        username,
        password,
        timestamp: new Date().toISOString()
      }));
      
      // Test the connection
      const result = await testConnection();
      setConnectionStatus(result);
      
      if (result.success) {
        toast.success('Conexão bem sucedida ao banco de dados!');
      } else {
        toast.error(`Erro ao conectar: ${result.message}`);
      }
    } catch (error: any) {
      console.error('Error testing database connection:', error);
      setConnectionStatus({
        success: false,
        message: `Erro: ${error.message}`
      });
      toast.error(`Erro ao testar conexão: ${error.message}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSaveConfig = async () => {
    if (!username || !password) {
      toast.error('Nome de usuário e senha são obrigatórios');
      return;
    }

    setIsConnecting(true);
    try {
      localStorage.setItem('db_credentials', JSON.stringify({
        username,
        password,
        timestamp: new Date().toISOString()
      }));
      
      const result = await testConnection();
      
      if (result.success) {
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
      <DialogContent className="sm:max-w-[500px]">
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
          
          {connectionStatus && (
            <div className={`p-4 rounded-md border ${connectionStatus.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <p className={connectionStatus.success ? 'text-green-800' : 'text-red-800'}>
                {connectionStatus.message}
              </p>
              {connectionStatus.success && (
                <>
                  <p className="text-sm text-green-700 mt-1">
                    Timestamp do servidor: {connectionStatus.timestamp}
                  </p>
                  {connectionStatus.version && (
                    <p className="text-sm text-green-700">
                      Versão MySQL: {connectionStatus.version}
                    </p>
                  )}
                </>
              )}
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            onClick={handleTestConnection} 
            disabled={isConnecting}
            variant="outline"
          >
            {isConnecting ? "Testando..." : "Testar Conexão"}
          </Button>
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Cancelar
          </Button>
          <Button onClick={handleSaveConfig} disabled={isConnecting}>
            {isConnecting ? "Salvando..." : "Salvar Configuração"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DatabaseConfigDialog;
