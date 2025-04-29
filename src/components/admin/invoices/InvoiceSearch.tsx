
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface InvoiceSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const InvoiceSearch = ({ searchTerm, onSearchChange }: InvoiceSearchProps) => {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Buscar fatura por número..."
        className="pl-8"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default InvoiceSearch;
