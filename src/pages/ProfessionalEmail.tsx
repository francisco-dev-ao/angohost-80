
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import PricingCard from "@/components/PricingCard";
import FeatureCard from "@/components/FeatureCard";
import { Mail, Server, Globe, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { emailPlans, EmailPlan } from "@/config/emailPlans";
import { formatPrice } from "@/utils/formatters";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useContactProfiles } from "@/hooks/useContactProfiles";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

interface DomainItem {
  name: string;
  isRegistered: boolean;
}

const ProfessionalEmail = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useSupabaseAuth();
  const { profiles, isLoading: isLoadingProfiles } = useContactProfiles();

  const [selectedTab, setSelectedTab] = useState("business");
  const [userCount, setUserCount] = useState(1);
  const [period, setPeriod] = useState("1");
  const [selectedPlan, setSelectedPlan] = useState<EmailPlan | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [domainOption, setDomainOption] = useState("new");
  const [newDomainName, setNewDomainName] = useState("");
  const [isCheckingDomain, setIsCheckingDomain] = useState(false);
  const [domainAvailable, setDomainAvailable] = useState<boolean | null>(null);
  const [existingDomains, setExistingDomains] = useState<DomainItem[]>([]);
  const [selectedExistingDomain, setSelectedExistingDomain] = useState("");
  const [selectedContactProfile, setSelectedContactProfile] = useState("");

  useEffect(() => {
    // Initialize with first profile when loaded
    if (profiles.length > 0 && !selectedContactProfile) {
      setSelectedContactProfile(profiles[0].id);
    }
  }, [profiles]);

  useEffect(() => {
    const fetchUserDomains = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("client_domains")
          .select("domain_name")
          .eq("user_id", user.id)
          .eq("status", "active");

        if (error) throw error;

        if (data) {
          const domains = data.map(item => ({
            name: item.domain_name,
            isRegistered: true
          }));
          setExistingDomains(domains);
          if (domains.length > 0) {
            setSelectedExistingDomain(domains[0].name);
          }
        }
      } catch (error) {
        console.error("Error fetching domains:", error);
        // Use mock data as a fallback
        setExistingDomains([
          { name: "exemplo.co.ao", isRegistered: true },
          { name: "minhaempresa.ao", isRegistered: true }
        ]);
      }
    };

    fetchUserDomains();
  }, [user]);

  const getPlanByType = (type: string) => {
    return emailPlans.find(plan => plan.id === type) || emailPlans[0];
  };

  const handleUserCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value >= 1 && value <= 1000) {
      setUserCount(value);
    }
  };

  const calculatePrice = (basePrice: number) => {
    const emailPrice = basePrice * userCount * parseInt(period);
    // Add domain price if registering new domain
    const domainPrice = domainOption === "new" ? 2000 : 0;
    return formatPrice(emailPrice + domainPrice);
  };

  const calculateTotalPrice = (basePrice: number) => {
    const emailPrice = basePrice * userCount * parseInt(period);
    // Add domain price if registering new domain
    const domainPrice = domainOption === "new" ? 2000 : 0;
    return emailPrice + domainPrice;
  };

  const handlePurchase = (plan: EmailPlan) => {
    if (!user) {
      toast.error("Faça login para continuar");
      navigate("/register");
      return;
    }
    
    setSelectedPlan(plan);
    setShowDialog(true);
  };

  const checkDomainAvailability = async () => {
    if (!newDomainName || newDomainName.trim() === "") {
      toast.error("Digite um nome de domínio válido");
      return;
    }

    setIsCheckingDomain(true);
    setDomainAvailable(null);

    try {
      // In a real app, this would call your domain check API
      // For now we'll simulate with a timeout and random result
      setTimeout(() => {
        // 80% chance domain is available for demo purposes
        const isAvailable = Math.random() > 0.2;
        setDomainAvailable(isAvailable);
        setIsCheckingDomain(false);

        if (isAvailable) {
          toast.success(`Domínio ${newDomainName} está disponível!`);
        } else {
          toast.error(`Domínio ${newDomainName} não está disponível.`);
        }
      }, 1000);
    } catch (error) {
      setIsCheckingDomain(false);
      toast.error("Erro ao verificar disponibilidade do domínio");
    }
  };

  const handleConfirmPurchase = () => {
    if (!selectedPlan) return;

    const years = parseInt(period);
    const items = [];

    // Add email plan to cart
    items.push({
      id: `${selectedPlan.id}-${Date.now()}`,
      title: `${selectedPlan.title} (${userCount} usuários por ${years} ${years === 1 ? 'ano' : 'anos'})`,
      quantity: userCount,
      price: selectedPlan.basePrice * userCount * years,
      basePrice: selectedPlan.basePrice,
      type: "email"
    });

    // Add domain to cart if registering new one
    if (domainOption === "new" && newDomainName && domainAvailable) {
      items.push({
        id: `domain-${Date.now()}`,
        title: `Domínio: ${newDomainName}`,
        quantity: 1,
        price: 2000, // Domain registration fee
        basePrice: 2000,
        type: "domain",
        domain: newDomainName,
        contactProfileId: selectedContactProfile
      });
    }

    // Add each item to cart
    items.forEach(item => addToCart(item));

    setShowDialog(false);
    navigate('/cart');
    toast.success('Produtos adicionados ao carrinho');
  };

  return (
    <Layout>
      <div className="container py-12">
        <h1 className="text-4xl font-bold text-center mb-4">Email Profissional</h1>
        <p className="text-lg text-center text-muted-foreground mb-8">
          Soluções de email profissional para sua empresa
        </p>
        
        <div className="max-w-md mx-auto mb-10 bg-muted/20 p-6 rounded-lg border">
          <h2 className="text-xl font-medium mb-4">Configurar Plano</h2>
          
          <div className="space-y-6">
            <div>
              <Label htmlFor="userCount">Número de usuários</Label>
              <div className="flex items-center space-x-4 mt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => userCount > 1 && setUserCount(userCount - 1)}
                  disabled={userCount <= 1}
                >-</Button>
                <Input
                  id="userCount"
                  type="number"
                  className="text-center"
                  value={userCount}
                  onChange={handleUserCountChange}
                  min={1}
                  max={1000}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => setUserCount(userCount + 1)}
                >+</Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="period">Período de contratação</Label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger id="period" className="mt-2">
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
            
            <div>
              <Label>Tipo de plano</Label>
              <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mt-2">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Básico</TabsTrigger>
                  <TabsTrigger value="business">Business</TabsTrigger>
                  <TabsTrigger value="enterprise">Enterprise</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {emailPlans.map((plan) => {
            const isCurrentPlan = plan.id === selectedTab;
            return (
              <div 
                key={plan.id} 
                className={`transition-all duration-300 transform ${isCurrentPlan ? 'scale-105 shadow-lg' : 'opacity-85'}`}
              >
                <PricingCard
                  {...plan}
                  price={calculatePrice(plan.basePrice)}
                  period={`${userCount} ${userCount === 1 ? 'usuário' : 'usuários'} / ${period} ${parseInt(period) === 1 ? 'ano' : 'anos'}`}
                  ctaText="Comprar"
                  onAction={() => handlePurchase(plan)}
                />
              </div>
            );
          })}
        </div>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedPlan?.title}</DialogTitle>
              <DialogDescription>
                Configure seu plano de email profissional
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dialog-users" className="text-right">
                  Usuários
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon"
                    onClick={() => userCount > 1 && setUserCount(userCount - 1)}
                    disabled={userCount <= 1}
                  >-</Button>
                  <Input
                    id="dialog-users"
                    type="number"
                    className="text-center"
                    value={userCount}
                    onChange={handleUserCountChange}
                    min={1}
                    max={1000}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon"
                    onClick={() => setUserCount(userCount + 1)}
                  >+</Button>
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dialog-period" className="text-right">
                  Período
                </Label>
                <Select
                  value={period}
                  onValueChange={setPeriod}
                >
                  <SelectTrigger id="dialog-period" className="col-span-3">
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
                  <RadioGroup value={domainOption} onValueChange={setDomainOption}>
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="new" id="domain-new" />
                      <div className="grid gap-1.5">
                        <Label htmlFor="domain-new" className="font-medium">
                          Registrar um novo domínio
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Custo adicional de {formatPrice(2000)}
                        </p>
                        
                        {domainOption === "new" && (
                          <div className="pt-2 space-y-3">
                            <div>
                              <div className="flex items-center space-x-2">
                                <Input 
                                  placeholder="exemplo.ao"
                                  value={newDomainName}
                                  onChange={e => setNewDomainName(e.target.value)}
                                />
                                <Button 
                                  onClick={checkDomainAvailability}
                                  disabled={isCheckingDomain || !newDomainName}
                                >
                                  {isCheckingDomain ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  ) : null}
                                  Verificar
                                </Button>
                              </div>
                              {domainAvailable === true && (
                                <p className="text-sm text-green-600 mt-1 flex items-center">
                                  <Check className="h-4 w-4 mr-1" /> Domínio disponível!
                                </p>
                              )}
                              {domainAvailable === false && (
                                <p className="text-sm text-red-600 mt-1">
                                  Domínio não disponível. Tente outro.
                                </p>
                              )}
                            </div>

                            <div>
                              <Label htmlFor="contact-profile">Perfil de contato para o domínio</Label>
                              <Select
                                value={selectedContactProfile}
                                onValueChange={setSelectedContactProfile}
                              >
                                <SelectTrigger id="contact-profile" className="mt-1">
                                  <SelectValue placeholder="Selecione um perfil de contato" />
                                </SelectTrigger>
                                <SelectContent>
                                  {isLoadingProfiles ? (
                                    <SelectItem value="loading" disabled>Carregando perfis...</SelectItem>
                                  ) : profiles.length > 0 ? (
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
                              
                              {(!selectedContactProfile || profiles.length === 0) && (
                                <div className="mt-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => navigate("/client/contact-profiles?returnTo=/products/email")}
                                  >
                                    Criar perfil de contato
                                  </Button>
                                </div>
                              )}
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
                        
                        {domainOption === "existing" && (
                          <div className="pt-2">
                            <Select
                              value={selectedExistingDomain}
                              onValueChange={setSelectedExistingDomain}
                              disabled={existingDomains.length === 0}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Selecione um domínio" />
                              </SelectTrigger>
                              <SelectContent>
                                {existingDomains.length > 0 ? (
                                  existingDomains.map(domain => (
                                    <SelectItem key={domain.name} value={domain.name}>
                                      {domain.name}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <SelectItem value="none" disabled>Nenhum domínio encontrado</SelectItem>
                                )}
                              </SelectContent>
                            </Select>

                            {existingDomains.length === 0 && (
                              <p className="text-sm text-amber-600 mt-2">
                                Você não possui domínios registrados. Escolha a opção de registrar um novo domínio.
                              </p>
                            )}
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
                  {selectedPlan && calculatePrice(selectedPlan.basePrice)}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleConfirmPurchase}
                disabled={
                  (domainOption === "new" && (!domainAvailable || !selectedContactProfile)) ||
                  (domainOption === "existing" && (!selectedExistingDomain || existingDomains.length === 0))
                }
              >
                Adicionar ao Carrinho
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Mail className="w-6 h-6" />}
            title="Email Profissional"
            description="Use seu domínio próprio para emails corporativos"
          />
          <FeatureCard
            icon={<Server className="w-6 h-6" />}
            title="Segurança Avançada"
            description="Proteção contra spam e vírus incluída"
          />
          <FeatureCard
            icon={<Globe className="w-6 h-6" />}
            title="Acesso Global"
            description="Acesse seus emails de qualquer lugar e dispositivo"
          />
        </div>
      </div>
    </Layout>
  );
};

export default ProfessionalEmail;
