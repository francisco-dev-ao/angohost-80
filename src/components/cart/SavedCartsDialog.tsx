
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SavedCartsList from './SavedCartsList';

interface SavedCartsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SavedCartsDialog = ({ isOpen, onClose }: SavedCartsDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[500px]">
        <DialogHeader>
          <DialogTitle>Meus Carrinhos Salvos</DialogTitle>
        </DialogHeader>
        
        <SavedCartsList onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default SavedCartsDialog;
