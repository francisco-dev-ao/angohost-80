
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  User,
  Globe,
  Server,
  FileText,
  LifeBuoy,
  Bell,
  Tag,
  LogOut,
  CreditCard,
  Home,
} from "lucide-react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ClientSidebar = () => {
  const location = useLocation();
  const { user, signOut } = useSupabaseAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
      toast.success("Sessão encerrada com sucesso");
    } catch (error) {
      toast.error("Erro ao encerrar sessão");
      console.error(error);
    }
  };

  return (
    <>
      <SidebarTrigger className="fixed top-20 left-4 z-50 md:hidden" />
      <Sidebar className="border-r border-border">
        <SidebarContent className="w-[240px]">
          <div className="py-4 px-4 border-b">
            <h2 className="font-semibold text-lg">Área do Cliente</h2>
            <p className="text-sm text-muted-foreground">
              {user?.email}
            </p>
          </div>
          
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/client"
                    className={`flex items-center gap-2 w-full px-2 py-2 rounded hover:bg-accent ${
                      location.pathname === "/client" ? "bg-accent" : ""
                    }`}
                    end
                  >
                    <Home size={18} />
                    <span>Dashboard</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/client/profile"
                    className={`flex items-center gap-2 w-full px-2 py-2 rounded hover:bg-accent ${
                      location.pathname === "/client/profile" ? "bg-accent" : ""
                    }`}
                  >
                    <User size={18} />
                    <span>Meu Perfil</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/client/domains"
                    className={`flex items-center gap-2 w-full px-2 py-2 rounded hover:bg-accent ${
                      location.pathname.includes("/client/domains") ? "bg-accent" : ""
                    }`}
                  >
                    <Globe size={18} />
                    <span>Meus Domínios</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/client/services"
                    className={`flex items-center gap-2 w-full px-2 py-2 rounded hover:bg-accent ${
                      location.pathname.includes("/client/services") ? "bg-accent" : ""
                    }`}
                  >
                    <Server size={18} />
                    <span>Meus Serviços</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/client/invoices"
                    className={`flex items-center gap-2 w-full px-2 py-2 rounded hover:bg-accent ${
                      location.pathname.includes("/client/invoices") ? "bg-accent" : ""
                    }`}
                  >
                    <FileText size={18} />
                    <span>Faturas</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/client/payment-methods"
                    className={`flex items-center gap-2 w-full px-2 py-2 rounded hover:bg-accent ${
                      location.pathname.includes("/client/payment-methods") ? "bg-accent" : ""
                    }`}
                  >
                    <CreditCard size={18} />
                    <span>Métodos de Pagamento</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/client/support"
                    className={`flex items-center gap-2 w-full px-2 py-2 rounded hover:bg-accent ${
                      location.pathname.includes("/client/support") ? "bg-accent" : ""
                    }`}
                  >
                    <LifeBuoy size={18} />
                    <span>Suporte</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/client/notifications"
                    className={`flex items-center gap-2 w-full px-2 py-2 rounded hover:bg-accent ${
                      location.pathname.includes("/client/notifications") ? "bg-accent" : ""
                    }`}
                  >
                    <Bell size={18} />
                    <span>Notificações</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/client/promotions"
                    className={`flex items-center gap-2 w-full px-2 py-2 rounded hover:bg-accent ${
                      location.pathname.includes("/client/promotions") ? "bg-accent" : ""
                    }`}
                  >
                    <Tag size={18} />
                    <span>Promoções</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          
          <div className="mt-auto p-4">
            <Button 
              variant="outline" 
              className="w-full flex items-center gap-2 justify-center"
              onClick={handleSignOut}
            >
              <LogOut size={18} />
              <span>Sair</span>
            </Button>
          </div>
        </SidebarContent>
      </Sidebar>
    </>
  );
};

export default ClientSidebar;
