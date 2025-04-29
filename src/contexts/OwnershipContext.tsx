
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

export interface OwnershipProfile {
  id: string;
  name: string;
  email: string;
  document: string;
  phone: string;
  address: string;
  userId?: string; // Associate with user
}

interface OwnershipContextType {
  profiles: OwnershipProfile[];
  addProfile: (profile: Omit<OwnershipProfile, 'id'>) => void;
  getProfile: (id: string) => OwnershipProfile | undefined;
  getAllProfiles: () => OwnershipProfile[];
  isLoading: boolean;
  loadProfiles: () => Promise<void>;
}

const OwnershipContext = createContext<OwnershipContextType | undefined>(undefined);

export const OwnershipProvider = ({ children }: { children: React.ReactNode }) => {
  const [profiles, setProfiles] = useState<OwnershipProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSupabaseAuth();

  // Load profiles from local storage initially and then from Supabase if user is logged in
  useEffect(() => {
    const loadFromLocalStorage = () => {
      const savedProfiles = localStorage.getItem('ownership_profiles');
      if (savedProfiles) {
        try {
          setProfiles(JSON.parse(savedProfiles));
        } catch (e) {
          console.error('Error parsing profiles from localStorage', e);
        }
      }
      setIsLoading(false);
    };

    loadFromLocalStorage();

    // If user is logged in, try to load from Supabase
    if (user) {
      loadProfiles();
    }
  }, [user]);

  const loadProfiles = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('contact_profiles')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      if (data && data.length > 0) {
        // Convert Supabase profile to our internal format
        const formattedProfiles = data.map(profile => ({
          id: profile.id,
          name: profile.name,
          email: profile.email,
          document: profile.document,
          phone: profile.phone,
          address: profile.address,
          userId: profile.user_id
        }));
        
        setProfiles(formattedProfiles);
        
        // Also update local storage for offline access
        localStorage.setItem('ownership_profiles', JSON.stringify(formattedProfiles));
      }
    } catch (error) {
      console.error('Error loading profiles from Supabase', error);
      toast.error('Erro ao carregar perfis de titularidade');
    } finally {
      setIsLoading(false);
    }
  };

  const addProfile = async (profile: Omit<OwnershipProfile, 'id'>) => {
    const newProfile = {
      ...profile,
      id: `profile-${Date.now()}`,
    };

    // Update local state
    setProfiles((prev) => {
      const updated = [...prev, newProfile];
      localStorage.setItem('ownership_profiles', JSON.stringify(updated));
      return updated;
    });

    // If user is logged in, also save to Supabase
    if (user && supabase) {
      try {
        const { error } = await supabase
          .from('contact_profiles')
          .insert({
            user_id: user.id,
            name: profile.name,
            email: profile.email,
            document: profile.document,
            phone: profile.phone,
            address: profile.address
          });

        if (error) throw error;
        
        // Reload profiles to get the server-generated ID
        loadProfiles();
      } catch (error) {
        console.error('Error saving profile to Supabase', error);
        toast.error('Erro ao salvar perfil de titularidade');
      }
    }
  };

  const getProfile = (id: string) => {
    return profiles.find((profile) => profile.id === id);
  };

  const getAllProfiles = () => {
    return profiles;
  };

  return (
    <OwnershipContext.Provider value={{ profiles, addProfile, getProfile, getAllProfiles, isLoading, loadProfiles }}>
      {children}
    </OwnershipContext.Provider>
  );
};

export const useOwnership = () => {
  const context = useContext(OwnershipContext);
  if (!context) {
    throw new Error('useOwnership must be used within an OwnershipProvider');
  }
  return context;
};
