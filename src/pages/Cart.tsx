
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useOwnership } from '@/contexts/OwnershipContext';
import OwnershipProfileSelector from '@/components/OwnershipProfileSelector';
import DomainOwnership from '@/components/DomainOwnership';
import CartItems from '@/components/cart/CartItems';
import CartSummary from '@/components/cart/CartSummary';
import RecommendedServices from '@/components/cart/RecommendedServices';
import EmailPlanDialog from '@/components/cart/EmailPlanDialog';
import { DomainWithOwnership } from '@/types/cart';

const Cart = () => {
  const { items, removeFromCart, addToCart } = useCart();
  const [selectedBillingPeriod, setSelectedBillingPeriod] = useState("1");
  const navigate = useNavigate();
  
  // Domain ownership state
  const [domainWithOwnershipMap, setDomainWithOwnershipMap] = useState<{[key: string]: DomainWithOwnership}>({});
  const [currentDomainForOwnership, setCurrentDomainForOwnership] = useState<string | null>(null);
  const [isOwnershipDialogOpen, setIsOwnershipDialogOpen] = useState(false);
  
  // Email dialog state
  const [selectedEmailPlan, setSelectedEmailPlan] = useState<null | any>(null);
  const [showEmailDialog, setShowEmailDialog] = useState(false);

  const domainItems = items.filter(item => item.title.toLowerCase().includes('domínio'));

  const allDomainsHaveOwnership = domainItems.length > 0 && 
    domainItems.every(item => {
      const domainName = item.title.replace('Domínio ', '');
      return domainWithOwnershipMap[domainName]?.hasOwnership;
    });

  useEffect(() => {
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

  const handleRemoveItem = (itemId: string) => {
    const itemToRemove = items.find(i => i.id === itemId);
    if (itemToRemove && itemToRemove.title.toLowerCase().includes('domínio')) {
      const domainName = itemToRemove.title.replace('Domínio ', '');
      setDomainWithOwnershipMap(prev => {
        const newMap = {...prev};
        delete newMap[domainName];
        return newMap;
      });
    }
    
    removeFromCart(itemId);
    toast.success('Item removido do carrinho!');
  };

  const handleOpenOwnershipDialog = (domain: string) => {
    setCurrentDomainForOwnership(domain);
    setIsOwnershipDialogOpen(true);
  };

  const handleCloseOwnershipDialog = () => {
    setIsOwnershipDialogOpen(false);
    setCurrentDomainForOwnership(null);
  };

  const handleOwnershipSubmit = (domain: string, data: any) => {
    setDomainWithOwnershipMap(prev => ({
      ...prev,
      [domain]: {
        domain,
        hasOwnership: true,
        ownershipData: data
      }
    }));
    setIsOwnershipDialogOpen(false);
    setCurrentDomainForOwnership(null);
    toast.success('Perfil de titularidade salvo com sucesso!');
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

  const calculateSubtotal = () => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const handleEmailPlanClick = (plan: any) => {
    setSelectedEmailPlan(plan);
    setShowEmailDialog(true);
  };

  const handleConfirmEmailPlan = (config: { userCount: number; period: string }) => {
    if (!selectedEmailPlan) return;
    
    const years = parseInt(config.period);
    const userCount = config.userCount;
    
    addToCart({
      id: `${selectedEmailPlan.title}-${Date.now()}`,
      title: `${selectedEmailPlan.title} (${userCount} usuário${userCount > 1 ? 's' : ''} por ${years} ${years === 1 ? 'ano' : 'anos'})`,
      quantity: userCount,
      price: selectedEmailPlan.basePrice * userCount * years,
      basePrice: selectedEmailPlan.basePrice,
    });
    
    setShowEmailDialog(false);
    toast.success('Plano de email adicionado ao carrinho!');
  };

  return (
    <Layout>
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-8">Carrinho de Compras</h1>
        
        {items.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <CartItems
                items={items}
                domainItems={domainItems}
                domainWithOwnershipMap={domainWithOwnershipMap}
                onRemoveItem={handleRemoveItem}
                onOpenOwnershipDialog={handleOpenOwnershipDialog}
              />
              
              <RecommendedServices
                hasDomains={domainItems.length > 0}
                selectedBillingPeriod={selectedBillingPeriod}
                onAddProduct={handleAddProduct}
                onEmailPlanClick={handleEmailPlanClick}
              />
            </div>

            <CartSummary
              subtotal={calculateSubtotal()}
              hasUnownedDomains={!allDomainsHaveOwnership}
              selectedBillingPeriod={selectedBillingPeriod}
              onBillingPeriodChange={setSelectedBillingPeriod}
            />
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

      {/* Ownership dialog */}
      {currentDomainForOwnership && (
        <DomainOwnership 
          domain={currentDomainForOwnership}
          isOpen={isOwnershipDialogOpen}
          onClose={handleCloseOwnershipDialog}
          onSubmit={handleOwnershipSubmit}
          existingProfiles={[]}
        />
      )}

      {/* Email plan dialog */}
      {selectedEmailPlan && (
        <EmailPlanDialog
          selectedPlan={selectedEmailPlan}
          isOpen={showEmailDialog}
          onClose={() => setShowEmailDialog(false)}
          onConfirm={handleConfirmEmailPlan}
        />
      )}
    </Layout>
  );
};

export default Cart;
