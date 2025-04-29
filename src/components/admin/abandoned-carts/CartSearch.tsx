
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface CartSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export const CartSearch = ({ searchTerm, setSearchTerm }: CartSearchProps) => {
  return (
    <div className="flex items-center mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por e-mail ou nome do cliente..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};
