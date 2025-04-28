
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { DomainWithOwnership } from '@/types/cart';
import { toast } from 'sonner';

export const useCartPage = () => {
  const { items, removeFromCart, addToCart, isLoading } = useCart();
  const [selectedBillingPeriod, setSelectedBillingPeriod] = useState("1");
  
  // Domain ownership state
  const [domainWithOwnershipMap, setDomainWithOwnershipMap] = useState<{[key: string]: DomainWithOwnership}>({});
  const [currentDomainForOwnership, setCurrentDomainForOwnership] = useState<string | null>(null);
  const [isOwnershipDialogOpen, setIsOwnershipDialogOpen] = useState(false);
  
  // Email dialog state
  const [selectedEmailPlan, setSelectedEmailPlan] = useState<null | any>(null);
  const [showEmailDialog, setShowEmailDialog] = useState(false);

  const domainItems = items.filter(item => item.title.toLowerCase().includes('domínio'));

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

  const handleRecalculatePrices = (period: string) => {
    const itemsToRecalculate = items.filter(item => 
      !item.title.toLowerCase().includes('domínio') && 
      !item.title.toLowerCase().includes('email')
    );
    
    itemsToRecalculate.forEach(item => {
      removeFromCart(item.id);
      
      const titleParts = item.title.split('(')[0].trim();
      const product = {
        title: titleParts,
        basePrice: item.basePrice,
      };
      
      handleAddProduct(product, parseInt(period));
    });
  };

  const allDomainsHaveOwnership = domainItems.length > 0 && 
    domainItems.every(item => {
      const domainName = item.title.replace('Domínio ', '');
      return domainWithOwnershipMap[domainName]?.hasOwnership;
    });

  return {
    items,
    isLoading,
    domainItems,
    selectedBillingPeriod,
    setSelectedBillingPeriod,
    domainWithOwnershipMap,
    currentDomainForOwnership,
    isOwnershipDialogOpen,
    selectedEmailPlan,
    showEmailDialog,
    allDomainsHaveOwnership,
    handleRemoveItem,
    handleOpenOwnershipDialog,
    handleCloseOwnershipDialog,
    handleOwnershipSubmit,
    handleAddProduct,
    handleEmailPlanClick,
    handleConfirmEmailPlan,
    handleRecalculatePrices,
  };
};
