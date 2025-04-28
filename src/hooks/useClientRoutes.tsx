
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ProfilePage from "@/components/client/ProfilePage";
import ClientDashboard from "@/components/client/ClientDashboard";

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
      // More routes will be implemented as needed
    ];
    
    // Find matching route
    const currentRoute = clientRoutes.find(route => location.pathname === route.path);
    
    // If found, set the component, otherwise default to dashboard
    if (currentRoute) {
      setCurrentComponent(currentRoute.component);
    } else if (location.pathname.startsWith("/client")) {
      // If it's a client path but not implemented yet, show dashboard temporarily
      setCurrentComponent(<ClientDashboard />);
    }
  }, [location.pathname]);
  
  return { currentComponent };
};
