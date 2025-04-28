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
import { Check, PlusCircle } from "lucide-react";
import { useContactProfiles } from "@/hooks/useContactProfiles";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface EmailPlanDialogProps {
  selectedPlan: any;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (config: { 
    userCount: number; 
    period: string; 
    domainOption: string;
    newDomainName?: string;
    selectedExistingDomain?: string;
    contactProfileId?: string;
  }) => void;
}

const EmailPlanDialog = ({
  selectedPlan,
  isOpen,
  onClose,
  onConfirm,
}: EmailPlanDialogProps) => {
  const navigate = useNavigate();
  const { profiles, isLoading: isLoadingProfiles } = useContactProfiles();
  const [config, setConfig] = useState({
    userCount: 1,
    period: "1",
    domainOption: "new",
    newDomainName: "",
    selectedExistingDomain: "",
    contactProfileId: ""
  });
  const [domains, setDomains] = useState<string[]>([]);
  const [isLoadingDomains, setIsLoadingDomains] = useState(false);
  const [domainAvailable, setDomainAvailable] = useState<boolean | null>(null);
  const [isCheckingDomain, setIsCheckingDomain] = useState(false);

  useEffect(() => {
    const fetchUserDomains = async () => {
      setIsLoadingDomains(true);
      try {
        const { data } = await supabase
          .from('client_domains')
          .select('domain_name')
          .eq('status', 'active');

        if (data && data.length > 0) {
          setDomains(data.map(d => d.domain_name));
          if (data.length > 0) {
            setConfig(prev => ({ ...prev, selectedExistingDomain: data[0].domain_name }));
          }
        } else {
          setDomains(["exemplo.co.ao", "minhaempresa.ao", "meudominio.com"]);
          setConfig(prev => ({ ...prev, selectedExistingDomain: "exemplo.co.ao" }));
        }
      } catch (error) {
        console.error("Error fetching domains:", error);
        setDomains(["exemplo.co.ao", "minhaempresa.ao", "meudominio.com"]);
        setConfig(prev => ({ ...prev, selectedExistingDomain: "exemplo.co.ao" }));
      } finally {
        setIsLoadingDomains(false);
      }
    };

    if (isOpen) {
      fetchUserDomains();
      
      if (profiles && profiles.length > 0) {
        setConfig(prev => ({ ...prev, contactProfileId: profiles[0].id }));
      }
    }
  }, [isOpen, profiles]);

  const checkDomainAvailability = () => {
    if (!config.newDomainName || config.newDomainName.trim() === "") {
      return;
    }
    
    setIsCheckingDomain(true);
    setDomainAvailable(null);
    
    setTimeout(() => {
      const isAvailable = Math.random() > 0.2;
      setDomainAvailable(isAvailable);
      setIsCheckingDomain(false);
    }, 1000);
  };

  const handleUserCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 1000) {
      setConfig(prev => ({ ...prev, userCount: value }));
    }
  };

  const createNewProfile = () => {
    navigate('/client/contact-profiles?returnTo=/products/email');
  };

  const calculatePrice = () => {
    if (!selectedPlan) return formatPrice(0);
    
    const basePrice = selectedPlan.basePrice * config.userCount * parseInt(config.period);
    const domainPrice = config.domainOption === "new" ? 2000 : 0;
    return formatPrice(basePrice + domainPrice);
  };

  const handleSubmit = () => {
    onConfirm(config);
  };

  const isFormValid = () => {
    if (config.domainOption === "new") {
      return (
        config.contactProfileId && 
        config.newDomainName && 
        domainAvailable === true
      );
    } else {
      return !!config.selectedExistingDomain;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
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
            <div className="col-span-3 flex items-center space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                size="icon"
                onClick={() => config.userCount > 1 && setConfig(prev => ({ ...prev, userCount: prev.userCount - 1 }))}
                disabled={config.userCount <= 1}
              >-</Button>
              <Input
                id="users"
                type="number"
                className="text-center"
                value={config.userCount}
                onChange={handleUserCountChange}
                min={1}
                max={1000}
              />
              <Button 
                type="button" 
                variant="outline" 
                size="icon"
                onClick={() => setConfig(prev => ({ ...prev, userCount: prev.userCount + 1 }))}
              >+</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="period" className="text-right">
              Período
            </Label>
            <Select
              value={config.period}
              onValueChange={(value) => setConfig(prev => ({ ...prev, period: value }))}
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
              <RadioGroup 
                value={config.domainOption}
                onValueChange={(value) => setConfig(prev => ({ ...prev, domainOption: value }))}
              >
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
                      <div className="pt-2 space-y-4">
                        <div>
                          <Label htmlFor="domain-name">Nome do domínio</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Input
                              id="domain-name"
                              placeholder="exemplo.ao"
                              value={config.newDomainName}
                              onChange={(e) => setConfig(prev => ({ ...prev, newDomainName: e.target.value }))}
                            />
                            <Button
                              type="button"
                              onClick={checkDomainAvailability}
                              disabled={isCheckingDomain || !config.newDomainName}
                            >
                              {isCheckingDomain ? "Verificando..." : "Verificar"}
                            </Button>
                          </div>
                          {domainAvailable === true && (
                            <p className="text-green-600 text-sm mt-1 flex items-center">
                              <Check className="h-4 w-4 mr-1"/> Domínio disponível!
                            </p>
                          )}
                          {domainAvailable === false && (
                            <p className="text-red-600 text-sm mt-1">
                              Domínio não disponível. Tente outro.
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <Label htmlFor="contact-profile">Perfil de contato para o domínio</Label>
                          <Select
                            value={config.contactProfileId}
                            onValueChange={(value) => setConfig(prev => ({ ...prev, contactProfileId: value }))}
                            disabled={isLoadingProfiles}
                          >
                            <SelectTrigger id="contact-profile" className="mt-1">
                              <SelectValue placeholder="Selecione um perfil de contato" />
                            </SelectTrigger>
                            <SelectContent>
                              {isLoadingProfiles ? (
                                <SelectItem value="loading" disabled>Carregando perfis...</SelectItem>
                              ) : profiles && profiles.length > 0 ? (
                                profiles.map(profile => (
                                  <SelectItem key={profile.id} value={profile.id}>
                                    {profile.name}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="none" disabled>Nenhum perfil encontrado</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          
                          <div className="mt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={createNewProfile}
                              className="flex items-center"
                            >
                              <PlusCircle className="h-4 w-4 mr-1" />
                              Criar novo perfil de contato
                            </Button>
                          </div>
                        </div>
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
                          value={config.selectedExistingDomain}
                          onValueChange={(value) => setConfig(prev => ({ ...prev, selectedExistingDomain: value }))}
                          disabled={isLoadingDomains || domains.length === 0}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Selecione um domínio" />
                          </SelectTrigger>
                          <SelectContent>
                            {isLoadingDomains ? (
                              <SelectItem value="loading" disabled>Carregando domínios...</SelectItem>
                            ) : domains.length > 0 ? (
                              domains.map(domain => (
                                <SelectItem key={domain} value={domain}>
                                  {domain}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="none" disabled>Nenhum domínio encontrado</SelectItem>
                            )}
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
            <div className="col-span-3 font-medium text-lg">
              {calculatePrice()}
            </div>
          </div>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Recursos incluídos:</h3>
          <ul className="space-y-1.5">
            {selectedPlan?.features?.map((feature: any, index: number) => (
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
        
        <DialogFooter className="flex-col sm:flex-row sm:space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!isFormValid()}
          >
            Adicionar ao Carrinho
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmailPlanDialog;
