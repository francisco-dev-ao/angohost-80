
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useUserActions = (userId: string, onActionComplete?: () => void) => {
  const changeRole = async (newRole: 'admin' | 'customer') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      
      toast.success(`User role changed to ${newRole}`);
      onActionComplete?.();
    } catch (error: any) {
      toast.error(`Error changing user role: ${error.message}`);
    }
  };

  return {
    changeRole
  };
};

export default useUserActions;
