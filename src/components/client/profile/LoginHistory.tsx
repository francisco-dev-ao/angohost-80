
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const LoginHistory = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Login</CardTitle>
        <CardDescription>
          Revise as atividades recentes de login na sua conta.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="border rounded-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left px-4 py-2">Data/Hora</th>
                <th className="text-left px-4 py-2">IP</th>
                <th className="text-left px-4 py-2">Localização</th>
                <th className="text-left px-4 py-2">Dispositivo</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="px-4 py-3">28/04/2025, 14:32</td>
                <td className="px-4 py-3">192.168.1.1</td>
                <td className="px-4 py-3">Lisboa, Portugal</td>
                <td className="px-4 py-3">Chrome / Windows</td>
              </tr>
              <tr className="border-t bg-muted/50">
                <td className="px-4 py-3">25/04/2025, 09:15</td>
                <td className="px-4 py-3">192.168.1.1</td>
                <td className="px-4 py-3">Lisboa, Portugal</td>
                <td className="px-4 py-3">Safari / iOS</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-3">20/04/2025, 18:45</td>
                <td className="px-4 py-3">192.168.1.1</td>
                <td className="px-4 py-3">Lisboa, Portugal</td>
                <td className="px-4 py-3">Chrome / Windows</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
      
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Se você não reconhece algum desses logins, altere sua senha imediatamente e entre em contato com o suporte.
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginHistory;
