
import React from 'react';
import AdminLayout from "@/components/admin/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";

// Import our custom hook and component forms
import { useAdminSettings } from "@/hooks/admin/useAdminSettings";
import { GeneralSettingsForm } from "@/components/admin/settings/GeneralSettingsForm";
import { SecuritySettingsForm } from "@/components/admin/settings/SecuritySettingsForm";
import { PaymentSettingsForm } from "@/components/admin/settings/PaymentSettingsForm";
import { SmtpSettingsForm } from "@/components/admin/settings/SmtpSettingsForm";
import { NotificationSettingsForm } from "@/components/admin/settings/NotificationSettingsForm";

const AdminSettings = () => {
  const { theme, setTheme } = useTheme();
  const { 
    loading,
    generalSettings,
    securitySettings,
    paymentSettings,
    notificationSettings,
    smtpSettings,
    setGeneralSettings,
    setSecuritySettings,
    setPaymentSettings,
    setNotificationSettings,
    setSmtpSettings
  } = useAdminSettings();

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
            <p className="text-muted-foreground">
              Gerencie as configurações do sistema
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              )}
              <span className="sr-only">Alternar tema</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
            <TabsTrigger value="payment">Pagamento</TabsTrigger>
            <TabsTrigger value="smtp">SMTP</TabsTrigger>
            <TabsTrigger value="notification">Notificações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <GeneralSettingsForm 
              settings={generalSettings} 
              onSettingsChange={setGeneralSettings} 
            />
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <SecuritySettingsForm 
              settings={securitySettings} 
              onSettingsChange={setSecuritySettings} 
            />
          </TabsContent>

          <TabsContent value="payment" className="space-y-4">
            <PaymentSettingsForm 
              settings={paymentSettings} 
              onSettingsChange={setPaymentSettings} 
            />
          </TabsContent>

          <TabsContent value="smtp" className="space-y-4">
            <SmtpSettingsForm 
              settings={smtpSettings} 
              onSettingsChange={setSmtpSettings} 
            />
          </TabsContent>

          <TabsContent value="notification" className="space-y-4">
            <NotificationSettingsForm 
              settings={notificationSettings} 
              onSettingsChange={setNotificationSettings} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
