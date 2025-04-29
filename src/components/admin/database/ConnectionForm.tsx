
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatabaseCredentials } from "@/hooks/useDatabase";

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
          Usuário
        </Label>
        <div className="col-span-3">
          <Input
            id="username"
            value={username}
            onChange={(e) => onChange('username', e.target.value)}
            className={validationErrors.username ? 'border-red-500 focus-visible:ring-red-500' : ''}
            aria-invalid={!!validationErrors.username}
          />
          {validationErrors.username && (
            <p className="mt-1 text-xs text-red-500">{validationErrors.username}</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="password" className={`text-right ${validationErrors.password ? 'text-red-500' : ''}`}>
          Senha
        </Label>
        <div className="col-span-3">
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => onChange('password', e.target.value)}
            className={validationErrors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}
            aria-invalid={!!validationErrors.password}
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
