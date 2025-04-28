
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Trash, AlertCircle } from 'lucide-react';
import DomainValidator from '@/components/DomainValidator';
import AdditionalProducts from '@/components/AdditionalProducts';
import DomainOwnership from '@/components/DomainOwnership';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { formatPrice } from "@/utils/formatters";
import PricingCard from '@/components/PricingCard';
import { useNavigate } from 'react-router-dom';
import { emailPlans } from '@/config/emailPlans';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface OwnershipData {
  name: string;
  email: string;
  document: string;
  phone: string;
  address: string;
}

interface DomainWithOwnership {
  domain: string;
  hasOwnership: boolean;
  ownershipData?: OwnershipData;
}

const cpanelPlans = [
  {
    title: "Hospedagem Starter",
    description: "Para sites pessoais",
    basePrice: 20000,
    features: [
      { text: "1 website", included: true },
      { text: "10GB SSD", included: true },
      { text: "1 Banco de dados", included: true },
      { text: "5 Emails", included: true },
      { text: "SSL Grátis", included: true },
      { text: "cPanel incluído", included: true },
    ],
  },
  {
    title: "Hospedagem Business",
    description: "Para empresas",
    basePrice: 30000,
    popular: true,
    features: [
      { text: "10 websites", included: true },
      { text: "30GB SSD", included: true },
      { text: "10 Bancos de dados", included: true },
      { text: "30 Emails", included: true },
      { text: "SSL Grátis", included: true },
      { text: "cPanel incluído", included: true },
    ],
  }
];

const wordpressPlans = [
  {
    title: "WordPress Basic",
    description: "Para blogs pessoais",
    basePrice: 25000,
    features: [
      { text: "1 Site WordPress", included: true },
      { text: "10GB SSD", included: true },
      { text: "WordPress Otimizado", included: true },
      { text: "Instalação em 1 clique", included: true },
      { text: "SSL Grátis", included: true },
      { text: "Backup Diário", included: true },
    ],
  },
  {
    title: "WordPress Pro",
    description: "Para negócios",
    basePrice: 45000,
    popular: true,
    features: [
      { text: "5 Sites WordPress", included: true },
      { text: "30GB SSD", included: true },
      { text: "WordPress Otimizado", included: true },
      { text: "Instalação em 1 clique", included: true },
      { text: "SSL Grátis", included: true },
      { text: "Backup Diário", included: true },
    ],
  }
];

const Cart = () => {
  const { items, removeFromCart, addToCart } = useCart();
  const [domainType, setDomainType] = useState('new');
  const [validatedDomain, setValidatedDomain] = useState<string | null>(null);
  const [domainWithOwnershipMap, setDomainWithOwnershipMap] = useState<{[key: string]: DomainWithOwnership}>({});
  const [currentDomainForOwnership, setCurrentDomainForOwnership] = useState<string | null>(null);
  const [isOwnershipDialogOpen, setIsOwnershipDialogOpen] = useState(false);
  const [selectedBillingPeriod, setSelectedBillingPeriod] = useState("1");
  const navigate = useNavigate();

  // Filtrar apenas os domínios no carrinho
  const domainItems = items.filter(item => item.title.toLowerCase().includes('domínio'));

  // Verificar se todos os domínios têm dados de titularidade
  const allDomainsHaveOwnership = domainItems.length > 0 && 
    domainItems.every(item => {
      const domainName = item.title.replace('Domínio ', '');
      return domainWithOwnershipMap[domainName]?.hasOwnership;
    });

  useEffect(() => {
    // Inicializar o mapa de domínios com titularidade
    const initialDomainMap: {[key: string]: DomainWithOwnership} = {};
    
    domainItems.forEach(item => {
      const domainName = item.title.replace('Domínio ', '');
      if (!domainWithOwnershipMap[domainName]) {
        initialDomainMap[domainName] = {
          domain: domainName,
          hasOwnership: false
        };
      }
    });
    
    setDomainWithOwnershipMap(prev => ({...prev, ...initialDomainMap}));
  }, [items]);

  const calculateSubtotal = () => {
    return items.reduce((acc, item) => {
      if (item.title.toLowerCase().includes('domínio') && domainType === 'existing') {
        return acc;
      }
      return acc + item.price * item.quantity;
    }, 0);
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    if (subtotal >= 500000) return 0.1; // 10% discount
    if (subtotal >= 250000) return 0.05; // 5% discount
    return 0;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = subtotal * calculateDiscount();
    return subtotal - discount;
  };

  const calculateRenewalDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date.toLocaleDateString('pt-AO');
  };

  const handleRemoveItem = (itemId: string) => {
    // Se for um domínio, também remover do mapa de titularidade
    const item = items.find(i => i.id === itemId);
    if (item && item.title.toLowerCase().includes('domínio')) {
      const domainName = item.title.replace('Domínio ', '');
      setDomainWithOwnershipMap(prev => {
        const newMap = {...prev};
        delete newMap[domainName];
        return newMap;
      });
    }
    
    removeFromCart(itemId);
    toast.success('Item removido do carrinho!');
  };

  const handleDomainValidated = (domain: string) => {
    setValidatedDomain(domain);
  };

  const handleOpenOwnershipDialog = (domain: string) => {
    setCurrentDomainForOwnership(domain);
    setIsOwnershipDialogOpen(true);
  };

  const handleCloseOwnershipDialog = () => {
    setIsOwnershipDialogOpen(false);
    setCurrentDomainForOwnership(null);
  };

  const handleOwnershipSubmit = (domain: string, data: OwnershipData) => {
    setDomainWithOwnershipMap(prev => ({
      ...prev,
      [domain]: {
        domain,
        hasOwnership: true,
        ownershipData: data
      }
    }));
  };

  const handleAddProduct = (product: any, years: number = 1) => {
    addToCart({
      id: `${product.title}-${Date.now()}`,
      title: `${product.title} (${years} ${years === 1 ? 'ano' : 'anos'})`,
      quantity: 1,
      price: product.basePrice * years,
      basePrice: product.basePrice,
    });
    toast.success(`${product.title} adicionado ao carrinho!`);
  };

  const handleCheckout = () => {
    if (domainItems.length > 0 && !allDomainsHaveOwnership) {
      toast.error('Por favor, preencha as informações de titularidade para todos os domínios.');
      return;
    }
    
    // Simulando finalização da compra
    toast.success('Compra finalizada com sucesso! Redirecionando para página de pagamento...');
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  return (
    <Layout>
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-8">Carrinho de Compras</h1>
        
        {items.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              {domainItems.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Domínios</CardTitle>
                    <CardDescription>
                      Domínios selecionados para registro
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {domainItems.map((item) => {
                      const domainName = item.title.replace('Domínio ', '');
                      const domainWithOwnership = domainWithOwnershipMap[domainName];
                      
                      return (
                        <div key={item.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{item.title}</h3>
                              <div className="mt-2 text-muted-foreground">
                                <p>Preço: {formatPrice(item.price)}</p>
                                <p className="mt-1 text-sm">
                                  Próxima renovação: {calculateRenewalDate()}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="mt-4">
                            {domainWithOwnership?.hasOwnership ? (
                              <div className="flex justify-between items-center">
                                <span className="text-green-600 text-sm">
                                  ✓ Informações de titularidade preenchidas
                                </span>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleOpenOwnershipDialog(domainName)}
                                >
                                  Editar titularidade
                                </Button>
                              </div>
                            ) : (
                              <div className="flex justify-between items-center">
                                <span className="text-red-500 text-sm flex items-center gap-1">
                                  <AlertCircle className="h-4 w-4" />
                                  Titularidade não preenchida
                                </span>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleOpenOwnershipDialog(domainName)}
                                >
                                  Adicionar titularidade
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              )}

              {/* Outros itens do carrinho */}
              {items.filter(item => !item.title.toLowerCase().includes('domínio')).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Outros serviços</CardTitle>
                    <CardDescription>
                      Serviços adicionados ao carrinho
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {items
                      .filter(item => !item.title.toLowerCase().includes('domínio'))
                      .map((item) => (
                        <div key={item.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{item.title}</h3>
                              <div className="mt-2 text-muted-foreground">
                                <p>Quantidade: {item.quantity}</p>
                                <p>Preço unitário: {formatPrice(item.basePrice)}</p>
                                <p>Total: {formatPrice(item.price)}</p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Serviços adicionais recomendados */}
              <Card>
                <CardHeader>
                  <CardTitle>Serviços Recomendados</CardTitle>
                  <CardDescription>
                    Escolha serviços adicionais para seus domínios
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    {domainItems.length > 0 ? (
                      <Tabs defaultValue="email">
                        <TabsList className="grid grid-cols-3 mb-6">
                          <TabsTrigger value="email">Email Profissional</TabsTrigger>
                          <TabsTrigger value="cpanel">Hospedagem cPanel</TabsTrigger>
                          <TabsTrigger value="wordpress">Hospedagem WordPress</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="email">
                          <div className="grid md:grid-cols-2 gap-4">
                            {emailPlans.map((plan, index) => (
                              <PricingCard
                                key={index}
                                {...plan}
                                price={formatPrice(plan.basePrice * parseInt(selectedBillingPeriod))}
                                period={`${selectedBillingPeriod} ${parseInt(selectedBillingPeriod) === 1 ? 'ano' : 'anos'}`}
                                ctaText="Adicionar ao carrinho"
                                onAction={() => handleAddProduct(plan, parseInt(selectedBillingPeriod))}
                              />
                            ))}
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="cpanel">
                          <div className="grid md:grid-cols-2 gap-4">
                            {cpanelPlans.map((plan, index) => (
                              <PricingCard
                                key={index}
                                {...plan}
                                price={formatPrice(plan.basePrice * parseInt(selectedBillingPeriod))}
                                period={`${selectedBillingPeriod} ${parseInt(selectedBillingPeriod) === 1 ? 'ano' : 'anos'}`}
                                ctaText="Adicionar ao carrinho"
                                onAction={() => handleAddProduct(plan, parseInt(selectedBillingPeriod))}
                              />
                            ))}
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="wordpress">
                          <div className="grid md:grid-cols-2 gap-4">
                            {wordpressPlans.map((plan, index) => (
                              <PricingCard
                                key={index}
                                {...plan}
                                price={formatPrice(plan.basePrice * parseInt(selectedBillingPeriod))}
                                period={`${selectedBillingPeriod} ${parseInt(selectedBillingPeriod) === 1 ? 'ano' : 'anos'}`}
                                ctaText="Adicionar ao carrinho"
                                onAction={() => handleAddProduct(plan, parseInt(selectedBillingPeriod))}
                              />
                            ))}
                          </div>
                        </TabsContent>
                      </Tabs>
                    ) : (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Nenhum domínio no carrinho</AlertTitle>
                        <AlertDescription>
                          Adicione domínios ao seu carrinho para ver recomendações de serviços.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="border rounded-lg p-6 h-fit sticky top-8">
              <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(calculateSubtotal())}</span>
                </div>
                {calculateDiscount() > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Desconto ({(calculateDiscount() * 100)}%)</span>
                    <span>-{formatPrice(calculateSubtotal() * calculateDiscount())}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold pt-2 border-t">
                  <span>Total</span>
                  <span>{formatPrice(calculateTotal())}</span>
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                <h3 className="text-sm font-medium">Período de contratação</h3>
                <select
                  value={selectedBillingPeriod}
                  onChange={(e) => setSelectedBillingPeriod(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="1">1 ano</option>
                  <option value="2">2 anos</option>
                  <option value="3">3 anos</option>
                  <option value="4">4 anos</option>
                  <option value="5">5 anos</option>
                </select>
              </div>
              
              <Button 
                className="w-full mt-6" 
                onClick={handleCheckout}
                disabled={domainItems.length > 0 && !allDomainsHaveOwnership}
              >
                Finalizar Compra
              </Button>
              
              {domainItems.length > 0 && !allDomainsHaveOwnership && (
                <p className="text-sm text-red-500 mt-2">
                  Preencha as informações de titularidade para todos os domínios
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Seu carrinho está vazio</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate('/domains')}
            >
              Pesquisar domínios
            </Button>
          </div>
        )}
      </div>
      
      {currentDomainForOwnership && (
        <DomainOwnership 
          domain={currentDomainForOwnership}
          isOpen={isOwnershipDialogOpen}
          onClose={handleCloseOwnershipDialog}
          onSubmit={handleOwnershipSubmit}
        />
      )}
    </Layout>
  );
};

export default Cart;
