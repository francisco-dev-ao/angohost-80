
import React from "react";
import { Button } from "@/components/ui/button";

interface HostingHeaderProps {
  totalServices: number;
}

const HostingHeader = ({ totalServices }: HostingHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Hospedagem</h2>
        <p className="text-muted-foreground">
          Gerenciar serviços de hospedagem
        </p>
      </div>
      <Button onClick={() => window.location.href = "/admin/hosting/create"}>
        Criar Novo Serviço
      </Button>
    </div>
  );
};

export default HostingHeader;
