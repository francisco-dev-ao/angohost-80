
import { useState, useEffect } from 'react';
import { testConnection } from '@/integrations/mysql/client';
import { toast } from 'sonner';

interface ConnectionCredentials {
  username: string;
  password: string;
}

interface ConnectionStatus {
  success: boolean;
  message: string;
  timestamp?: string;
  version?: string;
}

export const useDatabase = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('Bayathu60@@');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus | null>(null);

  // Load stored credentials on mount
  useEffect(() => {
    loadStoredCredentials();
  }, []);

  const loadStoredCredentials = () => {
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
  };

  const saveCredentials = (credentials: ConnectionCredentials) => {
    localStorage.setItem('db_credentials', JSON.stringify({
      ...credentials,
      timestamp: new Date().toISOString()
    }));
  };

  const handleTestConnection = async () => {
    setIsConnecting(true);
    try {
      // Save the credentials temporarily for testing
      saveCredentials({ username, password });
      
      // Test the connection
      const result = await testConnection();
      setConnectionStatus(result);
      
      if (result.success) {
        toast.success('Conexão bem sucedida ao banco de dados!');
      } else {
        toast.error(`Erro ao conectar: ${result.message}`);
      }
      
      return result;
    } catch (error: any) {
      console.error('Error testing database connection:', error);
      const errorStatus = {
        success: false,
        message: `Erro: ${error.message}`
      };
      setConnectionStatus(errorStatus);
      toast.error(`Erro ao testar conexão: ${error.message}`);
      return errorStatus;
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSaveConfig = async () => {
    if (!username || !password) {
      toast.error('Nome de usuário e senha são obrigatórios');
      return { success: false };
    }

    setIsConnecting(true);
    try {
      saveCredentials({ username, password });
      
      const result = await testConnection();
      
      if (result.success) {
        toast.success('Configurações de banco de dados salvas com sucesso!');
        // In a real implementation, we would need to reload the app or update the connection pool
        return { success: true, needsReload: true };
      } else {
        toast.error('Erro ao conectar ao banco de dados. Verifique as credenciais.');
        return { success: false };
      }
    } catch (error: any) {
      console.error('Error saving database config:', error);
      toast.error('Erro ao salvar configurações');
      return { success: false };
    } finally {
      setIsConnecting(false);
    }
  };

  return {
    username,
    password,
    isConnecting,
    connectionStatus,
    setUsername,
    setPassword,
    handleTestConnection,
    handleSaveConfig,
    loadStoredCredentials
  };
};
