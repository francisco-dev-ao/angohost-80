
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAbandonedCarts } from '@/hooks/useAbandonedCarts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Eye, Send } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const AdminAbandonedCarts = () => {
  const navigate = useNavigate();
  const {
    abandonedCarts,
    isLoading,
    timeRange,
    setTimeRange,
    reminderConfigurations,
    sendManualReminder,
  } = useAbandonedCarts();
  
  const [activeTab, setActiveTab] = useState('carts');

  const getOverviewStats = () => {
    const totalCarts = abandonedCarts.length;
    const registeredUserCarts = abandonedCarts.filter(cart => !cart.is_guest).length;
    const guestCarts = abandonedCarts.filter(cart => cart.is_guest).length;
    
    return {
      totalCarts,
      registeredUserCarts,
      guestCarts,
      registeredPercentage: totalCarts > 0 ? (registeredUserCarts / totalCarts) * 100 : 0,
      guestPercentage: totalCarts > 0 ? (guestCarts / totalCarts) * 100 : 0,
    };
  };

  const handleViewCart = (cart: any) => {
    // Implement this function if needed
    console.log("View cart:", cart);
  };

  const handleSendReminder = async (cartId: string) => {
    await sendManualReminder(cartId);
  };

  const stats = getOverviewStats();

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Carrinhos Abandonados</h1>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="90d">Últimos 90 dias</SelectItem>
              <SelectItem value="365d">Últimos 12 meses</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Total de Carrinhos</CardTitle>
              <CardDescription>Carrinhos abandonados no período</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{stats.totalCarts}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Usuários Registrados</CardTitle>
              <CardDescription>Carrinhos de usuários registrados</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{stats.registeredUserCarts}</p>
              <p className="text-sm text-muted-foreground">
                {stats.registeredPercentage.toFixed(1)}% do total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Visitantes</CardTitle>
              <CardDescription>Carrinhos de visitantes não registrados</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{stats.guestCarts}</p>
              <p className="text-sm text-muted-foreground">
                {stats.guestPercentage.toFixed(1)}% do total
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="carts">Carrinhos Abandonados</TabsTrigger>
            <TabsTrigger value="reminders">Configurações de Lembretes</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="carts">
            <Card>
              <CardHeader>
                <CardTitle>Carrinhos Abandonados</CardTitle>
                <CardDescription>
                  Lista de todos os carrinhos abandonados no período selecionado
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-10">Carregando...</div>
                ) : abandonedCarts.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">Não há carrinhos abandonados no período selecionado</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Itens</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Último Lembrete</TableHead>
                        <TableHead>Lembretes</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {abandonedCarts.map((cart) => (
                        <TableRow key={cart.id}>
                          <TableCell>
                            {cart.is_guest ? (
                              <span>{cart.email || 'Visitante'}</span>
                            ) : (
                              <span>
                                {cart.profiles?.full_name || cart.email || 'Usuário'}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {Array.isArray(cart.cart_items) ? cart.cart_items.length : 0} itens
                          </TableCell>
                          <TableCell>
                            {format(new Date(cart.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                          </TableCell>
                          <TableCell>
                            {cart.last_notification_at ? (
                              format(new Date(cart.last_notification_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })
                            ) : (
                              <span className="text-muted-foreground">Nenhum</span>
                            )}
                          </TableCell>
                          <TableCell>{cart.notification_count || 0}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleViewCart(cart)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleSendReminder(cart.id)}
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reminders">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Configurações de Lembretes</CardTitle>
                  <CardDescription>Gerencie os lembretes para carrinhos abandonados</CardDescription>
                </div>
                <Button onClick={() => navigate('/admin/abandoned-carts/reminder/new')}>
                  Novo Lembrete
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Atraso (horas)</TableHead>
                      <TableHead>Template de Email</TableHead>
                      <TableHead>Template para Convidados</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reminderConfigurations.map((config) => (
                      <TableRow key={config.id}>
                        <TableCell>{config.name}</TableCell>
                        <TableCell>{config.delay_hours}</TableCell>
                        <TableCell>{config.email_template?.name || 'Não definido'}</TableCell>
                        <TableCell>{config.guest_email_template?.name || 'Não definido'}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            config.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {config.is_active ? 'Ativo' : 'Inativo'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/admin/abandoned-carts/reminder/${config.id}`)}
                          >
                            Editar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {reminderConfigurations.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                          Nenhuma configuração de lembrete encontrada
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Módulo</CardTitle>
                <CardDescription>Configure as opções do módulo de carrinhos abandonados</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Settings form would go here */}
                <Button 
                  variant="outline"
                  onClick={() => navigate('/admin/abandoned-carts/settings')}
                >
                  Editar Configurações
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminAbandonedCarts;
