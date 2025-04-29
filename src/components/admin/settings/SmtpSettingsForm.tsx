
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
}

export const SmtpSettingsForm = ({ settings, onSettingsChange }: SmtpSettingsProps) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('admin_settings')
        .upsert({ 
          id: 'smtp', 
          settings: settings 
        }, { 
          onConflict: 'id' 
        });

      if (error) throw error;
      toast.success("Configurações SMTP atualizadas com sucesso");
    } catch (error) {
      console.error("Error saving SMTP settings:", error);
      toast.error("Erro ao salvar configurações SMTP");
    } finally {
      setIsSaving(false);
    }
  };

  const testSmtpConnection = async () => {
    setIsSaving(true);
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
      setIsSaving(false);
    }
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
          <div className="space-y-2">
            <Label htmlFor="smtpServer">Servidor SMTP</Label>
            <Input 
              id="smtpServer" 
              value={settings.smtpServer}
              onChange={e => onSettingsChange({...settings, smtpServer: e.target.value})}
              placeholder="smtp.example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtpPort">Porta SMTP</Label>
            <Input 
              id="smtpPort" 
              value={settings.smtpPort}
              onChange={e => onSettingsChange({...settings, smtpPort: e.target.value})}
              placeholder="587"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtpUser">Usuário SMTP</Label>
            <Input 
              id="smtpUser" 
              value={settings.smtpUser}
              onChange={e => onSettingsChange({...settings, smtpUser: e.target.value})}
              placeholder="user@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtpPassword">Senha SMTP</Label>
            <Input 
              id="smtpPassword" 
              type="password"
              value={settings.smtpPassword}
              onChange={e => onSettingsChange({...settings, smtpPassword: e.target.value})}
              placeholder="••••••••••••"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtpFromEmail">Email de Origem</Label>
            <Input 
              id="smtpFromEmail" 
              value={settings.smtpFromEmail}
              onChange={e => onSettingsChange({...settings, smtpFromEmail: e.target.value})}
              placeholder="no-reply@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtpFromName">Nome de Origem</Label>
            <Input 
              id="smtpFromName" 
              value={settings.smtpFromName}
              onChange={e => onSettingsChange({...settings, smtpFromName: e.target.value})}
              placeholder="AngoHost"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="smtpSecureConnection"
              checked={settings.smtpSecureConnection}
              onCheckedChange={checked => onSettingsChange({...settings, smtpSecureConnection: checked})}
            />
            <Label htmlFor="smtpSecureConnection">Usar conexão segura (SSL/TLS)</Label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={testSmtpConnection}
            disabled={isSaving || !settings.smtpServer || !settings.smtpUser || !settings.smtpPassword}
          >
            Testar Conexão
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Salvando..." : "Salvar alterações"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
