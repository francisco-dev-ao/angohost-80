
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import DomainSearch from '@/components/DomainSearch';
import { useCart } from '@/contexts/CartContext';
import { useOwnership } from '@/contexts/OwnershipContext';

interface DomainStepProps {
  prevStep: () => void;
  nextStep: () => void;
}

const DomainStep = ({ prevStep, nextStep }: DomainStepProps) => {
  const { items } = useCart();
  const { profiles } = useOwnership();
  const [allDomainsHaveOwnership, setAllDomainsHaveOwnership] = useState(false);
  
  // Verificar se todos os domínios já têm titularidade definida
  useEffect(() => {
    // Filtra os itens que são domínios
    const domainItems = items.filter(item => item.type === 'domain');
    
    if (domainItems.length === 0) {
      // Se não há domínios, consideramos que não precisa de titularidade
      setAllDomainsHaveOwnership(true);
      return;
    }
    
    // Verifica se todos os domínios têm contactProfileId ou ownershipData definido
    const allHaveOwnership = domainItems.every(item => item.contactProfileId || item.ownershipData);
    setAllDomainsHaveOwnership(allHaveOwnership);
  }, [items]);
  
  // Pular este passo automaticamente se todos os domínios já têm titularidade
  useEffect(() => {
    if (allDomainsHaveOwnership) {
      // Podemos usar um pequeno delay para garantir que o usuário veja brevemente a tela
      const timer = setTimeout(() => {
        nextStep();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [allDomainsHaveOwnership, nextStep]);
  
  if (allDomainsHaveOwnership) {
    return (
      <div className="flex justify-center items-center py-8">
        <p>Redirecionando para o próximo passo...</p>
      </div>
    );
  }

  return (
    <>
      <CardTitle className="mb-4">Domínios</CardTitle>
      <CardDescription className="mb-6">
        Pesquise e adicione domínios ao seu pedido
      </CardDescription>
      
      <div className="mb-6">
        <DomainSearch />
      </div>
      
      <div className="flex justify-between mt-6">
        <Button 
          type="button" 
          variant="outline" 
          onClick={prevStep}
        >
          Voltar
        </Button>
        <Button 
          type="button" 
          onClick={nextStep}
        >
          Próximo
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </>
  );
};

export default DomainStep;
