
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPrice } from "@/utils/formatters";
import { Check } from "lucide-react";
import { useContactProfiles } from "@/hooks/useContactProfiles";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface EmailPlanDialogProps {
  selectedPlan: any;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (config: { 
    userCount: number; 
    period: string; 
    domainOption: string;
    selectedDomain?: string;
    contactProfileId?: string;
  }) => void;
}

const EmailPlanDialog = ({
  selectedPlan,
  isOpen,
  onClose,
  onConfirm,
}: EmailPlanDialogProps) => {
  const { profiles, isLoading: isLoadingProfiles } = useContactProfiles();
  const [config, setConfig] = useState({
    userCount: 1,
    period: "1",
    domainOption: "new",
    selectedDomain: "",
    contactProfileId: ""
  });
  const [domains, setDomains] = useState<string[]>([]);
  const [isLoadingDomains, setIsLoadingDomains] = useState(false);

  useEffect(() => {
    const fetchUserDomains = async () => {
      setIsLoadingDomains(true);
      try {
        // This would be replaced with actual domain fetching logic
        // For now we'll mock some domains
        setTimeout(() => {
          setDomains(["example.com", "mydomain.com", "business.com"]);
          setIsLoadingDomains(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching domains:", error);
        setIsLoadingDomains(false);
      }
    };

    if (isOpen) {
      fetchUserDomains();
      
      // Set default contact profile if available
      if (profiles && profiles.length > 0) {
        setConfig(prev => ({ ...prev, contactProfileId: profiles[0].id }));
      }
    }
  }, [isOpen, profiles]);

  const handleUserCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 1000) {
      setConfig(prev => ({ ...prev, userCount: value }));
    }
  };

  const handlePeriodChange = (value: string) => {
    setConfig(prev => ({ ...prev, period: value }));
  };

  const handleDomainOptionChange = (value: string) => {
    setConfig(prev => ({ ...prev, domainOption: value }));
  };

  const handleSelectedDomainChange = (value: string) => {
    setConfig(prev => ({ ...prev, selectedDomain: value }));
  };

  const handleContactProfileChange = (value: string) => {
    setConfig(prev => ({ ...prev, contactProfileId: value }));
  };

  const calculatePrice = () => {
    const basePrice = selectedPlan.basePrice * config.userCount * parseInt(config.period);
    // Add domain price if registering new domain
    const domainPrice = config.domainOption === "new" ? 2000 : 0;
    return formatPrice(basePrice + domainPrice);
  };

  const handleSubmit = () => {
    onConfirm(config);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{selectedPlan?.title}</DialogTitle>
          <DialogDescription>
            Configure o seu plano de email profissional
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="users" className="text-right">
              Usuários
            </Label>
            <Input
              id="users"
              type="number"
              min="1"
              max="1000"
              value={config.userCount}
              onChange={handleUserCountChange}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="period" className="text-right">
              Período
            </Label>
            <Select
              value={config.period}
              onValueChange={handlePeriodChange}
            >
              <SelectTrigger id="period" className="col-span-3">
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 ano</SelectItem>
                <SelectItem value="2">2 anos</SelectItem>
                <SelectItem value="3">3 anos</SelectItem>
                <SelectItem value="4">4 anos</SelectItem>
                <SelectItem value="5">5 anos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right mt-2">
              Domínio
            </Label>
            <div className="col-span-3 space-y-4">
              <RadioGroup value={config.domainOption} onValueChange={handleDomainOptionChange}>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="new" id="domain-new" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="domain-new" className="font-medium">
                      Registrar um novo domínio
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Adiciona custo extra para registro do domínio
                    </p>
                    
                    {config.domainOption === "new" && (
                      <div className="pt-2">
                        <Label htmlFor="contact-profile">Perfil de contato para o domínio</Label>
                        <Select
                          value={config.contactProfileId}
                          onValueChange={handleContactProfileChange}
                          disabled={isLoadingProfiles}
                        >
                          <SelectTrigger id="contact-profile" className="mt-1">
                            <SelectValue placeholder="Selecione um perfil de contato" />
                          </SelectTrigger>
                          <SelectContent>
                            {profiles.map(profile => (
                              <SelectItem key={profile.id} value={profile.id}>
                                {profile.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 mt-3">
                  <RadioGroupItem value="existing" id="domain-existing" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="domain-existing" className="font-medium">
                      Usar um domínio existente
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Selecione um dos seus domínios já registrados
                    </p>
                    
                    {config.domainOption === "existing" && (
                      <div className="pt-2">
                        <Select
                          value={config.selectedDomain}
                          onValueChange={handleSelectedDomainChange}
                          disabled={isLoadingDomains}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Selecione um domínio" />
                          </SelectTrigger>
                          <SelectContent>
                            {domains.map(domain => (
                              <SelectItem key={domain} value={domain}>
                                {domain}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Preço Total</Label>
            <div className="col-span-3 font-medium">
              {calculatePrice()}
            </div>
          </div>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Recursos incluídos:</h3>
          <ul className="space-y-1.5">
            {selectedPlan.features.map((feature: any, index: number) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                {feature.included ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <span className="h-4 w-4 block" />
                )}
                {feature.text}
              </li>
            ))}
          </ul>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={
              (config.domainOption === "existing" && !config.selectedDomain) ||
              (config.domainOption === "new" && !config.contactProfileId)
            }
          >
            Adicionar ao Carrinho
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmailPlanDialog;
