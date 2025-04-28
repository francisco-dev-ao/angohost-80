import React, { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
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
  SidebarProvider
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BarChart,
  Users,
  Settings,
  Box,
  Globe,
  Server,
  CreditCard,
  FileText,
  LifeBuoy,
  Mail,
  LogOut,
  Home,
} from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const { isAdmin, isLoading } = useAdminAuth();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      navigate('/register');
      toast.success('Sessão encerrada com sucesso');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao encerrar sessão');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will be redirected by useAdminAuth
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarProvider>
        <SidebarTrigger className="fixed top-4 left-4 z-50 md:hidden" />
        
        <Sidebar className="border-r">
          <SidebarContent className="w-[240px]">
            <div className="py-4 px-4 border-b">
              <h2 className="font-semibold text-lg">Área Administrativa</h2>
              <p className="text-sm text-muted-foreground">Gerencie todos os aspectos da plataforma</p>
            </div>
            
            <ScrollArea className="h-[calc(100vh-108px)]">
              <div className="px-3 py-2">
                <SidebarGroup>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start"
                          onClick={() => navigate('/admin')}
                        >
                          <Home className="mr-2 h-4 w-4" />
                          Dashboard
                        </Button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start"
                          onClick={() => navigate('/admin/stats')}
                        >
                          <BarChart className="mr-2 h-4 w-4" />
                          Estatísticas
                        </Button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroup>
                
                <SidebarGroup>
                  <SidebarGroupLabel>Usuários</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start"
                            onClick={() => navigate('/admin/users')}
                          >
                            <Users className="mr-2 h-4 w-4" />
                            Gerenciar Usuários
                          </Button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
                
                <SidebarGroup>
                  <SidebarGroupLabel>Produtos</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start"
                            onClick={() => navigate('/admin/products')}
                          >
                            <Box className="mr-2 h-4 w-4" />
                            Produtos/Serviços
                          </Button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start"
                            onClick={() => navigate('/admin/domains')}
                          >
                            <Globe className="mr-2 h-4 w-4" />
                            Domínios
                          </Button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start"
                            onClick={() => navigate('/admin/hosting')}
                          >
                            <Server className="mr-2 h-4 w-4" />
                            Hospedagem
                          </Button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
                
                <SidebarGroup>
                  <SidebarGroupLabel>Financeiro</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start"
                            onClick={() => navigate('/admin/orders')}
                          >
                            <CreditCard className="mr-2 h-4 w-4" />
                            Pedidos
                          </Button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start"
                            onClick={() => navigate('/admin/invoices')}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            Faturas
                          </Button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
                
                <SidebarGroup>
                  <SidebarGroupLabel>Suporte</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start"
                            onClick={() => navigate('/admin/tickets')}
                          >
                            <LifeBuoy className="mr-2 h-4 w-4" />
                            Tickets
                          </Button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start"
                            onClick={() => navigate('/admin/email-templates')}
                          >
                            <Mail className="mr-2 h-4 w-4" />
                            Templates de Email
                          </Button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
                
                <SidebarGroup>
                  <SidebarGroupLabel>Sistema</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start"
                            onClick={() => navigate('/admin/settings')}
                          >
                            <Settings className="mr-2 h-4 w-4" />
                            Configurações
                          </Button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start text-red-500 hover:text-red-600"
                            onClick={handleSignOut}
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            Sair
                          </Button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </div>
            </ScrollArea>
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 overflow-auto bg-background">
          <div className="container py-4">
            {children}
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default AdminLayout;
