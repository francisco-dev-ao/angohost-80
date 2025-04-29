
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

export const useAdminSettings = () => {
  const [loading, setLoading] = useState(true);
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

  const [smtpSettings, setSmtpSettings] = useState({
    smtpServer: "",
    smtpPort: "587",
    smtpUser: "",
    smtpPassword: "",
    smtpFromEmail: "",
    smtpFromName: "AngoHost",
    smtpSecureConnection: true,
  });

  // Load settings from Supabase
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        
        const fetchSettings = async (category: string, setter: React.Dispatch<React.SetStateAction<any>>, defaultValues: any) => {
          const { data, error } = await supabase
            .from('admin_settings')
            .select('*')
            .eq('id', category)
            .single();
          
          if (error && error.code !== 'PGRST116') {
            console.error(`Error loading ${category} settings:`, error);
          }
          
          if (data) {
            setter(data.settings);
          } else {
            setter(defaultValues);
          }
        };
        
        await Promise.all([
          fetchSettings('general', setGeneralSettings, generalSettings),
          fetchSettings('security', setSecuritySettings, securitySettings),
          fetchSettings('payment', setPaymentSettings, paymentSettings),
          fetchSettings('notification', setNotificationSettings, notificationSettings),
          fetchSettings('smtp', setSmtpSettings, smtpSettings),
        ]);
        
      } catch (error) {
        console.error("Error loading settings:", error);
        toast.error("Erro ao carregar configurações");
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, []);

  const saveSettings = async (category: string, settings: any) => {
    try {
      const { error } = await supabase
        .from('admin_settings')
        .upsert({ 
          id: category, 
          settings: settings 
        }, { 
          onConflict: 'id' 
        });

      if (error) throw error;
      toast.success(`Configurações de ${getCategoryName(category)} atualizadas com sucesso`);
      return true;
    } catch (error) {
      console.error(`Error saving ${category} settings:`, error);
      toast.error(`Erro ao salvar configurações de ${getCategoryName(category)}`);
      return false;
    }
  };

  const getCategoryName = (category: string) => {
    const names: Record<string, string> = {
      'general': 'gerais',
      'security': 'segurança',
      'payment': 'pagamento',
      'notification': 'notificação',
      'smtp': 'SMTP'
    };
    return names[category] || category;
  };
  
  return {
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
  };
};
