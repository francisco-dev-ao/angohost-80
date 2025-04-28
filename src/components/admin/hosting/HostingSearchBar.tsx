
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface HostingSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const HostingSearchBar = ({ searchTerm, onSearchChange }: HostingSearchBarProps) => {
  return (
    <div className="flex items-center mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar serviços de hospedagem..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default HostingSearchBar;
