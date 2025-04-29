
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"; 
import { ShieldCheck } from "lucide-react";
import SuperAdminSetupDialog from "@/components/admin/SuperAdminSetupDialog";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { supabase } from '@/integrations/supabase/client';
import { useRealtimeAdminDashboard } from '@/hooks/useRealtimeAdminDashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatPrice } from '@/utils/formatters';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Activity, 
  CreditCard, 
  DollarSign, 
  Package, 
  ShoppingCart, 
  Users 
} from 'lucide-react';

const Dashboard = () => {
  const [setupDialogOpen, setSetupDialogOpen] = useState(false);
  const { user } = useSupabaseAuth();
  const [isSuperAdminConfigured, setIsSuperAdminConfigured] = useState(true);
  const { stats, loading } = useRealtimeAdminDashboard();
  
  // Verificar se o super admin já existe
  useEffect(() => {
    const checkSuperAdmin = async () => {
      if (user?.email === 'support@angohost.ao') {
        setIsSuperAdminConfigured(true);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('email')
          .eq('email', 'support@angohost.ao')
          .eq('role', 'admin')
          .maybeSingle();
          
        setIsSuperAdminConfigured(!!data);
      } catch (error) {
        console.error("Erro ao verificar super admin:", error);
      }
    };
    
    checkSuperAdmin();
  }, [user]);

  return (
    <div>
      {!isSuperAdminConfigured && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <ShieldCheck className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Recomendamos configurar o super administrador do sistema para acesso completo.
              </p>
              <div className="mt-2">
                <Button 
                  onClick={() => setSetupDialogOpen(true)}
                  size="sm"
                  variant="outline"
                >
                  Configurar Super Admin
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Visão geral do sistema e estatísticas
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="analytics">Análise</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pedidos Pendentes
                  </CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? '...' : stats.pendingOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    Aguardando processamento
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Faturas Pendentes
                  </CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? '...' : stats.pendingInvoices}</div>
                  <p className="text-xs text-muted-foreground">
                    Aguardando pagamento
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loading ? '...' : formatPrice(stats.totalRevenue)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% em relação ao mês anterior
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Métodos de Pagamento
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? '...' : stats.paymentMethodCount}</div>
                  <p className="text-xs text-muted-foreground">
                    Ativos no sistema
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Pedidos Recentes</CardTitle>
                  <CardDescription>
                    {stats.recentOrders?.length || 0} pedidos recentes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
                      ))}
                    </div>
                  ) : stats.recentOrders?.length > 0 ? (
                    <div className="space-y-2">
                      {stats.recentOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between border-b pb-2">
                          <div>
                            <p className="font-medium">{order.orderNumber}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(order.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatPrice(order.totalAmount)}</p>
                            <p className={`text-xs ${
                              order.status === 'completed' 
                                ? 'text-green-500' 
                                : order.status === 'pending' 
                                  ? 'text-yellow-500' 
                                  : 'text-blue-500'
                            }`}>
                              {order.status === 'completed' 
                                ? 'Concluído' 
                                : order.status === 'pending' 
                                  ? 'Pendente' 
                                  : 'Processando'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-4">
                      Nenhum pedido recente encontrado
                    </p>
                  )}
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Faturas Recentes</CardTitle>
                  <CardDescription>
                    {stats.recentInvoices?.length || 0} faturas recentes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
                      ))}
                    </div>
                  ) : stats.recentInvoices?.length > 0 ? (
                    <div className="space-y-2">
                      {stats.recentInvoices.map((invoice) => (
                        <div key={invoice.id} className="flex items-center justify-between border-b pb-2">
                          <div>
                            <p className="font-medium">{invoice.invoice_number}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(invoice.due_date), "dd/MM/yyyy", { locale: ptBR })}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatPrice(invoice.amount)}</p>
                            <p className={`text-xs ${
                              invoice.status === 'paid' 
                                ? 'text-green-500' 
                                : invoice.status === 'pending' 
                                  ? 'text-yellow-500' 
                                  : 'text-red-500'
                            }`}>
                              {invoice.status === 'paid' 
                                ? 'Pago' 
                                : invoice.status === 'pending' 
                                  ? 'Pendente' 
                                  : 'Cancelado'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-4">
                      Nenhuma fatura recente encontrada
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Visão Geral de Vendas</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">Gráfico de vendas será exibido aqui</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição de Serviços</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">Gráfico de pizza será exibido aqui</p>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Tendências de Vendas</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">Gráfico de tendências será exibido aqui</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <SuperAdminSetupDialog 
        isOpen={setupDialogOpen} 
        onOpenChange={setSetupDialogOpen} 
      />
    </div>
  );
};

export default Dashboard;
