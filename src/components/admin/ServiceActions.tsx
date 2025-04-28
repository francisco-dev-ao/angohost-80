
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ServiceActionMenu from './hosting/ServiceActionMenu';
import StatusConfirmDialog from './hosting/StatusConfirmDialog';
import DeleteConfirmDialog from './hosting/DeleteConfirmDialog';

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
      <ServiceActionMenu
        serviceId={serviceId}
        status={status}
        controlPanelUrl={controlPanelUrl}
        onToggleStatus={() => setSuspendDialogOpen(true)}
        onDelete={() => setDeleteDialogOpen(true)}
        onAccessControlPanel={accessControlPanel}
      />

      <StatusConfirmDialog
        isOpen={suspendDialogOpen}
        onOpenChange={setSuspendDialogOpen}
        onConfirm={handleToggleStatus}
        status={status}
      />

      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteService}
      />
    </>
  );
};

export default ServiceActions;
