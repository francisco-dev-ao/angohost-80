
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { testConnection, resetPool } from '@/integrations/mysql/client';

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
    password: '', 
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  // Carregar credenciais armazenadas quando o hook inicializa
  useEffect(() => {
    try {
      const storedCredentials = localStorage.getItem('db_credentials');
      if (storedCredentials) {
        try {
          const parsed = JSON.parse(storedCredentials);
          setCredentials({
            username: parsed.username || '',
            password: parsed.password || '',
          });
        } catch (error) {
          console.error('Erro ao analisar credenciais armazenadas:', error);
        }
      }
    } catch (error) {
      console.error('Erro ao acessar localStorage:', error);
    }
  }, []);

  const updateCredential = (field: keyof DatabaseCredentials, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    // Limpar erros de validação quando o usuário digita
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
    setConnectionStatus(null); // Limpar resultado anterior
    
    try {
      // Salvar as credenciais temporariamente para teste
      try {
        localStorage.setItem('db_credentials', JSON.stringify({
          username: credentials.username,
          password: credentials.password,
          timestamp: new Date().toISOString()
        }));
        
        // Reset pool para forçar nova conexão com novas credenciais
        resetPool();
      } catch (error) {
        console.error('Erro ao salvar no localStorage:', error);
      }
      
      // Testar a conexão com timeout
      const testPromise = testConnection();
      const timeoutPromise = new Promise<any>((_, reject) => {
        setTimeout(() => reject(new Error('Tempo esgotado ao testar conexão')), 10000);
      });
      
      const result = await Promise.race([testPromise, timeoutPromise]);
      setConnectionStatus(result);
      
      if (result.success) {
        toast.success('Conexão bem sucedida ao banco de dados!');
        return true;
      } else {
        toast.error(`Erro ao conectar: ${result.message}`);
        return false;
      }
    } catch (error: any) {
      console.error('Erro ao testar conexão com banco de dados:', error);
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
      try {
        localStorage.setItem('db_credentials', JSON.stringify({
          username: credentials.username,
          password: credentials.password,
          timestamp: new Date().toISOString()
        }));
        
        // Reset pool para forçar nova conexão com novas credenciais
        resetPool();
      } catch (error) {
        console.error('Erro ao salvar no localStorage:', error);
        toast.error('Erro ao salvar configurações no navegador');
        return false;
      }
      
      // Testar a conexão com timeout
      const testPromise = testConnection();
      const timeoutPromise = new Promise<any>((_, reject) => {
        setTimeout(() => reject(new Error('Tempo esgotado ao testar conexão')), 10000);
      });
      
      const result = await Promise.race([testPromise, timeoutPromise]);
      
      if (result.success) {
        toast.success('Configurações de banco de dados salvas com sucesso!');
        if (onConnectionSuccess) {
          onConnectionSuccess();
        }
        // Em uma implementação real, seria necessário recarregar o app ou atualizar o pool de conexão
        toast.info('A página será recarregada para aplicar as configurações...', {
          duration: 2000
        });
        setTimeout(() => window.location.reload(), 2000);
        return true;
      } else {
        toast.error('Erro ao conectar ao banco de dados. Verifique as credenciais.');
        return false;
      }
    } catch (error: any) {
      console.error('Erro ao salvar configuração de banco de dados:', error);
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
