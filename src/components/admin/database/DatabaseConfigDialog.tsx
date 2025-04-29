
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import { testConnection } from '@/integrations/mysql/client';

import ConnectionForm from './ConnectionForm';
import ConnectionStatusDisplay from './ConnectionStatusDisplay';
import DialogActions from './DialogActions';

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
        
        <ConnectionForm
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
        />
        
        {connectionStatus && (
          <ConnectionStatusDisplay connectionStatus={connectionStatus} />
        )}
        
        <DialogFooter>
          <DialogActions
            isConnecting={isConnecting}
            onTest={handleTestConnection}
            onSave={handleSaveConfig}
            onCancel={() => onOpenChange(false)}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DatabaseConfigDialog;
