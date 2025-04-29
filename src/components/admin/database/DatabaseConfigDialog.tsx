
import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import ConnectionForm from './ConnectionForm';
import ConnectionStatusDisplay from './ConnectionStatusDisplay';
import DialogActions from './DialogActions';
import { useDatabase } from '@/hooks/useDatabase';

interface DatabaseConfigDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const DatabaseConfigDialog = ({ isOpen, onOpenChange }: DatabaseConfigDialogProps) => {
  const { 
    username, 
    password, 
    isConnecting,
    connectionStatus,
    setUsername,
    setPassword,
    handleTestConnection,
    handleSaveConfig,
    loadStoredCredentials
  } = useDatabase();

  // Load stored credentials when dialog opens
  useEffect(() => {
    if (isOpen) {
      loadStoredCredentials();
    }
  }, [isOpen, loadStoredCredentials]);

  const onSave = async () => {
    const result = await handleSaveConfig();
    if (result.success) {
      onOpenChange(false);
      // In a real implementation, we would need to reload the app or update the connection pool
      setTimeout(() => window.location.reload(), 1500);
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
            onSave={onSave}
            onCancel={() => onOpenChange(false)}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DatabaseConfigDialog;
