
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
import { ChevronDown, ExternalLink, Pause, Play, Trash, Edit } from 'lucide-react';

interface ServiceActionsProps {
  serviceId: string;
  status: string;
  controlPanelUrl?: string;
}

const ServiceActions = ({ serviceId, status, controlPanelUrl }: ServiceActionsProps) => {
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleToggleStatus = async () => {
    try {
      const newStatus = status === 'active' ? 'suspended' : 'active';
      const { error } = await supabase
        .from('client_services')
        .update({ status: newStatus })
        .eq('id', serviceId);

      if (error) throw error;
      
      toast.success(`Serviço ${newStatus === 'active' ? 'ativado' : 'suspenso'} com sucesso`);
    } catch (error: any) {
      toast.error(`Erro ao alterar status do serviço: ${error.message}`);
    } finally {
      setSuspendDialogOpen(false);
    }
  };

  const handleDeleteService = async () => {
    try {
      const { error } = await supabase
        .from('client_services')
        .delete()
        .eq('id', serviceId);

      if (error) throw error;
      
      toast.success('Serviço excluído com sucesso');
    } catch (error: any) {
      toast.error(`Erro ao excluir serviço: ${error.message}`);
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const accessControlPanel = () => {
    if (controlPanelUrl) {
      window.open(controlPanelUrl, '_blank');
    } else {
      toast.error('URL do painel de controle não disponível');
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menu</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {controlPanelUrl && (
            <DropdownMenuItem onClick={accessControlPanel}>
              <ExternalLink className="mr-2 h-4 w-4" /> Acessar cPanel
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => window.location.href = `/admin/hosting/edit/${serviceId}`}>
            <Edit className="mr-2 h-4 w-4" /> Editar Serviço
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSuspendDialogOpen(true)}>
            {status === 'active' ? (
              <>
                <Pause className="mr-2 h-4 w-4" /> Suspender
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" /> Ativar
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => setDeleteDialogOpen(true)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash className="mr-2 h-4 w-4" /> Excluir Serviço
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {status === 'active' ? 'Suspender serviço?' : 'Ativar serviço?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {status === 'active' 
                ? 'O serviço será temporariamente suspenso e o cliente não terá acesso.'
                : 'O serviço será reativado e o cliente terá acesso novamente.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleToggleStatus}>
              {status === 'active' ? 'Suspender' : 'Ativar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir serviço?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O serviço será permanentemente excluído.
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
    </>
  );
};

export default ServiceActions;
