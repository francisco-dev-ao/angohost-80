
import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface InvoiceHeaderProps {
  onExport: () => void;
}

const InvoiceHeader = ({ onExport }: InvoiceHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Faturas</h2>
        <p className="text-muted-foreground">
          Gerenciar faturas de clientes
        </p>
      </div>
      <Button onClick={onExport}>
        <Download className="mr-2 h-4 w-4" /> Exportar Relatório
      </Button>
    </div>
  );
};

export default InvoiceHeader;
