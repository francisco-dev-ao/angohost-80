
import { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";

interface NotificationSettingsProps {
  settings: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    orderNotifications: boolean;
    paymentNotifications: boolean;
    systemNotifications: boolean;
  };
  onSettingsChange: (settings: any) => void;
}

export const NotificationSettingsForm = ({ settings, onSettingsChange }: NotificationSettingsProps) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('admin_settings')
        .upsert({ 
          id: 'notification', 
          settings: settings 
        }, { 
          onConflict: 'id' 
        });

      if (error) throw error;
      toast.success("Configurações de notificação atualizadas com sucesso");
    } catch (error) {
      console.error("Error saving notification settings:", error);
      toast.error("Erro ao salvar configurações de notificação");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
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
              checked={settings.emailNotifications}
              onCheckedChange={checked => onSettingsChange({...settings, emailNotifications: checked})}
            />
            <Label htmlFor="emailNotifications">Ativar notificações por e-mail</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="smsNotifications"
              checked={settings.smsNotifications}
              onCheckedChange={checked => onSettingsChange({...settings, smsNotifications: checked})}
            />
            <Label htmlFor="smsNotifications">Ativar notificações por SMS</Label>
          </div>
          <Separator className="my-4" />
          <p className="text-sm font-medium">Tipos de notificação</p>
          <div className="flex items-center space-x-2">
            <Switch 
              id="orderNotifications"
              checked={settings.orderNotifications}
              onCheckedChange={checked => onSettingsChange({...settings, orderNotifications: checked})}
            />
            <Label htmlFor="orderNotifications">Notificações de pedidos</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="paymentNotifications"
              checked={settings.paymentNotifications}
              onCheckedChange={checked => onSettingsChange({...settings, paymentNotifications: checked})}
            />
            <Label htmlFor="paymentNotifications">Notificações de pagamento</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="systemNotifications"
              checked={settings.systemNotifications}
              onCheckedChange={checked => onSettingsChange({...settings, systemNotifications: checked})}
            />
            <Label htmlFor="systemNotifications">Notificações do sistema</Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Salvando..." : "Salvar alterações"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
