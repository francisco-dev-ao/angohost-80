
import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Ban, Check, Edit, Lock, MoreHorizontal, Shield, Trash, Unlock } from 'lucide-react';

interface UserActionsProps {
  userId: string;
  email: string;
  isActive?: boolean;
  role?: string;
  onActionComplete?: () => void;
}

const UserActions = ({ userId, email, isActive = true, role = 'customer', onActionComplete }: UserActionsProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [banDialogOpen, setBanDialogOpen] = useState(false);

  const handleDeleteUser = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      
      toast.success(`Usuário ${email} foi excluído com sucesso`);
      onActionComplete?.();
    } catch (error: any) {
      toast.error(`Erro ao excluir usuário: ${error.message}`);
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleToggleUserStatus = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_active: !isActive 
        })
        .eq('id', userId);

      if (error) throw error;
      
      toast.success(`Usuário ${isActive ? 'bloqueado' : 'desbloqueado'} com sucesso`);
      onActionComplete?.();
    } catch (error: any) {
      toast.error(`Erro ao ${isActive ? 'bloquear' : 'desbloquear'} usuário: ${error.message}`);
    } finally {
      setBanDialogOpen(false);
    }
  };
  
  const handleChangeRole = async (newRole: 'admin' | 'customer') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          role: newRole 
        })
        .eq('id', userId);

      if (error) throw error;
      
      toast.success(`Função do usuário alterada para ${newRole}`);
      onActionComplete?.();
    } catch (error: any) {
      toast.error(`Erro ao alterar função do usuário: ${error.message}`);
    }
  };
  
  const handleResetPassword = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      
      toast.success(`Email de redefinição de senha enviado para ${email}`);
    } catch (error: any) {
      toast.error(`Erro ao enviar email de redefinição de senha: ${error.message}`);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleResetPassword}>
            <Lock className="mr-2 h-4 w-4" />
            <span>Redefinir senha</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setBanDialogOpen(true)}>
            {isActive ? (
              <>
                <Ban className="mr-2 h-4 w-4" />
                <span>Bloquear usuário</span>
              </>
            ) : (
              <>
                <Unlock className="mr-2 h-4 w-4" />
                <span>Desbloquear usuário</span>
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleChangeRole(role === 'admin' ? 'customer' : 'admin')}>
            <Shield className="mr-2 h-4 w-4" />
            <span>{role === 'admin' ? 'Remover admin' : 'Tornar admin'}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => setDeleteDialogOpen(true)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash className="mr-2 h-4 w-4" />
            <span>Excluir usuário</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O usuário {email} será excluído permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteUser}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isActive ? 'Bloquear usuário?' : 'Desbloquear usuário?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isActive 
                ? `O usuário ${email} não poderá acessar a plataforma até que seja desbloqueado.`
                : `O usuário ${email} poderá acessar a plataforma novamente.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleToggleUserStatus}>
              {isActive ? 'Bloquear' : 'Desbloquear'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserActions;
