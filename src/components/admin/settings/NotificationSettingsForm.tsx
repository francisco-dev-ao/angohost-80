
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
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface NotificationSettingsProps {
  settings: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    orderNotifications: boolean;
    paymentNotifications: boolean;
    systemNotifications: boolean;
  };
  onSettingsChange: (settings: any) => void;
  onSave: () => Promise<boolean>;
}

export const NotificationSettingsForm = ({ settings, onSettingsChange, onSave }: NotificationSettingsProps) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const success = await onSave();
      if (!success) throw new Error("Failed to save settings");
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
          <div className="md:grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Canais de comunicação</h3>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={checked => onSettingsChange({...settings, emailNotifications: checked})}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="emailNotifications">Ativar notificações por e-mail</Label>
                  <p className="text-sm text-muted-foreground">
                    Envia e-mails para eventos importantes
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="smsNotifications"
                  checked={settings.smsNotifications}
                  onCheckedChange={checked => onSettingsChange({...settings, smsNotifications: checked})}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="smsNotifications">Ativar notificações por SMS</Label>
                  <p className="text-sm text-muted-foreground">
                    Envia SMS para eventos urgentes (requer configuração adicional)
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 md:mt-0">
              <h3 className="text-lg font-medium mb-4">Tipos de notificação</h3>
              <div className="space-y-3">
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
              </div>
            </div>
          </div>

          <Separator className="my-6" />
          
          <Accordion type="single" collapsible>
            <AccordionItem value="notification-details">
              <AccordionTrigger>Configurações avançadas de notificação</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 py-2">
                  <p className="text-sm text-muted-foreground">
                    As notificações por e-mail utilizam os templates configurados na seção de templates de e-mail.
                    Para personalizar o conteúdo das notificações, visite a página de <a href="/admin/email-templates" className="text-primary underline">templates de e-mail</a>.
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Notificações SMS requerem configuração adicional de um provedor de SMS. 
                    Configure seu provedor na seção <a href="/admin/payment-methods" className="text-primary underline">métodos de pagamento</a>.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
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
