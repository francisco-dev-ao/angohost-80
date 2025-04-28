import { ReactNode } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const { isAdmin, isLoading } = useSupabaseAuth();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      navigate('/register');
      toast.success('Sessão encerrada com sucesso');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao encerrar sessão');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will be redirected by useAdminAuth
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  );
}
