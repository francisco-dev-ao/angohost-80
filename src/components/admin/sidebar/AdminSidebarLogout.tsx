
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface AdminSidebarLogoutProps {
  isOpen: boolean;
}

const AdminSidebarLogout = ({ isOpen }: AdminSidebarLogoutProps) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      toast.success('Sessão encerrada com sucesso');
      navigate('/');
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast.error('Erro ao encerrar sessão');
    }
  };

  return (
    <div className="p-4">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start",
          !isOpen && "justify-center px-2"
        )}
        onClick={handleSignOut}
      >
        <LogOut className="h-5 w-5" />
        <span
          className={cn(
            "ml-3 transition-all",
            !isOpen && "hidden"
          )}
        >
          Sair
        </span>
      </Button>
    </div>
  );
};

export default AdminSidebarLogout;
