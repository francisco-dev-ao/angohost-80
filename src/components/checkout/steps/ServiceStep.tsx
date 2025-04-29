
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, PlusCircle, Trash } from "lucide-react";
import { formatPrice } from '@/utils/formatters';
import { CartItem } from '@/contexts/CartContext';
import { toast } from "sonner";
import { motion } from "framer-motion";

interface ServiceStepProps {
  items: CartItem[];
  prevStep: () => void;
  nextStep: () => void;
  onRemoveItem?: (id: string) => void;
  onUpdateBillingCycle?: (itemId: string, years: number) => void;
}

const ServiceStep = ({ 
  items, 
  prevStep, 
  nextStep, 
  onRemoveItem,
  onUpdateBillingCycle
}: ServiceStepProps) => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const handleRemoveItem = (id: string) => {
    if (onRemoveItem) {
      onRemoveItem(id);
      toast.success("Item removido do pedido");
    }
  };

  const handleBillingCycleChange = (itemId: string, years: number) => {
    if (onUpdateBillingCycle) {
      onUpdateBillingCycle(itemId, years);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  const nonDomainItems = items.filter(item => item.type !== 'domain');
  const domainItems = items.filter(item => item.type === 'domain');

  return (
    <>
      <CardTitle className="mb-4">Serviços Adicionais</CardTitle>
      <CardDescription className="mb-6">
        Adicione serviços complementares ao seu pedido
      </CardDescription>
      
      <div className="space-y-4">
        {domainItems.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Domínios</h3>
            <div className="space-y-3">
              {domainItems.map(item => {
                const domainName = item.title.replace('Domínio ', '');
                const renewalDate = new Date();
                renewalDate.setFullYear(renewalDate.getFullYear() + (item.years || 1));
                
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-between p-4 border rounded-md bg-background hover:bg-accent/5 transition-colors"
                  >
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Próxima renovação: {renewalDate.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-medium">{formatPrice(item.price)}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.years} {item.years === 1 ? 'ano' : 'anos'}
                        </div>
                      </div>
                      {onRemoveItem && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
        
        {nonDomainItems.map(item => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-md border overflow-hidden"
          >
            <div 
              className={`flex items-center justify-between p-4 cursor-pointer ${expandedItem === item.id ? 'bg-accent/10' : 'bg-background'} hover:bg-accent/5 transition-colors`}
              onClick={() => toggleExpand(item.id)}
            >
              <div>
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="font-medium">{formatPrice(item.price)}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.quantity} x {formatPrice(item.basePrice)}
                  </div>
                </div>
                {onRemoveItem && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveItem(item.id);
                    }}
                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            
            {expandedItem === item.id && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="p-4 border-t"
              >
                <h4 className="text-sm font-medium mb-2">Período de contratação</h4>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[1, 2, 3].map(years => (
                    <Button 
                      key={years}
                      variant={(item.years || 1) === years ? "default" : "outline"}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBillingCycleChange(item.id, years);
                      }}
                      className="w-full"
                    >
                      {years} {years === 1 ? 'ano' : 'anos'}
                      {years > 1 && <span className="ml-1 text-xs bg-primary-foreground text-primary px-1 py-0.5 rounded">-{(years-1)*5}%</span>}
                    </Button>
                  ))}
                </div>
                
                {item.domain && (
                  <div className="mt-3 p-3 bg-accent/20 rounded-md">
                    <p className="text-sm font-medium">Domínio associado:</p>
                    <p className="text-sm">{item.domain}</p>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        ))}
        
        <div className="mt-8">
          <h3 className="font-medium mb-4">Serviços Recomendados</h3>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="border rounded-md p-4 flex justify-between items-center bg-gradient-to-r from-accent/20 to-background"
          >
            <div>
              <h4 className="font-medium">Proteção SSL</h4>
              <p className="text-sm text-muted-foreground">Certificado SSL para garantir a segurança do seu site</p>
            </div>
            <Button variant="outline" className="group">
              Adicionar
              <PlusCircle className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
            </Button>
          </motion.div>
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
          className="group"
        >
          Próximo
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </>
  );
};

export default ServiceStep;
