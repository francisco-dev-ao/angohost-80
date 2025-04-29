
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ConnectionFormProps {
  username: string;
  password: string;
  setUsername: (username: string) => void;
  setPassword: (password: string) => void;
}

const ConnectionForm = ({ 
  username, 
  password, 
  setUsername, 
  setPassword 
}: ConnectionFormProps) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="host" className="text-right">
          Host
        </Label>
        <Input
          id="host"
          value="194.163.146.215"
          disabled
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="port" className="text-right">
          Porta
        </Label>
        <Input
          id="port"
          value="3306"
          disabled
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="database" className="text-right">
          Banco de Dados
        </Label>
        <Input
          id="database"
          value="angodb11"
          disabled
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="username" className="text-right">
          Usuário
        </Label>
        <Input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="password" className="text-right">
          Senha
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="col-span-3"
        />
      </div>
    </div>
  );
};

export default ConnectionForm;
