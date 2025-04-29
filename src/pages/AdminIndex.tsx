
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import Dashboard from "@/components/admin/Dashboard";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import SuperAdminSetupDialog from "@/components/admin/SuperAdminSetupDialog";
import { executeQuery } from "@/integrations/mysql/client";
import { useAuth } from "@/hooks/mysql/useAuth";

const AdminIndex = () => {
  const [setupDialogOpen, setSetupDialogOpen] = useState(false);
  const { user } = useAuth();
  const [superAdminExists, setSuperAdminExists] = useState(false);
  
  useEffect(() => {
    const checkSuperAdmin = async () => {
      try {
        const { data } = await executeQuery(
          'SELECT id FROM users WHERE email = ? AND role = ?',
          ['support@angohost.ao', 'admin']
        );
        
        setSuperAdminExists(data && Array.isArray(data) && data.length > 0);
      } catch (error) {
        console.error('Error checking super admin:', error);
      }
    };
    
    checkSuperAdmin();
  }, []);
  
  // Verificar se o usuário atual tem permissão para criar o super admin
  // Apenas administradores podem ver este botão
  // O support@angohost.ao NÃO deve ver este botão, pois ele já é o super admin
  const canSetupSuperAdmin = user?.email !== 'support@angohost.ao' && !superAdminExists;

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
