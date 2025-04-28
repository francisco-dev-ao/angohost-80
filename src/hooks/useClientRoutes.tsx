import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ProfilePage from "@/components/client/ProfilePage";
import ClientDashboard from "@/components/client/ClientDashboard";
import DomainsPage from "@/components/client/DomainsPage";
import ServicesPage from "@/components/client/ServicesPage";
import InvoicesPage from "@/components/client/InvoicesPage";
import PaymentMethodsPage from "@/components/client/PaymentMethodsPage";
import SupportPage from "@/components/client/SupportPage";
import NotificationsPage from "@/components/client/NotificationsPage";
import PromotionsPage from "@/components/client/PromotionsPage";
import OrdersPage from "@/components/client/OrdersPage";

interface ClientRoute {
  path: string;
  component: React.ReactNode;
}

export const useClientRoutes = () => {
  const location = useLocation();
  const [currentComponent, setCurrentComponent] = useState<React.ReactNode | null>(null);
  
  useEffect(() => {
    const clientRoutes: ClientRoute[] = [
      {
        path: "/client",
        component: <ClientDashboard />,
      },
      {
        path: "/client/profile",
        component: <ProfilePage />,
      },
      {
        path: "/client/domains",
        component: <DomainsPage />,
      },
      {
        path: "/client/services",
        component: <ServicesPage />,
      },
      {
        path: "/client/invoices",
        component: <InvoicesPage />,
      },
      {
        path: "/client/payment-methods",
        component: <PaymentMethodsPage />,
      },
      {
        path: "/client/support",
        component: <SupportPage />,
      },
      {
        path: "/client/notifications",
        component: <NotificationsPage />,
      },
      {
        path: "/client/promotions",
        component: <PromotionsPage />,
      },
      {
        path: "/client/orders",
        component: <OrdersPage />,
      },
    ];
    
    const currentRoute = clientRoutes.find(route => location.pathname === route.path);
    
    if (currentRoute) {
      setCurrentComponent(currentRoute.component);
    } else if (location.pathname.startsWith("/client")) {
      setCurrentComponent(<ClientDashboard />);
    }
  }, [location.pathname]);
  
  return { currentComponent };
};
