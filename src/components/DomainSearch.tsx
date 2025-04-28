
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Search } from "lucide-react";

interface DomainResult {
  domain: string;
  available: boolean;
  price: number;
}

const DomainSearch = () => {
  const [domain, setDomain] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<DomainResult[]>([]);
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!domain) {
      toast.error("Por favor, digite um domínio para pesquisar.");
      return;
    }
    
    setIsSearching(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const baseSearch = domain.includes('.') ? domain.split('.')[0] : domain;
      const extensions = [
        { ext: '.com.br', available: Math.random() > 0.5, price: 39.9 },
        { ext: '.com', available: Math.random() > 0.3, price: 29.9 },
        { ext: '.net', available: Math.random() > 0.2, price: 34.9 },
        { ext: '.org', available: Math.random() > 0.7, price: 44.9 },
        { ext: '.info', available: true, price: 19.9 },
      ];
      
      const searchResults = extensions.map(ext => ({
        domain: `${baseSearch}${ext.ext}`,
        available: ext.available,
        price: ext.price
      }));
      
      setResults(searchResults);
      setIsSearching(false);
    }, 1500);
  };
  
  const addToCart = (domain: string, price: number) => {
    toast.success(`${domain} adicionado ao carrinho!`);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Digite o nome do seu domínio..."
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" disabled={isSearching}>
          {isSearching ? "Pesquisando..." : "Pesquisar"}
        </Button>
      </form>

      {results.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-medium">Resultados da pesquisa</h3>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {results.map((result) => (
              <div 
                key={result.domain} 
                className="flex items-center justify-between p-4 border-b last:border-b-0"
              >
                <div>
                  <p className="font-medium">{result.domain}</p>
                  <p className={`text-sm ${result.available ? "text-green-600" : "text-red-600"}`}>
                    {result.available ? "Disponível" : "Indisponível"}
                  </p>
                </div>
                {result.available && (
                  <div className="flex items-center gap-4">
                    <p className="font-medium">R$ {result.price.toFixed(2)}/ano</p>
                    <Button 
                      onClick={() => addToCart(result.domain, result.price)}
                      variant="default"
                      size="sm"
                    >
                      Adicionar
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DomainSearch;
