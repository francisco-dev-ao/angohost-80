
import { useRealtimeAdminDashboard } from '@/hooks/useRealtimeAdminDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { 
  BarChart,
  LineChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer 
} from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  CreditCard,
  FileText,
  Package,
  PackageOpen,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  ShoppingCart,
  Eye
} from 'lucide-react';
import { formatPrice } from '@/utils/formatters';

// Sample data for charts
const salesData = [
  { name: 'Jan', value: 1200 },
  { name: 'Fev', value: 1900 },
  { name: 'Mar', value: 1500 },
  { name: 'Abr', value: 2200 },
  { name: 'Mai', value: 1800 },
  { name: 'Jun', value: 2800 },
  { name: 'Jul', value: 2100 },
  { name: 'Ago', value: 2500 },
  { name: 'Set', value: 2800 },
  { name: 'Out', value: 3200 },
  { name: 'Nov', value: 3800 },
  { name: 'Dez', value: 4100 },
];

const registrationsData = [
  { name: 'Dom', domains: 4, hosting: 2 },
  { name: 'Seg', domains: 3, hosting: 1 },
  { name: 'Ter', domains: 5, hosting: 3 },
  { name: 'Qua', domains: 7, hosting: 5 },
  { name: 'Qui', domains: 2, hosting: 4 },
  { name: 'Sex', domains: 6, hosting: 2 },
  { name: 'Sab', domains: 8, hosting: 6 },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { stats, loading } = useRealtimeAdminDashboard();
  const { stats: adminStats, isLoading: adminStatsLoading } = useAdminDashboard();
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800">Processando</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Concluído</Badge>;
      case 'canceled':
        return <Badge className="bg-red-100 text-red-800">Cancelado</Badge>;
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Pago</Badge>;
      case 'refunded':
        return <Badge className="bg-blue-100 text-blue-800">Reembolsado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  if (loading || adminStatsLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-1/3" />
            </CardContent>
          </Card>
        ))}
        
        <div className="col-span-full">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/4" />
            </CardHeader>
            <CardContent className="h-[300px]">
              <Skeleton className="h-full w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Visão geral das operações da AngoHost.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              Pedidos aguardando processamento
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full" 
              onClick={() => navigate('/admin/orders')}
            >
              Gerenciar Pedidos
            </Button>
          </CardContent>
        </Card>
        
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Ativos</CardTitle>
            <PackageOpen className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeOrders}</div>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              Pedidos em processamento
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full" 
              onClick={() => navigate('/admin/orders')}
            >
              Ver Detalhes
            </Button>
          </CardContent>
        </Card>
        
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Concluídos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedOrders}</div>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              Pedidos finalizados com sucesso
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full" 
              onClick={() => navigate('/admin/orders')}
            >
              Histórico de Pedidos
            </Button>
          </CardContent>
        </Card>
        
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Faturas Pendentes</CardTitle>
            <FileText className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingInvoices}</div>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              Faturas aguardando pagamento
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full" 
              onClick={() => navigate('/admin/invoices')}
            >
              Ver Faturas
            </Button>
          </CardContent>
        </Card>
        
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Faturas Pagas</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.paidInvoices}</div>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              Faturas com pagamento confirmado
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full" 
              onClick={() => navigate('/admin/invoices')}
            >
              Ver Pagamentos
            </Button>
          </CardContent>
        </Card>
        
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Métodos de Pagamento</CardTitle>
            <CreditCard className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.paymentMethodCount}</div>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              Total de métodos de pagamento cadastrados
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full" 
              onClick={() => navigate('/admin/payment-methods')}
            >
              Gerenciar Métodos
            </Button>
          </CardContent>
        </Card>
        
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              Total de receita confirmada
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full" 
              onClick={() => navigate('/admin/reports')}
            >
              Ver Relatórios
            </Button>
          </CardContent>
        </Card>
        
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Domínios Ativos</CardTitle>
            <Globe className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminStats.activeDomains}</div>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              Total de domínios ativos
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full" 
              onClick={() => navigate('/admin/domains')}
            >
              Gerenciar Domínios
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pedidos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentOrders.length > 0 ? (
              <div className="space-y-4">
                {stats.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div>{formatPrice(order.totalAmount)}</div>
                      <div>{getStatusBadge(order.status)}</div>
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/orders?id=${order.id}`)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => navigate('/admin/orders')}
                >
                  Ver Todos os Pedidos
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <ShoppingCart className="h-12 w-12 text-muted-foreground/50 mb-2" />
                <p>Nenhum pedido recente encontrado</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Faturas Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentInvoices.length > 0 ? (
              <div className="space-y-4">
                {stats.recentInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{invoice.invoice_number}</p>
                      <p className="text-sm text-muted-foreground">
                        Vencimento: {format(new Date(invoice.due_date), 'dd/MM/yyyy', { locale: ptBR })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div>{formatPrice(invoice.amount)}</div>
                      <div>{getStatusBadge(invoice.status)}</div>
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/invoices?id=${invoice.id}`)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => navigate('/admin/invoices')}
                >
                  Ver Todas as Faturas
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <FileText className="h-12 w-12 text-muted-foreground/50 mb-2" />
                <p>Nenhuma fatura recente encontrada</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Vendas Mensais</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  name="Vendas (AOA)"
                  stroke="#8884d8" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Registros Semanais</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={registrationsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="domains" name="Domínios" fill="#8884d8" />
                <Bar dataKey="hosting" name="Hospedagem" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Get extra imports from the original Dashboard component
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { Globe } from 'lucide-react';
