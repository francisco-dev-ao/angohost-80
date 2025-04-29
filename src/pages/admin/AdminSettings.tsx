
import React from 'react';
import AdminLayout from "@/components/admin/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import our custom hook and components
import { useAdminSettings } from "@/hooks/admin/useAdminSettings";
import { GeneralSettingsForm } from "@/components/admin/settings/GeneralSettingsForm";
import { SecuritySettingsForm } from "@/components/admin/settings/SecuritySettingsForm";
import { PaymentSettingsForm } from "@/components/admin/settings/PaymentSettingsForm";
import { SmtpSettingsForm } from "@/components/admin/settings/SmtpSettingsForm";
import { NotificationSettingsForm } from "@/components/admin/settings/NotificationSettingsForm";
import { SettingsHeader } from "@/components/admin/settings/SettingsHeader";
import { LoadingState } from "@/components/admin/settings/LoadingState";

const AdminSettings = () => {
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
    setSmtpSettings,
    saveSettings
  } = useAdminSettings();

  // Functions for saving each settings category
  const saveGeneralSettings = () => saveSettings('general', generalSettings);
  const saveSecuritySettings = () => saveSettings('security', securitySettings);
  const savePaymentSettings = () => saveSettings('payment', paymentSettings);
  const saveNotificationSettings = () => saveSettings('notification', notificationSettings);
  const saveSmtpSettings = () => saveSettings('smtp', smtpSettings);

  return (
    <AdminLayout>
      <div className="space-y-6 px-1 sm:px-4">
        <SettingsHeader />

        {loading ? (
          <LoadingState />
        ) : (
          <Tabs defaultValue="general" className="space-y-4">
            <div className="overflow-x-auto pb-2">
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="general" className="flex-1 sm:flex-none">Geral</TabsTrigger>
                <TabsTrigger value="security" className="flex-1 sm:flex-none">Segurança</TabsTrigger>
                <TabsTrigger value="payment" className="flex-1 sm:flex-none">Pagamento</TabsTrigger>
                <TabsTrigger value="smtp" className="flex-1 sm:flex-none">SMTP</TabsTrigger>
                <TabsTrigger value="notification" className="flex-1 sm:flex-none">Notificações</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="general" className="space-y-4">
              <GeneralSettingsForm 
                settings={generalSettings} 
                onSettingsChange={setGeneralSettings} 
                onSave={saveGeneralSettings}
              />
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <SecuritySettingsForm 
                settings={securitySettings} 
                onSettingsChange={setSecuritySettings}
                onSave={saveSecuritySettings}
              />
            </TabsContent>

            <TabsContent value="payment" className="space-y-4">
              <PaymentSettingsForm 
                settings={paymentSettings} 
                onSettingsChange={setPaymentSettings}
                onSave={savePaymentSettings}
              />
            </TabsContent>

            <TabsContent value="smtp" className="space-y-4">
              <SmtpSettingsForm 
                settings={smtpSettings} 
                onSettingsChange={setSmtpSettings}
                onSave={saveSmtpSettings}
              />
            </TabsContent>

            <TabsContent value="notification" className="space-y-4">
              <NotificationSettingsForm 
                settings={notificationSettings} 
                onSettingsChange={setNotificationSettings}
                onSave={saveNotificationSettings}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
