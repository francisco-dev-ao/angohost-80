
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useSupabaseAuth();

  useEffect(() => {
    const setupAdminAccess = async () => {
      if (!loading && user) {
        // Check if user is admin - support@angohost.ao is ALWAYS an admin with full access
        const isSupportEmail = user.email === 'support@angohost.ao';
        
        const isAdmin = 
          isSupportEmail || 
          user.user_metadata?.role === 'admin' || 
          user.email?.endsWith('@admin.com');
        
        if (isAdmin) {
          try {
            // Ensure admin users have all admin permissions enabled
            await supabase
              .from('admin_permissions')
              .upsert({
                user_id: user.id,
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
              
            // Also update the profile to ensure they have admin role
            await supabase
              .from('profiles')
              .update({ 
                role: 'admin',
                is_active: true
              })
              .eq('id', user.id);
              
          } catch (error) {
            console.error("Error setting up admin permissions:", error);
          }
          
          if (isSupportEmail) {
            toast.success('Bem-vindo ao painel de administração com acesso completo');
          }
        } else {
          toast.error('Você não tem permissão para acessar esta área');
        }
      } else if (!loading && !user) {
        toast.error('Você precisa estar logado para acessar esta página');
      }
    };
    
    setupAdminAccess();
  }, [loading, user]);

  // Display loading while checking authentication
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

  // Verify if the user is administrator
  if (!user) {
    return <Navigate to="/register" replace />;
  }
  
  // Special treatment for support@angohost.ao - always allow full access
  if (user.email === 'support@angohost.ao') {
    return <>{children}</>;
  }
  
  // Check normal admin roles for other users
  const isAdmin = user.user_metadata?.role === 'admin' || user.email?.endsWith('@admin.com');
  if (!isAdmin) {
    return <Navigate to="/client" replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
