
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { MailCheck } from "lucide-react";

interface SmtpSettingsProps {
  settings: {
    smtpServer: string;
    smtpPort: string;
    smtpUser: string;
    smtpPassword: string;
    smtpFromEmail: string;
    smtpFromName: string;
    smtpSecureConnection: boolean;
  };
  onSettingsChange: (settings: any) => void;
  onSave: () => Promise<boolean>;
}

export const SmtpSettingsForm = ({ settings, onSettingsChange, onSave }: SmtpSettingsProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const success = await onSave();
      if (!success) throw new Error("Failed to save settings");
    } catch (error) {
      console.error("Error saving SMTP settings:", error);
      toast.error("Erro ao salvar configurações SMTP");
    } finally {
      setIsSaving(false);
    }
  };

  const testSmtpConnection = async () => {
    setIsTesting(true);
    try {
      const { data, error } = await supabase.functions.invoke('test-smtp', {
        body: { smtpSettings: settings }
      });

      if (error) throw error;
      
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error testing SMTP:", error);
      toast.error("Erro ao testar conexão SMTP");
    } finally {
      setIsTesting(false);
    }
  };

  const isValidSmtpConfig = () => {
    return Boolean(settings.smtpServer && settings.smtpUser && settings.smtpPassword);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Configurações SMTP</CardTitle>
          <CardDescription>
            Configure os parâmetros para envio de emails
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isValidSmtpConfig() && (
            <Alert>
              <AlertDescription className="flex items-center text-sm">
                Configure o servidor SMTP para habilitar o envio de emails.
              </AlertDescription>
            </Alert>
          )}

          <div className="md:grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smtpServer">Servidor SMTP</Label>
              <Input 
                id="smtpServer" 
                value={settings.smtpServer}
                onChange={e => onSettingsChange({...settings, smtpServer: e.target.value})}
                placeholder="smtp.example.com"
                aria-required="true"
              />
            </div>
            <div className="space-y-2 mt-4 md:mt-0">
              <Label htmlFor="smtpPort">Porta SMTP</Label>
              <Input 
                id="smtpPort" 
                value={settings.smtpPort}
                onChange={e => onSettingsChange({...settings, smtpPort: e.target.value})}
                placeholder="587"
              />
            </div>
          </div>

          <div className="md:grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smtpUser">Usuário SMTP</Label>
              <Input 
                id="smtpUser" 
                value={settings.smtpUser}
                onChange={e => onSettingsChange({...settings, smtpUser: e.target.value})}
                placeholder="user@example.com"
                aria-required="true"
              />
            </div>
            <div className="space-y-2 mt-4 md:mt-0">
              <Label htmlFor="smtpPassword">Senha SMTP</Label>
              <Input 
                id="smtpPassword" 
                type="password"
                value={settings.smtpPassword}
                onChange={e => onSettingsChange({...settings, smtpPassword: e.target.value})}
                placeholder="••••••••••••"
                aria-required="true"
              />
            </div>
          </div>

          <div className="md:grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smtpFromEmail">Email de Origem</Label>
              <Input 
                id="smtpFromEmail" 
                type="email"
                value={settings.smtpFromEmail}
                onChange={e => onSettingsChange({...settings, smtpFromEmail: e.target.value})}
                placeholder="no-reply@example.com"
              />
            </div>
            <div className="space-y-2 mt-4 md:mt-0">
              <Label htmlFor="smtpFromName">Nome de Origem</Label>
              <Input 
                id="smtpFromName" 
                value={settings.smtpFromName}
                onChange={e => onSettingsChange({...settings, smtpFromName: e.target.value})}
                placeholder="AngoHost"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 mt-4">
            <Switch 
              id="smtpSecureConnection"
              checked={settings.smtpSecureConnection}
              onCheckedChange={checked => onSettingsChange({...settings, smtpSecureConnection: checked})}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="smtpSecureConnection">Usar conexão segura (SSL/TLS)</Label>
              <p className="text-sm text-muted-foreground">
                Recomendado para maior segurança
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={testSmtpConnection}
            disabled={isTesting || isSaving || !isValidSmtpConfig()}
            className="w-full sm:w-auto"
          >
            {isTesting ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                Testando...
              </span>
            ) : (
              <span className="flex items-center">
                <MailCheck className="mr-2 h-4 w-4" />
                Testar Conexão
              </span>
            )}
          </Button>
          <Button 
            type="submit" 
            disabled={isSaving}
            className="w-full sm:w-auto"
          >
            {isSaving ? "Salvando..." : "Salvar alterações"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
