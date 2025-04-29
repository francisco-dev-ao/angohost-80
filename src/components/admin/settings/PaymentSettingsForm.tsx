
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

interface PaymentSettingsProps {
  settings: {
    currency: string;
    enableAutoInvoicing: boolean;
    autoReminderDays: number;
    paymentGracePeriod: number;
    taxRate: number;
  };
  onSettingsChange: (settings: any) => void;
  onSave: () => Promise<boolean>;
}

export const PaymentSettingsForm = ({ settings, onSettingsChange, onSave }: PaymentSettingsProps) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const success = await onSave();
      if (!success) throw new Error("Failed to save settings");
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
              aria-describedby="currency-description"
            />
            <p id="currency-description" className="text-sm text-muted-foreground">
              Código da moeda utilizada (ex: AOA, USD)
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="enableAutoInvoicing"
              checked={settings.enableAutoInvoicing}
              onCheckedChange={checked => onSettingsChange({...settings, enableAutoInvoicing: checked})}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="enableAutoInvoicing">Ativar faturamento automático</Label>
              <p className="text-sm text-muted-foreground">
                Gera faturas automaticamente para serviços recorrentes
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="autoReminderDays">Dias para lembrete automático</Label>
            <Input 
              id="autoReminderDays" 
              type="number"
              min={0}
              value={settings.autoReminderDays}
              onChange={e => onSettingsChange({...settings, autoReminderDays: parseInt(e.target.value) || 0})}
              aria-describedby="reminder-description"
            />
            <p id="reminder-description" className="text-sm text-muted-foreground">
              Dias antes do vencimento para enviar lembretes
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="paymentGracePeriod">Período de carência para pagamento</Label>
            <Input 
              id="paymentGracePeriod" 
              type="number"
              min={0}
              value={settings.paymentGracePeriod}
              onChange={e => onSettingsChange({...settings, paymentGracePeriod: parseInt(e.target.value) || 0})}
              aria-describedby="grace-description"
              suffix="dias"
            />
            <p id="grace-description" className="text-sm text-muted-foreground">
              Dias adicionais permitidos após o vencimento
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="taxRate">Taxa de imposto</Label>
            <Input 
              id="taxRate" 
              type="number"
              min={0}
              max={100}
              value={settings.taxRate}
              onChange={e => onSettingsChange({...settings, taxRate: parseInt(e.target.value) || 0})}
              suffix="%"
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
}
