
import React, { createContext, useContext, useState } from 'react';

export interface OwnershipProfile {
  id: string;
  name: string;
  email: string;
  document: string;
  phone: string;
  address: string;
}

interface OwnershipContextType {
  profiles: OwnershipProfile[];
  addProfile: (profile: Omit<OwnershipProfile, 'id'>) => void;
  getProfile: (id: string) => OwnershipProfile | undefined;
  getAllProfiles: () => OwnershipProfile[];
}

const OwnershipContext = createContext<OwnershipContextType | undefined>(undefined);

export const OwnershipProvider = ({ children }: { children: React.ReactNode }) => {
  const [profiles, setProfiles] = useState<OwnershipProfile[]>([]);

  const addProfile = (profile: Omit<OwnershipProfile, 'id'>) => {
    const newProfile = {
      ...profile,
      id: `profile-${Date.now()}`,
    };
    setProfiles((prev) => [...prev, newProfile]);
  };

  const getProfile = (id: string) => {
    return profiles.find((profile) => profile.id === id);
  };

  const getAllProfiles = () => {
    return profiles;
  };

  return (
    <OwnershipContext.Provider value={{ profiles, addProfile, getProfile, getAllProfiles }}>
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
