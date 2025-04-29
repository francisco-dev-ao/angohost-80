
import React, { useState } from 'react';
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";

const AdminSettings = () => {
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "AngoHost",
    siteUrl: "https://angohost.ao",
    adminEmail: "support@angohost.ao",
    logoUrl: "/logo.png",
    enableMaintenance: false,
  });

  const [securitySettings, setSecuritySettings] = useState({
    enableTwoFactor: true,
    passwordExpiryDays: 90,
    sessionTimeout: 60,
    autoLogout: true,
    enforceStrongPassword: true,
  });

  const [paymentSettings, setPaymentSettings] = useState({
    currency: "AOA",
    enableAutoInvoicing: true,
    autoReminderDays: 3,
    paymentGracePeriod: 5,
    taxRate: 14,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    orderNotifications: true,
    paymentNotifications: true,
    systemNotifications: true,
  });

  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Configurações gerais atualizadas com sucesso");
  };

  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Configurações de segurança atualizadas com sucesso");
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Configurações de pagamento atualizadas com sucesso");
  };

  const handleNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Configurações de notificação atualizadas com sucesso");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie as configurações do sistema
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
            <TabsTrigger value="payment">Pagamento</TabsTrigger>
            <TabsTrigger value="notification">Notificações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <Card>
              <form onSubmit={handleGeneralSubmit}>
                <CardHeader>
                  <CardTitle>Configurações Gerais</CardTitle>
                  <CardDescription>
                    Configure os parâmetros básicos do site
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Nome do Site</Label>
                    <Input 
                      id="siteName" 
                      value={generalSettings.siteName}
                      onChange={e => setGeneralSettings({...generalSettings, siteName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="siteUrl">URL do Site</Label>
                    <Input 
                      id="siteUrl" 
                      value={generalSettings.siteUrl}
                      onChange={e => setGeneralSettings({...generalSettings, siteUrl: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">Email do Administrador</Label>
                    <Input 
                      id="adminEmail" 
                      value={generalSettings.adminEmail}
                      onChange={e => setGeneralSettings({...generalSettings, adminEmail: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="logoUrl">URL do Logo</Label>
                    <Input 
                      id="logoUrl" 
                      value={generalSettings.logoUrl}
                      onChange={e => setGeneralSettings({...generalSettings, logoUrl: e.target.value})}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="enableMaintenance"
                      checked={generalSettings.enableMaintenance}
                      onCheckedChange={checked => setGeneralSettings({...generalSettings, enableMaintenance: checked})}
                    />
                    <Label htmlFor="enableMaintenance">Ativar modo de manutenção</Label>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit">Salvar alterações</Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <form onSubmit={handleSecuritySubmit}>
                <CardHeader>
                  <CardTitle>Configurações de Segurança</CardTitle>
                  <CardDescription>
                    Configure os parâmetros de segurança da plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="enableTwoFactor"
                      checked={securitySettings.enableTwoFactor}
                      onCheckedChange={checked => setSecuritySettings({...securitySettings, enableTwoFactor: checked})}
                    />
                    <Label htmlFor="enableTwoFactor">Ativar autenticação de dois fatores</Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passwordExpiryDays">Expiração de senha (dias)</Label>
                    <Input 
                      id="passwordExpiryDays" 
                      type="number"
                      value={securitySettings.passwordExpiryDays}
                      onChange={e => setSecuritySettings({...securitySettings, passwordExpiryDays: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Tempo limite da sessão (minutos)</Label>
                    <Input 
                      id="sessionTimeout" 
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={e => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="autoLogout"
                      checked={securitySettings.autoLogout}
                      onCheckedChange={checked => setSecuritySettings({...securitySettings, autoLogout: checked})}
                    />
                    <Label htmlFor="autoLogout">Logout automático após tempo limite</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="enforceStrongPassword"
                      checked={securitySettings.enforceStrongPassword}
                      onCheckedChange={checked => setSecuritySettings({...securitySettings, enforceStrongPassword: checked})}
                    />
                    <Label htmlFor="enforceStrongPassword">Exigir senhas fortes</Label>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit">Salvar alterações</Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="payment" className="space-y-4">
            <Card>
              <form onSubmit={handlePaymentSubmit}>
                <CardHeader>
                  <CardTitle>Configurações de Pagamento</CardTitle>
                  <CardDescription>
                    Configure os parâmetros de faturamento e pagamento
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Moeda</Label>
                    <Input 
                      id="currency" 
                      value={paymentSettings.currency}
                      onChange={e => setPaymentSettings({...paymentSettings, currency: e.target.value})}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="enableAutoInvoicing"
                      checked={paymentSettings.enableAutoInvoicing}
                      onCheckedChange={checked => setPaymentSettings({...paymentSettings, enableAutoInvoicing: checked})}
                    />
                    <Label htmlFor="enableAutoInvoicing">Ativar faturamento automático</Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="autoReminderDays">Dias para lembrete automático</Label>
                    <Input 
                      id="autoReminderDays" 
                      type="number"
                      value={paymentSettings.autoReminderDays}
                      onChange={e => setPaymentSettings({...paymentSettings, autoReminderDays: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentGracePeriod">Período de carência para pagamento (dias)</Label>
                    <Input 
                      id="paymentGracePeriod" 
                      type="number"
                      value={paymentSettings.paymentGracePeriod}
                      onChange={e => setPaymentSettings({...paymentSettings, paymentGracePeriod: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxRate">Taxa de imposto (%)</Label>
                    <Input 
                      id="taxRate" 
                      type="number"
                      value={paymentSettings.taxRate}
                      onChange={e => setPaymentSettings({...paymentSettings, taxRate: parseInt(e.target.value)})}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit">Salvar alterações</Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="notification" className="space-y-4">
            <Card>
              <form onSubmit={handleNotificationSubmit}>
                <CardHeader>
                  <CardTitle>Configurações de Notificação</CardTitle>
                  <CardDescription>
                    Configure como as notificações são enviadas aos usuários
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="emailNotifications"
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={checked => setNotificationSettings({...notificationSettings, emailNotifications: checked})}
                    />
                    <Label htmlFor="emailNotifications">Ativar notificações por e-mail</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="smsNotifications"
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={checked => setNotificationSettings({...notificationSettings, smsNotifications: checked})}
                    />
                    <Label htmlFor="smsNotifications">Ativar notificações por SMS</Label>
                  </div>
                  <Separator className="my-4" />
                  <p className="text-sm font-medium">Tipos de notificação</p>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="orderNotifications"
                      checked={notificationSettings.orderNotifications}
                      onCheckedChange={checked => setNotificationSettings({...notificationSettings, orderNotifications: checked})}
                    />
                    <Label htmlFor="orderNotifications">Notificações de pedidos</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="paymentNotifications"
                      checked={notificationSettings.paymentNotifications}
                      onCheckedChange={checked => setNotificationSettings({...notificationSettings, paymentNotifications: checked})}
                    />
                    <Label htmlFor="paymentNotifications">Notificações de pagamento</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="systemNotifications"
                      checked={notificationSettings.systemNotifications}
                      onCheckedChange={checked => setNotificationSettings({...notificationSettings, systemNotifications: checked})}
                    />
                    <Label htmlFor="systemNotifications">Notificações do sistema</Label>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit">Salvar alterações</Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
