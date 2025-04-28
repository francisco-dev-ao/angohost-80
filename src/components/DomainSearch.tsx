import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Search, Check } from "lucide-react";
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from "@/utils/formatters";

interface DomainResult {
  domain: string;
  available: boolean;
  price: number;
}

const DomainSearch = () => {
  const [domain, setDomain] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<DomainResult[]>([]);
  const { addToCart } = useCart();
  
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
        { ext: '.co.ao', price: 199900 },
        { ext: '.ao', price: 149900 },
        { ext: '.it.ao', price: 179900 },
        { ext: '.org.ao', price: 159900 },
        { ext: '.edu.ao', price: 169900 },
      ];
      
      const searchResults = extensions.map(ext => ({
        domain: `${baseSearch}${ext.ext}`,
        available: Math.random() > 0.3,
        price: ext.price
      }));
      
      setResults(searchResults);
      setIsSearching(false);
    }, 800);
  };
  
  const handleAddDomain = (domain: string, price: number) => {
    addToCart({
      id: `domain-${domain}`,
      title: `Domínio ${domain}`,
      quantity: 1,
      price: price,
      basePrice: price,
    });
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
          {isSearching ? "Pesquisando..." : "Verificar"}
        </Button>
      </form>

      {results.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-medium">Resultados da pesquisa</h3>
          <div className="bg-white rounded-lg shadow-md divide-y">
            {results.map((result) => (
              <div 
                key={result.domain} 
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="space-y-1">
                  <p className="font-medium">{result.domain}</p>
                  <p className={`text-sm ${result.available ? "text-green-600" : "text-red-600"} flex items-center gap-1`}>
                    {result.available ? (
                      <>
                        <Check className="h-4 w-4" />
                        Disponível
                      </>
                    ) : (
                      'Indisponível'
                    )}
                  </p>
                </div>
                {result.available ? (
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(result.price)}</p>
                      <p className="text-sm text-muted-foreground">por ano</p>
                    </div>
                    <Button 
                      onClick={() => handleAddDomain(result.domain, result.price)}
                      variant="default"
                      size="sm"
                    >
                      Selecionar
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled
                  >
                    Não disponível
                  </Button>
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
