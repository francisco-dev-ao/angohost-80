
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAdminSetupUtil = () => {
  const [isLoading, setIsLoading] = useState(false);

  const ensureAdminExists = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Primeiro verificamos se o super admin já existe
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', email)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingUser) {
        // Se o usuário já existe, apenas atualizamos as permissões
        await updateAdminPermissions(existingUser.id);
        toast.success('Usuário já existe. Permissões de super administrador atualizadas.');
        setIsLoading(false);
        return;
      }

      // Caso o usuário não exista, criamos um novo
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: 'Suporte AngoHost',
            role: 'admin',
          }
        }
      });

      if (signUpError) throw signUpError;
      
      if (authData.user) {
        // Criar o perfil do usuário
        await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            email: email,
            full_name: 'Suporte AngoHost',
            role: 'admin',
            is_active: true
          });

        // Configurar permissões de admin
        await updateAdminPermissions(authData.user.id);
        
        toast.success('Super administrador criado com sucesso! Email: support@angohost.ao');
      }
    } catch (error: any) {
      console.error('Erro ao criar super admin:', error);
      toast.error(`Erro ao criar super admin: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAdminPermissions = async (userId: string) => {
    try {
      // Atualizar permissões de administrador
      await supabase
        .from('admin_permissions')
        .upsert({
          user_id: userId,
          full_access: true,
          permissions: {
            manage_users: true,
            manage_domains: true,
            manage_services: true,
            manage_billing: true,
            manage_content: true,
            manage_settings: true,
            view_statistics: true,
            manage_orders: true,
            manage_tickets: true
          },
          last_updated: new Date().toISOString()
        });

      // Também atualizamos o perfil para garantir que tenha role admin
      await supabase
        .from('profiles')
        .update({ 
          role: 'admin',
          is_active: true
        })
        .eq('id', userId);
        
    } catch (error) {
      console.error('Erro ao atualizar permissões:', error);
      throw error;
    }
  };

  return { ensureAdminExists, isLoading };
};
