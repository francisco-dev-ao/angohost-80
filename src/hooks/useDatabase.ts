
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { testConnection } from '@/integrations/mysql/client';

export interface DatabaseCredentials {
  username: string;
  password: string;
}

export interface ConnectionStatus {
  success?: boolean;
  message?: string;
  timestamp?: string;
  version?: string;
}

export const useDatabase = (onConnectionSuccess?: () => void) => {
  const [credentials, setCredentials] = useState<DatabaseCredentials>({
    username: '',
    password: 'Bayathu60@@', // Default password
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  // Load stored credentials when hook initializes
  useEffect(() => {
    const storedCredentials = localStorage.getItem('db_credentials');
    if (storedCredentials) {
      try {
        const parsed = JSON.parse(storedCredentials);
        setCredentials({
          username: parsed.username || '',
          password: parsed.password || 'Bayathu60@@',
        });
      } catch (error) {
        console.error('Error parsing stored credentials:', error);
      }
    }
  }, []);

  const updateCredential = (field: keyof DatabaseCredentials, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    // Clear validation errors when user types
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateCredentials = (): boolean => {
    const errors: {
      username?: string;
      password?: string;
    } = {};
    
    if (!credentials.username.trim()) {
      errors.username = 'Nome de usuário é obrigatório';
    }
    
    if (!credentials.password.trim()) {
      errors.password = 'Senha é obrigatória';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const testDbConnection = async () => {
    if (!validateCredentials()) {
      return false;
    }

    setIsConnecting(true);
    try {
      // Save the credentials temporarily for testing
      localStorage.setItem('db_credentials', JSON.stringify({
        username: credentials.username,
        password: credentials.password,
        timestamp: new Date().toISOString()
      }));
      
      // Test the connection
      const result = await testConnection();
      setConnectionStatus(result);
      
      if (result.success) {
        toast.success('Conexão bem sucedida ao banco de dados!');
        return true;
      } else {
        toast.error(`Erro ao conectar: ${result.message}`);
        return false;
      }
    } catch (error: any) {
      console.error('Error testing database connection:', error);
      setConnectionStatus({
        success: false,
        message: `Erro: ${error.message}`
      });
      toast.error(`Erro ao testar conexão: ${error.message}`);
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const saveConfiguration = async () => {
    if (!validateCredentials()) {
      return false;
    }

    setIsConnecting(true);
    try {
      localStorage.setItem('db_credentials', JSON.stringify({
        username: credentials.username,
        password: credentials.password,
        timestamp: new Date().toISOString()
      }));
      
      const result = await testConnection();
      
      if (result.success) {
        toast.success('Configurações de banco de dados salvas com sucesso!');
        if (onConnectionSuccess) {
          onConnectionSuccess();
        }
        // In a real implementation, we would need to reload the app or update the connection pool
        setTimeout(() => window.location.reload(), 1500);
        return true;
      } else {
        toast.error('Erro ao conectar ao banco de dados. Verifique as credenciais.');
        return false;
      }
    } catch (error: any) {
      console.error('Error saving database config:', error);
      toast.error('Erro ao salvar configurações');
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  return {
    credentials,
    updateCredential,
    isConnecting,
    connectionStatus,
    testDbConnection,
    saveConfiguration,
    validationErrors,
  };
};
