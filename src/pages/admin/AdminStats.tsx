
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
  ResponsiveContainer,
} from "recharts";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";

const AdminStats = () => {
  const { stats, isLoading } = useAdminDashboard();
  
  // Sample data for detailed charts
  const monthlySalesData = [
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

  const userGrowthData = [
    { name: 'Jan', value: 10 },
    { name: 'Fev', value: 25 },
    { name: 'Mar', value: 40 },
    { name: 'Abr', value: 65 },
    { name: 'Mai', value: 85 },
    { name: 'Jun', value: 105 },
    { name: 'Jul', value: 130 },
    { name: 'Ago', value: 160 },
    { name: 'Set', value: 190 },
    { name: 'Out', value: 220 },
    { name: 'Nov', value: 260 },
    { name: 'Dez', value: 310 },
  ];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">Estatísticas</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/4" />
              </CardHeader>
              <CardContent className="h-[400px]">
                <Skeleton className="h-full w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/4" />
              </CardHeader>
              <CardContent className="h-[400px]">
                <Skeleton className="h-full w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Estatísticas</h2>
        <p className="text-muted-foreground">
          Análises detalhadas de desempenho da AngoHost.
        </p>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Vendas Totais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSales.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'AOA'
              })}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeDomains + stats.activeHostings}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7.2%</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Tempo Médio de Resposta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1h 24m</div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Vendas Mensais (AOA)</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlySalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value.toLocaleString('pt-BR', { style: 'currency', currency: 'AOA' })}`} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    name="Vendas" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Crescimento de Usuários</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Usuários" fill="#4C1D95" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminStats;
