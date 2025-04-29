
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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

interface PaymentSettingsProps {
  settings: {
    currency: string;
    enableAutoInvoicing: boolean;
    autoReminderDays: number;
    paymentGracePeriod: number;
    taxRate: number;
  };
  onSettingsChange: (settings: any) => void;
}

export const PaymentSettingsForm = ({ settings, onSettingsChange }: PaymentSettingsProps) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('admin_settings')
        .upsert({ 
          id: 'payment', 
          settings: settings 
        }, { 
          onConflict: 'id' 
        });

      if (error) throw error;
      toast.success("Configurações de pagamento atualizadas com sucesso");
    } catch (error) {
      console.error("Error saving payment settings:", error);
      toast.error("Erro ao salvar configurações de pagamento");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
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
              value={settings.currency}
              onChange={e => onSettingsChange({...settings, currency: e.target.value})}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="enableAutoInvoicing"
              checked={settings.enableAutoInvoicing}
              onCheckedChange={checked => onSettingsChange({...settings, enableAutoInvoicing: checked})}
            />
            <Label htmlFor="enableAutoInvoicing">Ativar faturamento automático</Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="autoReminderDays">Dias para lembrete automático</Label>
            <Input 
              id="autoReminderDays" 
              type="number"
              value={settings.autoReminderDays}
              onChange={e => onSettingsChange({...settings, autoReminderDays: parseInt(e.target.value)})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="paymentGracePeriod">Período de carência para pagamento (dias)</Label>
            <Input 
              id="paymentGracePeriod" 
              type="number"
              value={settings.paymentGracePeriod}
              onChange={e => onSettingsChange({...settings, paymentGracePeriod: parseInt(e.target.value)})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="taxRate">Taxa de imposto (%)</Label>
            <Input 
              id="taxRate" 
              type="number"
              value={settings.taxRate}
              onChange={e => onSettingsChange({...settings, taxRate: parseInt(e.target.value)})}
            />
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
