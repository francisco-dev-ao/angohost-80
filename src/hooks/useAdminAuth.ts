
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from './useSupabaseAuth';
import { toast } from 'sonner';

export const useAdminAuth = () => {
  const navigate = useNavigate();
  const { user, loading, isAdmin } = useSupabaseAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        setIsLoading(true);

        if (!loading) {
          // Se o usuário não estiver autenticado, redirecionar para login
          if (!user) {
            toast.error('Você precisa estar logado para acessar esta página');
            navigate('/register');
            return;
          }

          // Se não for admin, redirecionar para área do cliente
          if (!isAdmin) {
            toast.error('Você não tem permissão para acessar esta área');
            navigate('/client');
            return;
          }
          
          // Sucesso - usuário é admin
          if (user.email === 'support@angohost.ao') {
            console.log('Super admin access granted');
          }
        }
      } catch (error) {
        console.error('Erro ao verificar permissões de administrador:', error);
        navigate('/register');
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAccess();
  }, [user, loading, isAdmin, navigate]);

  return { isAdmin, isLoading };
};
