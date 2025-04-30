
import React from 'react';
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DialogActionsProps {
  onTest: () => Promise<boolean>;
  onSave: () => Promise<boolean>;
  onCancel: () => void;
  isConnecting: boolean;
}

const DialogActions = ({ 
  onTest, 
  onSave, 
  onCancel,
  isConnecting 
}: DialogActionsProps) => {
  return (
    <DialogFooter>
      <Button 
        onClick={onTest} 
        disabled={isConnecting}
        variant="outline"
        type="button"
        className="border-blue-400 text-blue-600 hover:bg-blue-50"
      >
        {isConnecting ? "Testando..." : "Testar Conexão"}
      </Button>
      <Button 
        onClick={onCancel} 
        variant="outline"
        type="button"
      >
        Cancelar
      </Button>
      <Button 
        onClick={onSave} 
        disabled={isConnecting}
        type="button"
        className="bg-blue-600 hover:bg-blue-700"
      >
        {isConnecting ? "Salvando..." : "Salvar Configuração"}
      </Button>
    </DialogFooter>
  );
};

export default DialogActions;
