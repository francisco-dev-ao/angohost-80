
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface StatusConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  status: string;
}

const StatusConfirmDialog = ({ 
  isOpen, 
  onOpenChange, 
  onConfirm, 
  status 
}: StatusConfirmDialogProps) => {
  const isActive = status === 'active';
  
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isActive ? 'Suspender serviço?' : 'Ativar serviço?'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isActive 
              ? 'O serviço será temporariamente suspenso e o cliente não terá acesso.'
              : 'O serviço será reativado e o cliente terá acesso novamente.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {isActive ? 'Suspender' : 'Ativar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default StatusConfirmDialog;
