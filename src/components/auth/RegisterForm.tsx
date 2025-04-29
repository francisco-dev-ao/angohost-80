
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface RegisterFormProps {
  onSubmit: (email: string, password: string, fullName: string) => Promise<void>;
  isLoading: boolean;
  returnUrl?: string;
}

export function RegisterForm({ onSubmit, isLoading, returnUrl }: RegisterFormProps) {
  const [nif, setNif] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone.startsWith('9') || phone.length !== 9) {
      toast.error('O número deve ter 9 dígitos e começar com 9');
      return;
    }
    
    await onSubmit(email, password, fullName);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nif">NIF ou B.I*</Label>
        <Input 
          id="nif" 
          type="text" 
          placeholder="NIF ou Bilhete de Identidade"
          value={nif}
          onChange={(e) => setNif(e.target.value)}
          required
        />
        <p className="text-sm text-gray-500">Ao informar o NIF, preencheremos alguns campos automaticamente.</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="register-email">Email*</Label>
        <Input 
          id="register-email" 
          type="email" 
          placeholder="nome@exemplo.ao"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="register-password">Senha*</Label>
        <Input 
          id="register-password" 
          type="password" 
          placeholder="Crie uma senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="fullName">Nome Fiscal*</Label>
        <Input 
          id="fullName" 
          type="text" 
          placeholder="Nome completo ou nome da empresa"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Telefone*</Label>
        <Input 
          id="phone" 
          type="tel" 
          placeholder="Telefone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <p className="text-sm text-gray-500">O número deve ter 9 dígitos e começar com 9</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Endereço*</Label>
        <Input 
          id="address" 
          type="text" 
          placeholder="Seu endereço completo"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </div>
      
      <Button 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
        type="submit" 
        disabled={isLoading}
      >
        {isLoading ? 'Processando...' : 'Criar nova conta'}
      </Button>
    </form>
  );
}
