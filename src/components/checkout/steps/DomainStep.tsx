
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import DomainSearch from '@/components/DomainSearch';

interface DomainStepProps {
  prevStep: () => void;
  nextStep: () => void;
}

const DomainStep = ({ prevStep, nextStep }: DomainStepProps) => {
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
