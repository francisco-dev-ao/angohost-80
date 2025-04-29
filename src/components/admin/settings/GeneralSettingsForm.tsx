
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

interface GeneralSettingsProps {
  settings: {
    siteName: string;
    siteUrl: string;
    adminEmail: string;
    logoUrl: string;
    enableMaintenance: boolean;
  };
  onSettingsChange: (settings: any) => void;
}

export const GeneralSettingsForm = ({ settings, onSettingsChange }: GeneralSettingsProps) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('admin_settings')
        .upsert({ 
          id: 'general', 
          settings: settings 
        }, { 
          onConflict: 'id' 
        });

      if (error) throw error;
      toast.success("Configurações gerais atualizadas com sucesso");
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
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="siteUrl">URL do Site</Label>
            <Input 
              id="siteUrl" 
              value={settings.siteUrl}
              onChange={e => onSettingsChange({...settings, siteUrl: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="adminEmail">Email do Administrador</Label>
            <Input 
              id="adminEmail" 
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
            />
            <Label htmlFor="enableMaintenance">Ativar modo de manutenção</Label>
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
