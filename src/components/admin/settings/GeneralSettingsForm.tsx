
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

interface GeneralSettingsProps {
  settings: {
    siteName: string;
    siteUrl: string;
    adminEmail: string;
    logoUrl: string;
    enableMaintenance: boolean;
  };
  onSettingsChange: (settings: any) => void;
  onSave: () => Promise<boolean>;
}

export const GeneralSettingsForm = ({ settings, onSettingsChange, onSave }: GeneralSettingsProps) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const success = await onSave();
      if (!success) throw new Error("Failed to save settings");
    } catch (error) {
      console.error("Error saving general settings:", error);
      toast.error("Erro ao salvar configurações gerais");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Configurações Gerais</CardTitle>
          <CardDescription>
            Configure os parâmetros básicos do site
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="siteName">Nome do Site</Label>
            <Input 
              id="siteName" 
              value={settings.siteName}
              onChange={e => onSettingsChange({...settings, siteName: e.target.value})}
              aria-describedby="siteName-description"
            />
            <p id="siteName-description" className="text-sm text-muted-foreground">
              Nome que será exibido nos cabeçalhos e títulos
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="siteUrl">URL do Site</Label>
            <Input 
              id="siteUrl" 
              type="url"
              value={settings.siteUrl}
              onChange={e => onSettingsChange({...settings, siteUrl: e.target.value})}
              aria-describedby="siteUrl-description"
            />
            <p id="siteUrl-description" className="text-sm text-muted-foreground">
              URL principal do seu site
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="adminEmail">Email do Administrador</Label>
            <Input 
              id="adminEmail" 
              type="email"
              value={settings.adminEmail}
              onChange={e => onSettingsChange({...settings, adminEmail: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logoUrl">URL do Logo</Label>
            <Input 
              id="logoUrl" 
              value={settings.logoUrl}
              onChange={e => onSettingsChange({...settings, logoUrl: e.target.value})}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="enableMaintenance"
              checked={settings.enableMaintenance}
              onCheckedChange={checked => onSettingsChange({...settings, enableMaintenance: checked})}
              aria-describedby="maintenance-mode-description"
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="enableMaintenance">Ativar modo de manutenção</Label>
              <p id="maintenance-mode-description" className="text-sm text-muted-foreground">
                Exibe uma página de manutenção para visitantes
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
