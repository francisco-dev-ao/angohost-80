
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  User,
  Globe,
  Server,
  FileText,
  CreditCard,
  MessageSquare,
  Bell,
  Tag,
  ClipboardList,
  Users,
  Wallet,
  Home,
} from "lucide-react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

const ClientSidebar = () => {
  const location = useLocation();
  const { user } = useSupabaseAuth();

  const menuItems = [
    {
      name: "Painel",
      icon: <Home className="h-4 w-4" />,
      path: "/client",
    },
    {
      name: "Perfil",
      icon: <User className="h-4 w-4" />,
      path: "/client/profile",
    },
    {
      name: "Domínios",
      icon: <Globe className="h-4 w-4" />,
      path: "/client/domains",
    },
    {
      name: "Serviços",
      icon: <Server className="h-4 w-4" />,
      path: "/client/services",
    },
    {
      name: "Faturas",
      icon: <FileText className="h-4 w-4" />,
      path: "/client/invoices",
    },
    {
      name: "Métodos de Pagamento",
      icon: <CreditCard className="h-4 w-4" />,
      path: "/client/payment-methods",
    },
    {
      name: "Carteira",
      icon: <Wallet className="h-4 w-4" />,
      path: "/client/wallet",
    },
    {
      name: "Suporte",
      icon: <MessageSquare className="h-4 w-4" />,
      path: "/client/support",
    },
    {
      name: "Notificações",
      icon: <Bell className="h-4 w-4" />,
      path: "/client/notifications",
    },
    {
      name: "Promoções",
      icon: <Tag className="h-4 w-4" />,
      path: "/client/promotions",
    },
    {
      name: "Pedidos",
      icon: <ClipboardList className="h-4 w-4" />,
      path: "/client/orders",
    },
    {
      name: "Perfis de Contato",
      icon: <Users className="h-4 w-4" />,
      path: "/client/contact-profiles",
    },
  ];

  if (!user) {
    return null; // Don't render the sidebar if there is no authenticated user
  }

  return (
    <div className="flex flex-col w-64 bg-white border-r h-screen shadow-md">
      <div className="p-4 border-b">
        <h2 className="font-bold text-lg text-primary">Área do Cliente</h2>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 w-8 h-8 flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div className="text-sm">
            <p className="font-medium">{user?.email}</p>
            <p className="text-xs text-muted-foreground">Cliente</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientSidebar;
