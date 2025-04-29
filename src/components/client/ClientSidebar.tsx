
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
} from "lucide-react";

const ClientSidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const menuItems = [
    {
      name: "Painel",
      icon: <ClipboardList className="h-4 w-4" />,
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

  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r h-full">
      <div className="p-4">
        <h2 className="font-bold text-lg text-primary">Área do Cliente</h2>
      </div>

      <nav className="flex-1 p-4 space-y-1">
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
    </div>
  );
};

export default ClientSidebar;
