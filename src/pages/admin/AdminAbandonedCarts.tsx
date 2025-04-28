
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAbandonedCarts } from '@/hooks/useAbandonedCarts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart, Loader2, Bell, RotateCw, CheckCircle } from "lucide-react";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatPrice } from '@/utils/formatters';

const AdminAbandonedCarts = () => {
  const { 
    abandonedCarts, 
    isLoading, 
    timeRange, 
    setTimeRange,
    sendManualReminder,
    recoverAbandonedCart
  } = useAbandonedCarts();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [processingCart, setProcessingCart] = useState<string | null>(null);
  
  const filteredCarts = searchTerm 
    ? abandonedCarts.filter(cart => 
        (cart.email && cart.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (cart.profiles?.full_name && cart.profiles.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : abandonedCarts;
    
  const handleSendReminder = async (cartId: string) => {
    setProcessingCart(cartId);
    await sendManualReminder(cartId);
    setProcessingCart(null);
  };
  
  const handleMarkRecovered = async (cartId: string) => {
    setProcessingCart(cartId);
    await recoverAbandonedCart(cartId);
    setProcessingCart(null);
  };
  
  const getCartTotal = (cart: any) => {
    if (!cart.cart_items || !Array.isArray(cart.cart_items)) return 0;
    return cart.cart_items.reduce((total: number, item: any) => {
      const price = item.price || 0;
      const quantity = item.quantity || 1;
      return total + (price * quantity);
    }, 0);
  };
  
  const getTotalValue = () => {
    return filteredCarts.reduce((total, cart) => total + getCartTotal(cart), 0);
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Carrinhos Abandonados</h2>
            <p className="text-muted-foreground">
              Gerencie e recupere carrinhos abandonados pelos clientes
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="90d">Últimos 90 dias</SelectItem>
                <SelectItem value="365d">Último ano</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RotateCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{filteredCarts.length}</CardTitle>
              <CardDescription>Carrinhos abandonados</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{formatPrice(getTotalValue())}</CardTitle>
              <CardDescription>Valor total</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">
                {filteredCarts.length > 0
                  ? formatPrice(getTotalValue() / filteredCarts.length)
                  : formatPrice(0)}
              </CardTitle>
              <CardDescription>Valor médio</CardDescription>
            </CardHeader>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Lista de Carrinhos Abandonados</CardTitle>
            <CardDescription>
              Envie lembretes ou recupere carrinhos abandonados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por e-mail ou nome do cliente..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center p-6">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Carregando...</span>
              </div>
            ) : filteredCarts.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Itens</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Lembretes</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCarts.map((cart) => (
                      <TableRow key={cart.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{cart.profiles?.full_name || 'Cliente não identificado'}</p>
                            <p className="text-sm text-muted-foreground">{cart.email || 'Sem e-mail'}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {format(new Date(cart.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                        </TableCell>
                        <TableCell>
                          {Array.isArray(cart.cart_items) ? cart.cart_items.length : 0} itens
                        </TableCell>
                        <TableCell>
                          {formatPrice(getCartTotal(cart))}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className="mr-2">{cart.notification_count || 0}</span>
                            {cart.last_notification_at && (
                              <span className="text-xs text-muted-foreground">
                                último em {format(new Date(cart.last_notification_at), 'dd/MM HH:mm', { locale: ptBR })}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              disabled={processingCart === cart.id}
                              onClick={() => handleSendReminder(cart.id)}
                            >
                              {processingCart === cart.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Bell className="h-4 w-4" />
                              )}
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              disabled={processingCart === cart.id}
                              onClick={() => handleMarkRecovered(cart.id)}
                            >
                              {processingCart === cart.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <ShoppingCart className="h-10 w-10 text-muted-foreground/50 mb-3" />
                <p className="font-medium">Nenhum carrinho abandonado encontrado</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchTerm ? 'Tente uma busca diferente' : 'Todos os carrinhos foram recuperados ou foram criados há mais de 30 dias'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

export default AdminAbandonedCarts;
