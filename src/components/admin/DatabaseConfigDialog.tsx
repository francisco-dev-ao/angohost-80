
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ConnectionForm from './database/ConnectionForm';
import ConnectionStatusDisplay from './database/ConnectionStatusDisplay';
import DialogActions from './database/DialogActions';
import { useDatabase } from '@/hooks/useDatabase';

interface DatabaseConfigDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const DatabaseConfigDialog = ({ isOpen, onOpenChange }: DatabaseConfigDialogProps) => {
  const { 
    credentials,
    updateCredential,
    isConnecting,
    connectionStatus,
    testDbConnection,
    saveConfiguration,
    validationErrors
  } = useDatabase(() => onOpenChange(false));
  
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
          username={credentials.username} 
          password={credentials.password} 
          onChange={updateCredential}
          validationErrors={validationErrors}
        />
        
        {connectionStatus && (
          <ConnectionStatusDisplay status={connectionStatus} />
        )}
        
        <DialogActions 
          onTest={testDbConnection} 
          onSave={saveConfiguration} 
          onCancel={() => onOpenChange(false)}
          isConnecting={isConnecting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DatabaseConfigDialog;
