
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAdminSetup = () => {
  const [isLoading, setIsLoading] = useState(false);

  const setupSupportAdmin = async (email: string, defaultPassword: string) => {
    setIsLoading(true);
    try {
      // Verificar se o usuário já existe
      const { data: existingProfiles } = await supabase
        .from('profiles')
        .select('id, email, role')
        .eq('email', email)
        .single();
      
      if (existingProfiles) {
        // Se o usuário já existe, atualizar para admin, se necessário
        if (existingProfiles.role !== 'admin') {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', existingProfiles.id);
          
          if (updateError) throw updateError;
          toast.success(`Usuário ${email} atualizado para administrador`);
        } else {
          toast.info(`Usuário ${email} já é administrador`);
        }
        return;
      }
      
      // Criar novo usuário com papel de administrador
      const { data, error } = await supabase.auth.signUp({
        email,
        password: defaultPassword,
        options: {
          data: {
            full_name: 'Suporte AngoHost',
          },
        },
      });

      if (error) throw error;
      
      // Se conseguiu criar, agora vamos atualizar o papel para admin
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', data.user.id);

        if (profileError) throw profileError;
        
        toast.success(`Usuário administrador ${email} criado com sucesso`);
      }
    } catch (error: any) {
      toast.error('Erro ao configurar usuário administrador: ' + error.message);
      console.error('Setup admin error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { setupSupportAdmin, isLoading };
};
