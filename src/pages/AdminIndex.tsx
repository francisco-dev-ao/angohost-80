
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import Dashboard from "@/components/admin/Dashboard";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import SuperAdminSetupDialog from "@/components/admin/SuperAdminSetupDialog";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

const AdminIndex = () => {
  const [setupDialogOpen, setSetupDialogOpen] = useState(false);
  const { user } = useSupabaseAuth();
  
  // Verificar se o usuário atual tem permissão para criar o super admin
  // Apenas administradores podem ver este botão
  // O support@angohost.ao NÃO deve ver este botão, pois ele já é o super admin
  const canSetupSuperAdmin = user?.email !== 'support@angohost.ao';

  return (
    <AdminLayout>
      {canSetupSuperAdmin && (
        <div className="mb-8">
          <Button 
            onClick={() => setSetupDialogOpen(true)}
            variant="outline"
            className="border-dashed border-2 border-primary/50 hover:border-primary"
          >
            <ShieldCheck className="mr-2 h-4 w-4" />
            Configurar Super Administrador (support@angohost.ao)
          </Button>
        </div>
      )}
      <Dashboard />
      
      <SuperAdminSetupDialog 
        isOpen={setupDialogOpen} 
        onOpenChange={setSetupDialogOpen} 
      />
    </AdminLayout>
  );
};

export default AdminIndex;
