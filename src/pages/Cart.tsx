
import Layout from '@/components/Layout';
import DomainOwnership from '@/components/DomainOwnership';
import CartItems from '@/components/cart/CartItems';
import CartSummary from '@/components/cart/CartSummary';
import RecommendedServices from '@/components/cart/RecommendedServices';
import EmailPlanDialog from '@/components/cart/EmailPlanDialog';
import CartLoading from '@/components/cart/CartLoading';
import EmptyCart from '@/components/cart/EmptyCart';
import { useCartPage } from '@/hooks/useCartPage';

const Cart = () => {
  const {
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
  } = useCartPage();

  if (isLoading) {
    return (
      <Layout>
        <CartLoading />
      </Layout>
    );
  }

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container py-12">
          <h1 className="text-3xl font-bold mb-8">Carrinho de Compras</h1>
          <EmptyCart />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-8">Carrinho de Compras</h1>
        
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
            subtotal={items.reduce((acc, item) => acc + item.price * item.quantity, 0)}
            hasUnownedDomains={!allDomainsHaveOwnership}
            hasDomains={domainItems.length > 0}
            selectedBillingPeriod={selectedBillingPeriod}
            onBillingPeriodChange={setSelectedBillingPeriod}
            onRecalculatePrices={handleRecalculatePrices}
          />
        </div>
      </div>

      {currentDomainForOwnership && (
        <DomainOwnership 
          domain={currentDomainForOwnership}
          isOpen={isOwnershipDialogOpen}
          onClose={handleCloseOwnershipDialog}
          onSubmit={handleOwnershipSubmit}
          existingProfiles={[]}
        />
      )}

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
