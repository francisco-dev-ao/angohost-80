
import React from "react";
import { Button } from "@/components/ui/button";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, PlusCircle } from "lucide-react";
import { formatPrice } from '@/utils/formatters';
import { CartItem } from '@/contexts/CartContext';

interface ServiceStepProps {
  items: CartItem[];
  prevStep: () => void;
  nextStep: () => void;
}

const ServiceStep = ({ items, prevStep, nextStep }: ServiceStepProps) => {
  return (
    <>
      <CardTitle className="mb-4">Serviços Adicionais</CardTitle>
      <CardDescription className="mb-6">
        Adicione serviços complementares ao seu pedido
      </CardDescription>
      
      <div className="space-y-4">
        {items.filter(item => item.type !== 'domain').map(item => (
          <div key={item.id} className="flex items-center justify-between p-4 border rounded-md">
            <div>
              <h3 className="font-medium">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
            <div className="text-right">
              <div className="font-medium">{formatPrice(item.price)}</div>
              <div className="text-sm text-muted-foreground">
                {item.quantity} x {formatPrice(item.basePrice)}
              </div>
            </div>
          </div>
        ))}
        
        <div className="mt-8">
          <h3 className="font-medium mb-4">Serviços Recomendados</h3>
          
          <div className="border rounded-md p-4 flex justify-between items-center">
            <div>
              <h4 className="font-medium">Proteção SSL</h4>
              <p className="text-sm text-muted-foreground">Certificado SSL para garantir a segurança do seu site</p>
            </div>
            <Button variant="outline">
              Adicionar
              <PlusCircle className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
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

export default ServiceStep;
