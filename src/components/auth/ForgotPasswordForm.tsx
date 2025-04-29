
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ForgotPasswordFormProps {
  onSubmit: (email: string) => Promise<void>;
  isLoading: boolean;
}

export function ForgotPasswordForm({ onSubmit, isLoading }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reset-email">Email</Label>
        <Input 
          id="reset-email" 
          type="email" 
          placeholder="nome@exemplo.ao" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border-gray-300 focus-visible:ring-[#345990]"
        />
      </div>
      
      <Button 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
        type="submit" 
        disabled={isLoading}
      >
        {isLoading ? 'Enviando...' : 'Enviar instruções'}
      </Button>
      
      <p className="text-center text-sm text-gray-500">
        Enviaremos um e-mail com instruções para redefinir sua senha.
      </p>
    </form>
  );
}
