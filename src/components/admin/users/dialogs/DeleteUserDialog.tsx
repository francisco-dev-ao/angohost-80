
import React from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
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

interface DeleteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: { id: string; email: string };
  onSuccess: () => void;
}

const DeleteUserDialog = ({ open, onOpenChange, user, onSuccess }: DeleteUserDialogProps) => {
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleDeleteUser = async () => {
    try {
      setIsProcessing(true);
      // First remove user data in related tables
      const tables = [
        'user_sessions',
        'wallet_transactions',
        'wallets',
        'client_tickets',
        'client_domains',
        'client_services',
        'profiles'
      ];
      
      // Delete records in each table with matching user_id
      for (const table of tables) {
        const { error } = await supabase
          .from(table)
          .delete()
          .eq('user_id', user.id);
        
        if (error && error.code !== '42P01') { // Ignore table not exists error
          console.warn(`Error clearing data in ${table}:`, error);
        }
      }
      
      // Finally delete the user authentication
      const { error } = await supabase.auth.admin.deleteUser(user.id);

      if (error) throw error;
      
      toast.success(`User ${user.email} was successfully deleted`);
      onSuccess();
    } catch (error: any) {
      toast.error(`Error deleting user: ${error.message}`);
    } finally {
      setIsProcessing(false);
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. User {user.email} and all their data will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDeleteUser}
            className="bg-red-600 hover:bg-red-700"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteUserDialog;
