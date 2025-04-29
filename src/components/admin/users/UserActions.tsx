
import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ban, Edit, Eye, Lock, MoreHorizontal, Shield, Trash, Unlock } from 'lucide-react';
import { AdminUser } from '@/types/admin';
import UserForm from './UserForm';
import DeleteUserDialog from './dialogs/DeleteUserDialog';
import ToggleUserStatusDialog from './dialogs/ToggleUserStatusDialog';
import ResetPasswordDialog from './dialogs/ResetPasswordDialog';
import UserSessionsDialog from './dialogs/UserSessionsDialog';
import { useUserActions } from './hooks/useUserActions';

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

  const { changeRole } = useUserActions(user.id, onActionComplete);
  const isActive = user.isActive !== false; // Default to true if undefined

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            <span>Edit user</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => setSessionsDialogOpen(true)}>
            <Eye className="mr-2 h-4 w-4" />
            <span>View sessions</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => setResetPasswordDialogOpen(true)}>
            <Lock className="mr-2 h-4 w-4" />
            <span>Reset password</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => setBanDialogOpen(true)}>
            {isActive ? (
              <>
                <Ban className="mr-2 h-4 w-4" />
                <span>Block user</span>
              </>
            ) : (
              <>
                <Unlock className="mr-2 h-4 w-4" />
                <span>Unblock user</span>
              </>
            )}
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => changeRole(user.role === 'admin' ? 'customer' : 'admin')}>
            <Shield className="mr-2 h-4 w-4" />
            <span>{user.role === 'admin' ? 'Remove admin' : 'Make admin'}</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => setDeleteDialogOpen(true)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash className="mr-2 h-4 w-4" />
            <span>Delete user</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialogs */}
      <DeleteUserDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        user={user}
        onSuccess={onActionComplete || (() => {})}
      />

      <UserSessionsDialog
        open={sessionsDialogOpen}
        onOpenChange={setSessionsDialogOpen}
        userId={user.id}
        userEmail={user.email}
      />

      <ToggleUserStatusDialog
        open={banDialogOpen}
        onOpenChange={setBanDialogOpen}
        user={user}
        onSuccess={onActionComplete || (() => {})}
      />

      <ResetPasswordDialog
        open={resetPasswordDialogOpen}
        onOpenChange={setResetPasswordDialogOpen}
        userEmail={user.email}
      />

      {/* User Edit Form */}
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
