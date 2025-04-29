
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { InputWithSuffix } from "@/components/ui/input-with-suffix";
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

interface SecuritySettingsProps {
  settings: {
    enableTwoFactor: boolean;
    passwordExpiryDays: number;
    sessionTimeout: number;
    autoLogout: boolean;
    enforceStrongPassword: boolean;
  };
  onSettingsChange: (settings: any) => void;
  onSave: () => Promise<boolean>;
}

export const SecuritySettingsForm = ({ settings, onSettingsChange, onSave }: SecuritySettingsProps) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const success = await onSave();
      if (!success) throw new Error("Failed to save settings");
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
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="enableTwoFactor">Ativar autenticação de dois fatores</Label>
              <p className="text-sm text-muted-foreground">
                Requer verificação adicional no login
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="passwordExpiryDays">Expiração de senha</Label>
            <InputWithSuffix 
              id="passwordExpiryDays" 
              type="number"
              min={0}
              value={settings.passwordExpiryDays}
              onChange={e => onSettingsChange({...settings, passwordExpiryDays: parseInt(e.target.value) || 0})}
              suffix="dias"
              aria-describedby="password-expiry-description"
            />
            <p id="password-expiry-description" className="text-sm text-muted-foreground">
              Dias até que uma senha precise ser alterada (0 para desativar)
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sessionTimeout">Tempo limite da sessão</Label>
            <InputWithSuffix 
              id="sessionTimeout" 
              type="number"
              min={1}
              value={settings.sessionTimeout}
              onChange={e => onSettingsChange({...settings, sessionTimeout: parseInt(e.target.value) || 60})}
              suffix="minutos"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="autoLogout"
              checked={settings.autoLogout}
              onCheckedChange={checked => onSettingsChange({...settings, autoLogout: checked})}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="autoLogout">Logout automático após tempo limite</Label>
              <p className="text-sm text-muted-foreground">
                Encerra a sessão após período de inatividade
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="enforceStrongPassword"
              checked={settings.enforceStrongPassword}
              onCheckedChange={checked => onSettingsChange({...settings, enforceStrongPassword: checked})}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="enforceStrongPassword">Exigir senhas fortes</Label>
              <p className="text-sm text-muted-foreground">
                Senhas devem conter letras maiúsculas, minúsculas, números e símbolos
              </p>
            </div>
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
