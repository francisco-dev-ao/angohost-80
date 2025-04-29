
import React from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
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

interface ToggleUserStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: { id: string; email: string; isActive?: boolean }; // Changed to make isActive optional
  onSuccess: () => void;
}

const ToggleUserStatusDialog = ({ open, onOpenChange, user, onSuccess }: ToggleUserStatusDialogProps) => {
  const [isProcessing, setIsProcessing] = React.useState(false);
  const isActive = user.isActive !== false; // Default to true if undefined

  const handleToggleUserStatus = async () => {
    try {
      setIsProcessing(true);
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: !isActive })
        .eq('id', user.id);

      if (error) throw error;
      
      toast.success(`User ${isActive ? 'blocked' : 'unblocked'} successfully`);
      onSuccess();
    } catch (error: any) {
      toast.error(`Error ${isActive ? 'blocking' : 'unblocking'} user: ${error.message}`);
    } finally {
      setIsProcessing(false);
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isActive ? 'Block user?' : 'Unblock user?'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isActive 
              ? `User ${user.email} will not be able to access the platform until unblocked.`
              : `User ${user.email} will be able to access the platform again.`
            }
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleToggleUserStatus} disabled={isProcessing}>
            {isActive ? 'Block' : 'Unblock'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ToggleUserStatusDialog;
