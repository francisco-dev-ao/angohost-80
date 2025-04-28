
import { useState, useEffect } from 'react';
import { useNavigate, Link, Outlet } from 'react-router-dom';
import { X, Menu, LayoutDashboard, Users, Package2, Globe, FileText, MessageSquareText, Mail, Settings, ShieldCheck, BarChart3 } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function AdminLayout() {
  const { isAdmin, isLoading } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminName, setAdminName] = useState('Admin');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminName = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .single();
            
          if (data?.full_name) {
            setAdminName(data.full_name);
          }
        }
      } catch (error) {
        console.error('Error fetching admin name:', error);
      }
    };
    
    fetchAdminName();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
      toast.success('Sessão encerrada com sucesso');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Erro ao encerrar sessão');
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="w-[600px] space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-[600px] w-full" />
        </div>
      </div>
    );
  }
  
  if (!isAdmin) {
    return null; // Auth hook will redirect
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar variant="sidebar" collapsible="offcanvas">
          <SidebarHeader>
            <div className="flex items-center justify-between px-4">
              <Link to="/admin" className="text-xl font-bold text-sidebar-foreground">
                AngoHost Admin
              </Link>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/admin">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/admin/users">
                    <Users />
                    <span>Clientes</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/admin/products">
                    <Package2 />
                    <span>Produtos e Serviços</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/admin/domains">
                    <Globe />
                    <span>Domínios</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/admin/invoices">
                    <FileText />
                    <span>Faturas</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/admin/tickets">
                    <MessageSquareText />
                    <span>Tickets de Suporte</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/admin/emails">
                    <Mail />
                    <span>E-mails</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/admin/settings">
                    <Settings />
                    <span>Configurações</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/admin/staff">
                    <ShieldCheck />
                    <span>Administradores</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/admin/reports">
                    <BarChart3 />
                    <span>Relatórios</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          
          <SidebarFooter>
            <div className="flex flex-col gap-2 p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <p className="font-medium">{adminName}</p>
                  <p className="text-xs text-muted-foreground">Administrador</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  Sair
                </Button>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex w-full flex-1 flex-col overflow-hidden">
          <header className="bg-background border-b px-4 py-3 flex items-center justify-between md:px-6">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Painel Administrativo</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="sm">
                <Link to="/">Voltar ao site</Link>
              </Button>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
