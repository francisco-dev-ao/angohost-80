
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Search, Check, ShoppingCart } from "lucide-react";
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
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
  const [selectedDomains, setSelectedDomains] = useState<{[key: string]: boolean}>({});
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
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
  
  const handleSelectDomain = (domain: string, price: number) => {
    setSelectedDomains(prev => ({
      ...prev,
      [domain]: !prev[domain]
    }));
    
    if (!selectedDomains[domain]) {
      addToCart({
        id: `domain-${domain}`,
        title: `Domínio ${domain}`,
        quantity: 1,
        price: price,
        basePrice: price,
      });
      toast.success(`${domain} adicionado ao carrinho!`);
    } else {
      // Não estamos implementando remover do carrinho no momento
      // O usuário pode remover na página de carrinho
    }
  };

  const handleContinueToCheckout = () => {
    navigate('/checkout');
  };

  const handleAddAllToCart = () => {
    const availableDomains = results.filter(result => result.available);
    
    availableDomains.forEach(domain => {
      if (!selectedDomains[domain.domain]) {
        addToCart({
          id: `domain-${domain.domain}`,
          title: `Domínio ${domain.domain}`,
          quantity: 1,
          price: domain.price,
          basePrice: domain.price,
        });
        setSelectedDomains(prev => ({
          ...prev,
          [domain.domain]: true
        }));
      }
    });
    
    toast.success(`${availableDomains.length} domínios adicionados ao carrinho!`);
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
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Resultados da pesquisa</h3>
            <Button variant="outline" size="sm" onClick={handleAddAllToCart}>
              Adicionar todos disponíveis
            </Button>
          </div>
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
                      onClick={() => handleSelectDomain(result.domain, result.price)}
                      variant={selectedDomains[result.domain] ? "secondary" : "default"}
                      size="sm"
                    >
                      {selectedDomains[result.domain] ? "Adicionado" : "Adicionar"}
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
          
          <div className="flex justify-end mt-6">
            <Button onClick={() => navigate('/cart')} className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Finalizar Compra
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DomainSearch;
