
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSidebar } from "../../ui/sidebar";
import { 
  CreditCard, 
  FileText, 
  Home, 
  LayoutGrid, 
  Mail, 
  Package, 
  Server, 
  Settings, 
  Users,
  Globe,
  Shield,
  Receipt,
  ShoppingCart
} from "lucide-react";

export interface MenuItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

interface AdminSidebarMenuItemsProps {
  isOpen: boolean;
  isSuperAdmin: boolean;
}

const AdminSidebarMenuItems = ({ isOpen, isSuperAdmin }: AdminSidebarMenuItemsProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const menuItems = [
    {
      title: "Painel",
      href: "/admin",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "Domínios",
      href: "/admin/domains",
      icon: <Globe className="h-5 w-5" />,
    },
    {
      title: "Usuários",
      href: "/admin/users",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Produtos",
      href: "/admin/products",
      icon: <Package className="h-5 w-5" />,
    },
    {
      title: "Extensões de Domínio",
      href: "/admin/domain-extensions",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Planos de Serviço",
      href: "/admin/service-plans",
      icon: <Server className="h-5 w-5" />,
    },
    {
      title: "Conteúdo da Página",
      href: "/admin/page-contents",
      icon: <LayoutGrid className="h-5 w-5" />,
    },
    {
      title: "Pedidos",
      href: "/admin/orders",
      icon: <Package className="h-5 w-5" />,
    },
    {
      title: "Faturas",
      href: "/admin/invoices",
      icon: <Receipt className="h-5 w-5" />,
    },
    {
      title: "Métodos de Pagamento",
      href: "/admin/payment-methods",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      title: "Carrinhos Abandonados",
      href: "/admin/abandoned-carts",
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      title: "Templates de Email",
      href: "/admin/email-templates",
      icon: <Mail className="h-5 w-5" />,
    },
    {
      title: "Configurações",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <div className="space-y-1">
      {menuItems.map((item) => {
        // Special styling for admin-related items when the user is super admin
        const isAdminItem = item.href.includes('/admin');
        const isSuperAdminItem = isSuperAdmin && isAdminItem;
        
        return (
          <Button
            key={item.href}
            variant={location.pathname === item.href ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start",
              !isOpen && "justify-center px-2",
              isSuperAdminItem && "bg-red-100 hover:bg-red-200",
              location.pathname === item.href && isSuperAdminItem && "bg-red-200"
            )}
            onClick={() => navigate(item.href)}
          >
            {isSuperAdminItem ? (
              <span className="text-red-600">{item.icon}</span>
            ) : (
              item.icon
            )}
            <span
              className={cn(
                "ml-3 transition-all",
                !isOpen && "hidden",
                isSuperAdminItem && "text-red-600 font-medium"
              )}
            >
              {item.title}
            </span>
          </Button>
        );
      })}
    </div>
  );
};

export default AdminSidebarMenuItems;
