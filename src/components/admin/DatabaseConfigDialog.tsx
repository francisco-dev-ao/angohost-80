
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

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
        
        {!credentials.username && (
          <Alert variant="destructive" className="bg-amber-50 border-amber-200 text-amber-800 my-2">
            <AlertTriangle className="h-4 w-4 text-amber-800 mr-2" />
            <AlertDescription>
              O site precisa de credenciais válidas para se conectar ao banco de dados. 
              Por favor, insira seu nome de usuário e senha MySQL abaixo.
            </AlertDescription>
          </Alert>
        )}
        
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
