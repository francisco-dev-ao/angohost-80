
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AdminUser } from '@/types/admin';

export const useAdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      
      // Fetch users from profiles table
      const { data, error, count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' });

      if (error) throw error;
      
      const formattedUsers: AdminUser[] = data.map(user => ({
        id: user.id,
        email: user.email,
        fullName: user.full_name || '',
        role: user.role || 'customer',
        createdAt: user.created_at
      }));
      
      setUsers(formattedUsers);
      setTotalCount(count || 0);
    } catch (error: any) {
      toast.error('Erro ao carregar usuários: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserRole = async (userId: string, role: 'admin' | 'support' | 'finance' | 'customer') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId);

      if (error) throw error;
      
      toast.success('Função do usuário atualizada com sucesso');
      fetchUsers(); // Reload users
    } catch (error: any) {
      toast.error('Erro ao atualizar função: ' + error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, isLoading, totalCount, fetchUsers, updateUserRole };
};
