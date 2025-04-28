
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, ExternalLink, Pause, Play, Trash, Edit } from 'lucide-react';

interface ServiceActionMenuProps {
  serviceId: string;
  status: string;
  controlPanelUrl?: string;
  onToggleStatus: () => void;
  onDelete: () => void;
  onAccessControlPanel: () => void;
}

const ServiceActionMenu = ({ 
  serviceId, 
  status, 
  controlPanelUrl,
  onToggleStatus,
  onDelete,
  onAccessControlPanel,
}: ServiceActionMenuProps) => {
  return (
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
          <DropdownMenuItem onClick={onAccessControlPanel}>
            <ExternalLink className="mr-2 h-4 w-4" /> Acessar cPanel
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => window.location.href = `/admin/hosting/edit/${serviceId}`}>
          <Edit className="mr-2 h-4 w-4" /> Editar Serviço
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onToggleStatus}>
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
          onClick={onDelete}
          className="text-red-600 focus:text-red-600"
        >
          <Trash className="mr-2 h-4 w-4" /> Excluir Serviço
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ServiceActionMenu;
