
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatabaseCredentials } from "@/hooks/useDatabase";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ConnectionFormProps {
  username: string;
  password: string;
  onChange: (field: keyof DatabaseCredentials, value: string) => void;
  validationErrors?: {
    username?: string;
    password?: string;
  };
}

const ConnectionForm = ({ 
  username, 
  password, 
  onChange,
  validationErrors = {} 
}: ConnectionFormProps) => {
  return (
    <div className="grid gap-4 py-4">
      <Alert className="bg-blue-50 border-blue-200 text-blue-800">
        <AlertCircle className="h-4 w-4 text-blue-800 mr-2" />
        <AlertDescription>
          Por favor, insira as credenciais para se conectar ao banco de dados MySQL.
          Se você não tiver certeza das credenciais, entre em contato com seu administrador.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="host" className="text-right">
          Host
        </Label>
        <div className="col-span-3">
          <Input
            id="host"
            value="194.163.146.215"
            disabled
            className="bg-gray-50"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="port" className="text-right">
          Porta
        </Label>
        <div className="col-span-3">
          <Input
            id="port"
            value="3306"
            disabled
            className="bg-gray-50"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="database" className="text-right">
          Banco de Dados
        </Label>
        <div className="col-span-3">
          <Input
            id="database"
            value="angodb11"
            disabled
            className="bg-gray-50"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="username" className={`text-right ${validationErrors.username ? 'text-red-500' : ''}`}>
          Usuário*
        </Label>
        <div className="col-span-3">
          <Input
            id="username"
            value={username}
            onChange={(e) => onChange('username', e.target.value)}
            placeholder="Digite o nome de usuário do banco de dados"
            className={validationErrors.username ? 'border-red-500 focus-visible:ring-red-500' : ''}
            aria-invalid={!!validationErrors.username}
            required
          />
          {validationErrors.username && (
            <p className="mt-1 text-xs text-red-500">{validationErrors.username}</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="password" className={`text-right ${validationErrors.password ? 'text-red-500' : ''}`}>
          Senha*
        </Label>
        <div className="col-span-3">
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => onChange('password', e.target.value)}
            placeholder="Digite a senha do banco de dados"
            className={validationErrors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}
            aria-invalid={!!validationErrors.password}
            required
          />
          {validationErrors.password && (
            <p className="mt-1 text-xs text-red-500">{validationErrors.password}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectionForm;
