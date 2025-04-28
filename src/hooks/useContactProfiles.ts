
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

export interface ContactProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export const useContactProfiles = () => {
  const [profiles, setProfiles] = useState<ContactProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSupabaseAuth();

  useEffect(() => {
    if (!user) return;

    const fetchProfiles = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('contact_profiles')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;
        setProfiles(data as ContactProfile[] || []);
      } catch (error: any) {
        toast.error('Erro ao carregar perfis de contato: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfiles();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('contact-profiles-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contact_profiles',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Contact profile updated:', payload);
          fetchProfiles();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const createProfile = async (profileData: Omit<ContactProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('contact_profiles')
        .insert({
          user_id: user.id,
          ...profileData
        })
        .select()
        .single();

      if (error) throw error;
      toast.success('Perfil de contato criado com sucesso');
      return data;
    } catch (error: any) {
      toast.error('Erro ao criar perfil de contato: ' + error.message);
      return null;
    }
  };

  const updateProfile = async (id: string, profileData: Partial<Omit<ContactProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('contact_profiles')
        .update({
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      toast.success('Perfil de contato atualizado com sucesso');
      return true;
    } catch (error: any) {
      toast.error('Erro ao atualizar perfil de contato: ' + error.message);
      return false;
    }
  };

  const deleteProfile = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('contact_profiles')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      toast.success('Perfil de contato excluído com sucesso');
      return true;
    } catch (error: any) {
      toast.error('Erro ao excluir perfil de contato: ' + error.message);
      return false;
    }
  };

  return {
    profiles,
    isLoading,
    createProfile,
    updateProfile,
    deleteProfile
  };
};
