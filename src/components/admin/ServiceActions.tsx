
import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Ban, Check, Edit, MoreHorizontal, Power, Trash } from 'lucide-react';

interface ServiceActionsProps {
  serviceId: string;
  serviceName: string;
  status: string;
  onActionComplete?: () => void;
}

const ServiceActions = ({ serviceId, serviceName, status, onActionComplete }: ServiceActionsProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  
  const handleDeleteService = async () => {
    try {
      const { error } = await supabase
        .from('client_services')
        .delete()
        .eq('id', serviceId);

      if (error) throw error;
      
      toast.success(`Serviço "${serviceName}" foi excluído com sucesso`);
      onActionComplete?.();
    } catch (error: any) {
      toast.error(`Erro ao excluir serviço: ${error.message}`);
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleUpdateServiceStatus = async (newStatus: string) => {
    try {
      const { error } = await supabase
        .from('client_services')
        .update({ 
          status: newStatus 
        })
        .eq('id', serviceId);

      if (error) throw error;
      
      toast.success(`Status do serviço alterado para ${newStatus}`);
      onActionComplete?.();
    } catch (error: any) {
      toast.error(`Erro ao atualizar status do serviço: ${error.message}`);
    } finally {
      setSuspendDialogOpen(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {status !== 'active' && (
            <DropdownMenuItem onClick={() => handleUpdateServiceStatus('active')}>
              <Check className="mr-2 h-4 w-4" />
              <span>Ativar serviço</span>
            </DropdownMenuItem>
          )}
          
          {status !== 'suspended' && (
            <DropdownMenuItem onClick={() => setSuspendDialogOpen(true)}>
              <Ban className="mr-2 h-4 w-4" />
              <span>Suspender serviço</span>
            </DropdownMenuItem>
          )}
          
          {status !== 'cancelled' && (
            <DropdownMenuItem onClick={() => handleUpdateServiceStatus('cancelled')}>
              <Power className="mr-2 h-4 w-4" />
              <span>Cancelar serviço</span>
            </DropdownMenuItem>
          )}
          
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => setDeleteDialogOpen(true)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash className="mr-2 h-4 w-4" />
            <span>Excluir serviço</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O serviço "{serviceName}" será excluído permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteService}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suspender serviço?</AlertDialogTitle>
            <AlertDialogDescription>
              O serviço "{serviceName}" ficará inacessível para o cliente até que seja reativado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleUpdateServiceStatus('suspended')}>
              Suspender
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ServiceActions;
