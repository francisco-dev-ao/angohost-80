
import React from 'react';
import { Button } from "@/components/ui/button";

interface DialogActionsProps {
  isConnecting: boolean;
  onTest: () => void;
  onSave: () => void;
  onCancel: () => void;
}

const DialogActions = ({ 
  isConnecting, 
  onTest, 
  onSave, 
  onCancel 
}: DialogActionsProps) => {
  return (
    <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
      <Button 
        onClick={onTest} 
        disabled={isConnecting}
        variant="outline"
      >
        {isConnecting ? "Testando..." : "Testar Conexão"}
      </Button>
      <Button onClick={onCancel} variant="outline">
        Cancelar
      </Button>
      <Button onClick={onSave} disabled={isConnecting}>
        {isConnecting ? "Salvando..." : "Salvar Configuração"}
      </Button>
    </div>
  );
};

export default DialogActions;
