
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RegisterFormProps {
  onSubmit: (email: string, password: string, fullName: string) => Promise<void>;
  isLoading: boolean;
}

export function RegisterForm({ onSubmit, isLoading }: RegisterFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }
    await onSubmit(email, password, fullName);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="register-fullname" className="text-white">Nome Completo</Label>
        <Input 
          id="register-fullname" 
          type="text" 
          placeholder="Seu nome completo"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="bg-white/10 border-white/10 text-white placeholder:text-white/50"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="register-email" className="text-white">Email</Label>
        <Input 
          id="register-email" 
          type="email" 
          placeholder="nome@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white/10 border-white/10 text-white placeholder:text-white/50"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="register-password" className="text-white">Senha</Label>
        <Input 
          id="register-password" 
          type="password" 
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-white/10 border-white/10 text-white placeholder:text-white/50"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="register-confirm-password" className="text-white">Confirmar Senha</Label>
        <Input 
          id="register-confirm-password" 
          type="password" 
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="bg-white/10 border-white/10 text-white placeholder:text-white/50"
          required
        />
      </div>
      
      <Button 
        className="w-full bg-[#33C3F0] hover:bg-[#33C3F0]/90 text-white" 
        type="submit" 
        disabled={isLoading}
      >
        {isLoading ? 'Registrando...' : 'Registrar'}
      </Button>
    </form>
  );
}
