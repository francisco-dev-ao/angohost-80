
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

interface SecuritySettingsProps {
  settings: {
    enableTwoFactor: boolean;
    passwordExpiryDays: number;
    sessionTimeout: number;
    autoLogout: boolean;
    enforceStrongPassword: boolean;
  };
  onSettingsChange: (settings: any) => void;
}

export const SecuritySettingsForm = ({ settings, onSettingsChange }: SecuritySettingsProps) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('admin_settings')
        .upsert({ 
          id: 'security', 
          settings: settings 
        }, { 
          onConflict: 'id' 
        });

      if (error) throw error;
      toast.success("Configurações de segurança atualizadas com sucesso");
    } catch (error) {
      console.error("Error saving security settings:", error);
      toast.error("Erro ao salvar configurações de segurança");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
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
              checked={settings.enableTwoFactor}
              onCheckedChange={checked => onSettingsChange({...settings, enableTwoFactor: checked})}
            />
            <Label htmlFor="enableTwoFactor">Ativar autenticação de dois fatores</Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="passwordExpiryDays">Expiração de senha (dias)</Label>
            <Input 
              id="passwordExpiryDays" 
              type="number"
              value={settings.passwordExpiryDays}
              onChange={e => onSettingsChange({...settings, passwordExpiryDays: parseInt(e.target.value)})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sessionTimeout">Tempo limite da sessão (minutos)</Label>
            <Input 
              id="sessionTimeout" 
              type="number"
              value={settings.sessionTimeout}
              onChange={e => onSettingsChange({...settings, sessionTimeout: parseInt(e.target.value)})}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="autoLogout"
              checked={settings.autoLogout}
              onCheckedChange={checked => onSettingsChange({...settings, autoLogout: checked})}
            />
            <Label htmlFor="autoLogout">Logout automático após tempo limite</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="enforceStrongPassword"
              checked={settings.enforceStrongPassword}
              onCheckedChange={checked => onSettingsChange({...settings, enforceStrongPassword: checked})}
            />
            <Label htmlFor="enforceStrongPassword">Exigir senhas fortes</Label>
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
