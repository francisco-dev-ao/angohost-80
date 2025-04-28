
import React from 'react';
import { useLocation } from 'react-router-dom';
import ClientDashboard from '@/components/client/ClientDashboard';
import DomainsPage from '@/components/client/DomainsPage';
import ServicesPage from '@/components/client/ServicesPage';
import InvoicesPage from '@/components/client/InvoicesPage';
import PaymentMethodsPage from '@/components/client/PaymentMethodsPage';
import SupportPage from '@/components/client/SupportPage';
import NotificationsPage from '@/components/client/NotificationsPage';
import PromotionsPage from '@/components/client/PromotionsPage';
import OrdersPage from '@/components/client/OrdersPage';
import ProfilePage from '@/components/client/ProfilePage';
import ContactProfilesPage from '@/components/client/ContactProfilesPage';

export const useClientRoutes = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const currentComponent = React.useMemo(() => {
    if (pathname === '/client') return <ClientDashboard />;
    if (pathname === '/client/profile') return <ProfilePage />;
    if (pathname === '/client/domains') return <DomainsPage />;
    if (pathname === '/client/services') return <ServicesPage />;
    if (pathname === '/client/invoices') return <InvoicesPage />;
    if (pathname === '/client/payment-methods') return <PaymentMethodsPage />;
    if (pathname === '/client/support') return <SupportPage />;
    if (pathname === '/client/notifications') return <NotificationsPage />;
    if (pathname === '/client/promotions') return <PromotionsPage />;
    if (pathname === '/client/orders') return <OrdersPage />;
    if (pathname === '/client/contact-profiles') return <ContactProfilesPage />;
    
    return <ClientDashboard />;
  }, [pathname]);

  return { currentComponent };
};
