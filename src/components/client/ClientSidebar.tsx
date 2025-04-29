
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocation, useNavigate } from "react-router-dom";
import { useSidebar } from "@/components/ui/sidebar";
import { 
  CreditCard, 
  FileText, 
  Home, 
  LayoutGrid, 
  LogOut, 
  Mail, 
  Package, 
  Server, 
  Settings, 
  Ticket, 
  User,
  Users,
  Globe,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Separator } from "@/components/ui/separator";

const ClientSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isOpen, setIsOpen } = useSidebar();
  const { user, signOut } = useSupabaseAuth();

  const menuItems = [
    {
      title: "Painel",
      href: "/client",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "Meu Perfil",
      href: "/client/profile",
      icon: <User className="h-5 w-5" />,
    },
    {
      title: "Serviços",
      href: "/client/services",
      icon: <Server className="h-5 w-5" />,
    },
    {
      title: "Domínios",
      href: "/client/domains",
      icon: <Globe className="h-5 w-5" />,
    },
    {
      title: "Pedidos",
      href: "/client/orders",
      icon: <Package className="h-5 w-5" />,
    },
    {
      title: "Faturas",
      href: "/client/invoices",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Métodos de Pagamento",
      href: "/client/payment-methods",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      title: "Perfis de Contato",
      href: "/client/contact-profiles",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Suporte",
      href: "/client/support",
      icon: <Ticket className="h-5 w-5" />,
    },
    {
      title: "Notificações",
      href: "/client/notifications",
      icon: <Mail className="h-5 w-5" />,
    },
    {
      title: "Promoções",
      href: "/client/promotions",
      icon: <LayoutGrid className="h-5 w-5" />,
    },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div
      className={cn(
        "border-r bg-card transition-all duration-300 h-screen sticky top-0",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div className="h-full flex flex-col">
        <div className="p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user?.email?.substring(0, 2).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className={cn("transition-all", !isOpen && "hidden")}>
              <div className="font-medium">{user?.user_metadata?.full_name || "Usuário"}</div>
              <div className="text-xs text-muted-foreground truncate max-w-[160px]">{user?.email}</div>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute -right-3 top-5 bg-background border shadow-sm"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
        <Separator />
        <ScrollArea className="flex-1 px-3 py-4">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.href}
                variant={location.pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  !isOpen && "justify-center px-2"
                )}
                onClick={() => navigate(item.href)}
              >
                {item.icon}
                <span
                  className={cn(
                    "ml-3 transition-all",
                    !isOpen && "hidden"
                  )}
                >
                  {item.title}
                </span>
              </Button>
            ))}
          </div>
        </ScrollArea>
        <div className="p-4">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start",
              !isOpen && "justify-center px-2"
            )}
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5" />
            <span
              className={cn(
                "ml-3 transition-all",
                !isOpen && "hidden"
              )}
            >
              Sair
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClientSidebar;
