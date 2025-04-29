
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useSupabaseAuth();

  useEffect(() => {
    if (!loading && !user) {
      toast.error('Você precisa estar logado para acessar esta página');
    } else if (!loading && user) {
      // Verificar se o usuário é administrador
      const isAdmin = user.user_metadata?.role === 'admin' || user.email?.endsWith('@admin.com');
      
      if (!isAdmin) {
        toast.error('Você não tem permissão para acessar esta área');
      }
    }
  }, [loading, user]);

  // Exibir carregamento enquanto verifica autenticação
  if (loading) {
    return (
      <div className="container py-16 flex items-center justify-center">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-12 w-3/4 mx-auto" />
        </div>
      </div>
    );
  }

  // Verificar se o usuário é administrador
  if (!user) {
    return <Navigate to="/register" replace />;
  }
  
  const isAdmin = user.user_metadata?.role === 'admin' || user.email?.endsWith('@admin.com');
  if (!isAdmin) {
    return <Navigate to="/client" replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
