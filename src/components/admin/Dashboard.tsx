
import { useRealtimeAdminDashboard } from "@/hooks/useRealtimeAdminDashboard";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { Clock, PackageOpen, CheckCircle, FileText, DollarSign, CreditCard, Globe } from "lucide-react";
import StatCard from "./dashboard/StatCard";
import RecentOrdersList from "./dashboard/RecentOrdersList";
import RecentInvoicesList from "./dashboard/RecentInvoicesList";
import ChartsSection from "./dashboard/ChartsSection";
import DashboardSkeleton from "./dashboard/DashboardSkeleton";
import { formatPrice } from "@/utils/formatters";

export default function Dashboard() {
  const { stats, loading } = useRealtimeAdminDashboard();
  const { stats: adminStats, isLoading: adminStatsLoading } = useAdminDashboard();
  
  if (loading || adminStatsLoading) {
    return <DashboardSkeleton />;
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
        <StatCard
          title="Pedidos Pendentes"
          value={stats.pendingOrders}
          description="Pedidos aguardando processamento"
          icon={Clock}
          iconColor="text-yellow-500"
          buttonText="Gerenciar Pedidos"
          buttonLink="/admin/orders"
        />
        
        <StatCard
          title="Pedidos Ativos"
          value={stats.activeOrders}
          description="Pedidos em processamento"
          icon={PackageOpen}
          iconColor="text-blue-500"
          buttonText="Ver Detalhes"
          buttonLink="/admin/orders"
        />
        
        <StatCard
          title="Pedidos Concluídos"
          value={stats.completedOrders}
          description="Pedidos finalizados com sucesso"
          icon={CheckCircle}
          iconColor="text-green-500"
          buttonText="Histórico de Pedidos"
          buttonLink="/admin/orders"
        />
        
        <StatCard
          title="Faturas Pendentes"
          value={stats.pendingInvoices}
          description="Faturas aguardando pagamento"
          icon={FileText}
          iconColor="text-yellow-500"
          buttonText="Ver Faturas"
          buttonLink="/admin/invoices"
        />
        
        <StatCard
          title="Faturas Pagas"
          value={stats.paidInvoices}
          description="Faturas com pagamento confirmado"
          icon={DollarSign}
          iconColor="text-green-500"
          buttonText="Ver Pagamentos"
          buttonLink="/admin/invoices"
        />
        
        <StatCard
          title="Métodos de Pagamento"
          value={stats.paymentMethodCount}
          description="Total de métodos de pagamento cadastrados"
          icon={CreditCard}
          iconColor="text-purple-500"
          buttonText="Gerenciar Métodos"
          buttonLink="/admin/payment-methods"
        />
        
        <StatCard
          title="Receita Total"
          value={formatPrice(stats.totalRevenue)}
          description="Total de receita confirmada"
          icon={DollarSign}
          iconColor="text-green-500"
          buttonText="Ver Relatórios"
          buttonLink="/admin/reports"
        />
        
        <StatCard
          title="Domínios Ativos"
          value={adminStats.activeDomains}
          description="Total de domínios ativos"
          icon={Globe}
          iconColor="text-blue-500"
          buttonText="Gerenciar Domínios"
          buttonLink="/admin/domains"
        />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <RecentOrdersList orders={stats.recentOrders} />
        <RecentInvoicesList invoices={stats.recentInvoices} />
      </div>
      
      <ChartsSection />
    </div>
  );
}
