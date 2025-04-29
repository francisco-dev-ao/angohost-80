
import React, { useState } from 'react';
import { executeQuery } from '@/integrations/mysql/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

interface SuperAdminSetupDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const SuperAdminSetupDialog = ({ isOpen, onOpenChange }: SuperAdminSetupDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSetupSuperAdmin = async () => {
    setIsLoading(true);
    try {
      // Check if super admin exists
      const { data } = await executeQuery(
        'SELECT id FROM users WHERE email = ?',
        ['support@angohost.ao']
      );
      
      if (data && Array.isArray(data) && data.length > 0) {
        // Update existing user
        const userId = data[0].id;
        
        await executeQuery(
          'UPDATE users SET role = ?, is_active = ? WHERE id = ?',
          ['admin', true, userId]
        );
        
        // Ensure admin permissions
        await executeQuery(
          `INSERT INTO admin_permissions 
           (user_id, full_access, permissions, last_updated) 
           VALUES (?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE 
           full_access = VALUES(full_access), 
           permissions = VALUES(permissions),
           last_updated = VALUES(last_updated)`,
          [
            userId, 
            true, 
            JSON.stringify({
              manage_users: true,
              manage_domains: true,
              manage_services: true,
              manage_billing: true,
              manage_content: true,
              manage_settings: true,
              view_statistics: true,
              manage_orders: true,
              manage_tickets: true
            }),
            new Date().toISOString()
          ]
        );
        
        toast.success('Usuário support@angohost.ao já existe. Permissões atualizadas.');
      } else {
        // Create new super admin
        const { data: newUser } = await executeQuery(
          `INSERT INTO users 
           (email, password, full_name, role, is_active, created_at) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          ['support@angohost.ao', 'AngoHost@2025', 'Suporte AngoHost', 'admin', true, new Date().toISOString()]
        );
        
        const userId = (newUser as any).insertId;
        
        // Add admin permissions
        await executeQuery(
          `INSERT INTO admin_permissions 
           (user_id, full_access, permissions, last_updated) 
           VALUES (?, ?, ?, ?)`,
          [
            userId, 
            true, 
            JSON.stringify({
              manage_users: true,
              manage_domains: true,
              manage_services: true,
              manage_billing: true,
              manage_content: true,
              manage_settings: true,
              view_statistics: true,
              manage_orders: true,
              manage_tickets: true
            }),
            new Date().toISOString()
          ]
        );
        
        toast.success('Super administrador criado com sucesso!');
      }
      
      onOpenChange(false);
    } catch (error: any) {
      console.error('Erro ao configurar super admin:', error);
      toast.error(`Erro ao configurar super admin: ${error.message || 'Falha na operação'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configurar Super Administrador</DialogTitle>
          <DialogDescription>
            Isso irá configurar o usuário support@angohost.ao como Super Administrador do sistema.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-gray-600">
            O Super Administrador terá acesso total a todas as funcionalidades do sistema, 
            incluindo gerenciamento de usuários, domínios, serviços, cobranças e muito mais.
          </p>
          <p className="mt-4 font-medium">
            Detalhes do Super Admin:
          </p>
          <ul className="list-disc pl-5 mt-2">
            <li>Email: support@angohost.ao</li>
            <li>Senha: AngoHost@2025</li>
            <li>Papel: Administrador</li>
          </ul>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSetupSuperAdmin} disabled={isLoading}>
            {isLoading ? "Configurando..." : "Configurar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SuperAdminSetupDialog;
