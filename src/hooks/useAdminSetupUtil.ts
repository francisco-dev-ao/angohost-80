
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAdminSetupUtil = () => {
  const [isLoading, setIsLoading] = useState(false);

  const ensureAdminExists = async (email: string, defaultPassword: string) => {
    setIsLoading(true);
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id, email, role')
        .eq('email', email)
        .single();
        
      if (existingUser) {
        // If user exists but is not admin, update role
        if (existingUser.role !== 'admin') {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ 
              role: 'admin'
            })
            .eq('id', existingUser.id);
            
          if (updateError) throw updateError;
          
          if (email === 'support@angohost.ao') {
            toast.success(`Usuário ${email} configurado como super administrador com permissões totais`);
          } else {
            toast.success(`Usuário ${email} atualizado para administrador`);
          }
        } else if (email === 'support@angohost.ao') {
          toast.info(`Usuário ${email} já é super administrador com permissões totais`);
        } else {
          toast.info(`Usuário ${email} já é administrador`);
        }
        return;
      }
      
      // If user doesn't exist, create new admin user
      const { data, error } = await supabase.auth.signUp({
        email,
        password: defaultPassword,
        options: {
          data: {
            full_name: email === 'support@angohost.ao' ? 'Suporte AngoHost' : 'Administrador',
            role: 'admin'
          },
        },
      });

      if (error) throw error;
      
      // If user was created, update the profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            role: 'admin',
            full_name: email === 'support@angohost.ao' ? 'Suporte AngoHost' : 'Administrador'
          })
          .eq('id', data.user.id);

        if (profileError) throw profileError;
        
        if (email === 'support@angohost.ao') {
          toast.success(`Super administrador ${email} criado com sucesso e permissões totais concedidas`);
        } else {
          toast.success(`Administrador ${email} criado com sucesso`);
        }
      }
    } catch (error: any) {
      toast.error('Erro ao configurar administrador: ' + error.message);
      console.error('Admin setup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { ensureAdminExists, isLoading };
};
