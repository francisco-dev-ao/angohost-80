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
import { Ban, Check, Edit, Lock, MoreHorizontal, Shield, Trash, Unlock, UserCog, Eye } from 'lucide-react';
import UserForm from './UserForm';
import { AdminUser } from '@/types/admin';
import UserSessions from './UserSessions';

interface UserActionsProps {
  user: AdminUser;
  onActionComplete?: () => void;
}

const UserActions = ({ user, onActionComplete }: UserActionsProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [sessionsDialogOpen, setSessionsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const isActive = user.isActive !== false; // Default to true if undefined

  const handleDeleteUser = async () => {
    try {
      setIsProcessing(true);
      // Primeiro remover dados do usuário nas tabelas relacionadas
      const tables = [
        'user_sessions',
        'wallet_transactions',
        'wallets',
        'client_tickets',
        'client_domains',
        'client_services',
        'profiles'
      ];
      
      // Deletar os registros em cada tabela que tenha user_id igual ao id do usuário
      for (const table of tables) {
        const { error } = await supabase
          .from(table)
          .delete()
          .eq('user_id', user.id);
        
        if (error && error.code !== '42P01') { // Ignorar erro de tabela não existente
          console.warn(`Erro ao limpar dados em ${table}:`, error);
        }
      }
      
      // Finalmente deletar o usuário na autenticação
      const { error } = await supabase.auth.admin.deleteUser(user.id);

      if (error) throw error;
      
      toast.success(`Usuário ${user.email} foi excluído com sucesso`);
      onActionComplete?.();
    } catch (error: any) {
      toast.error(`Erro ao excluir usuário: ${error.message}`);
    } finally {
      setIsProcessing(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleToggleUserStatus = async () => {
    try {
      setIsProcessing(true);
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: !isActive })
        .eq('id', user.id);

      if (error) throw error;
      
      toast.success(`Usuário ${isActive ? 'bloqueado' : 'desbloqueado'} com sucesso`);
      onActionComplete?.();
    } catch (error: any) {
      toast.error(`Erro ao ${isActive ? 'bloquear' : 'desbloquear'} usuário: ${error.message}`);
    } finally {
      setIsProcessing(false);
      setBanDialogOpen(false);
    }
  };
  
  const handleChangeRole = async (newRole: 'admin' | 'customer') => {
    try {
      setIsProcessing(true);
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', user.id);

      if (error) throw error;
      
      toast.success(`Função do usuário alterada para ${newRole}`);
      onActionComplete?.();
    } catch (error: any) {
      toast.error(`Erro ao alterar função do usuário: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleResetPassword = async () => {
    try {
      setIsProcessing(true);
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      
      toast.success(`Email de redefinição de senha enviado para ${user.email}`);
    } catch (error: any) {
      toast.error(`Erro ao enviar email de redefinição de senha: ${error.message}`);
    } finally {
      setIsProcessing(false);
      setResetPasswordDialogOpen(false);
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
          
          <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            <span>Editar usuário</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => setSessionsDialogOpen(true)}>
            <Eye className="mr-2 h-4 w-4" />
            <span>Ver sessões</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => setResetPasswordDialogOpen(true)}>
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
          
          <DropdownMenuItem onClick={() => handleChangeRole(user.role === 'admin' ? 'customer' : 'admin')}>
            <Shield className="mr-2 h-4 w-4" />
            <span>{user.role === 'admin' ? 'Remover admin' : 'Tornar admin'}</span>
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

      {/* Diálogo de confirmação para exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O usuário {user.email} e todos os seus dados serão excluídos permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteUser}
              className="bg-red-600 hover:bg-red-700"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                "Excluir"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo de visualização de sessões */}
      <AlertDialog open={sessionsDialogOpen} onOpenChange={setSessionsDialogOpen}>
        <AlertDialogContent className="max-w-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Sessões de {user.email}</AlertDialogTitle>
            <AlertDialogDescription>
              Histórico de login e sessões ativas do usuário
            </AlertDialogDescription>
          </AlertDialogHeader>
          <UserSessions userId={user.id} />
          <AlertDialogFooter>
            <AlertDialogCancel>Fechar</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo de confirmação para bloqueio/desbloqueio */}
      <AlertDialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isActive ? 'Bloquear usuário?' : 'Desbloquear usuário?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isActive 
                ? `O usuário ${user.email} não poderá acessar a plataforma até que seja desbloqueado.`
                : `O usuário ${user.email} poderá acessar a plataforma novamente.`
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

      {/* Diálogo de confirmação para redefinição de senha */}
      <AlertDialog open={resetPasswordDialogOpen} onOpenChange={setResetPasswordDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Redefinir senha?</AlertDialogTitle>
            <AlertDialogDescription>
              Um email com instruções para redefinir a senha será enviado para {user.email}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetPassword}>
              Enviar email
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Formulário de edição de usuário */}
      <UserForm
        isOpen={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        user={{
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role as 'admin' | 'support' | 'finance' | 'customer'
        }}
        onSuccess={onActionComplete || (() => {})}
      />
    </>
  );
};

export default UserActions;
