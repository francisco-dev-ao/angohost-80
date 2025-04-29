
import React, { useState, useEffect } from 'react';
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';

interface AdminSetupDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultEmail?: string;
}

const AdminSetupDialog = ({ isOpen, onOpenChange, defaultEmail = "support@angohost.ao" }: AdminSetupDialogProps) => {
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("AngoHost@2025");
  const [isAdminConfigured, setIsAdminConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data, error } = await executeQuery(
          'SELECT email FROM users WHERE email = ? AND role = ?',
          [defaultEmail, 'admin']
        );
          
        setIsAdminConfigured(data && Array.isArray(data) && data.length > 0);
      } catch (error) {
        console.error("Erro ao verificar status do admin:", error);
      }
    };
    
    if (isOpen) {
      checkAdminStatus();
    }
  }, [isOpen, defaultEmail]);

  const handleSetup = async () => {
    if (isAdminConfigured) {
      toast.info('O super administrador já está configurado.');
      onOpenChange(false);
      return;
    }
    
    setIsLoading(true);
    try {
      // Check if user exists
      const { data: existingUser } = await executeQuery(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );
      
      if (existingUser && Array.isArray(existingUser) && existingUser.length > 0) {
        // Update existing user to admin
        const userId = existingUser[0].id;
        
        await executeQuery(
          'UPDATE users SET role = ?, is_active = ? WHERE id = ?',
          ['admin', true, userId]
        );
        
        // Setup admin permissions
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
        
        toast.success('Usuário já existente. Permissões de administrador atualizadas.');
      } else {
        // Create new admin user
        const { data: newUser, error } = await executeQuery(
          `INSERT INTO users 
           (email, password, full_name, role, is_active, created_at) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [email, password, 'Suporte AngoHost', 'admin', true, new Date().toISOString()]
        );
        
        if (error) throw new Error(error);
        
        // Get the new user ID
        const userId = (newUser as any).insertId;
        
        // Setup admin permissions
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
        
        toast.success('Administrador criado com sucesso! Email: ' + email);
      }
      
      setIsAdminConfigured(true);
      onOpenChange(false);
    } catch (error: any) {
      console.error('Erro ao criar super admin:', error);
      toast.error(`Erro ao configurar administrador: ${error.message || 'Falha na operação'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configuração do Sistema AngoHost</DialogTitle>
          <DialogDescription>
            {isAdminConfigured 
              ? 'O super administrador já está configurado no sistema.' 
              : 'Configure o usuário principal com acesso completo a todas as funcionalidades do sistema.'}
          </DialogDescription>
        </DialogHeader>
        {!isAdminConfigured && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="setup-email" className="text-right">
                Email
              </Label>
              <Input
                id="setup-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="setup-password" className="text-right">
                Senha
              </Label>
              <Input
                id="setup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="col-span-3"
              />
            </div>
            {isAdminConfigured && (
              <div className="bg-green-50 text-green-800 p-3 rounded border border-green-200">
                O usuário administrador já existe no sistema.
              </div>
            )}
          </div>
        )}
        <DialogFooter>
          {isAdminConfigured ? (
            <Button onClick={() => onOpenChange(false)}>
              OK
            </Button>
          ) : (
            <>
              <Button onClick={() => onOpenChange(false)} variant="outline">
                Cancelar
              </Button>
              <Button onClick={handleSetup} disabled={isLoading}>
                {isLoading ? "Configurando..." : "Configurar Super Admin"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminSetupDialog;
