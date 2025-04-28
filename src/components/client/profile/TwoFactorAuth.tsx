
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

const TwoFactorAuth = () => {
  const [enabled, setEnabled] = useState(false);

  const handleToggle2FA = () => {
    setEnabled(!enabled);
    toast.info(enabled 
      ? 'Autenticação de dois fatores desativada' 
      : 'Autenticação de dois fatores ativada');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Autenticação de Dois Fatores</CardTitle>
        <CardDescription>
          Aumenta a segurança da sua conta exigindo uma segunda forma de verificação.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Ativar 2FA</p>
            <p className="text-sm text-muted-foreground">
              {enabled 
                ? 'A autenticação de dois fatores está ativada' 
                : 'A autenticação de dois fatores está desativada'}
            </p>
          </div>
          <Switch
            checked={enabled}
            onCheckedChange={handleToggle2FA}
          />
        </div>
        
        {enabled && (
          <div className="mt-4">
            <p className="mb-2">Configure seu aplicativo de autenticação usando o QR Code abaixo:</p>
            <div className="border w-40 h-40 mx-auto flex items-center justify-center bg-gray-100">
              [QR Code Placeholder]
            </div>
            <p className="mt-2 text-sm text-muted-foreground text-center">
              Escaneie este QR Code com o seu aplicativo de autenticação
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TwoFactorAuth;
