
import React, { useState, useEffect } from "react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PersonalInfoForm from "./profile/PersonalInfoForm";
import PasswordChangeForm from "./profile/PasswordChangeForm";
import TwoFactorAuth from "./profile/TwoFactorAuth";
import LoginHistory from "./profile/LoginHistory";

const ProfilePage = () => {
  const { user } = useSupabaseAuth();
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setProfile({
            full_name: data.full_name || '',
            email: data.email || user.email || '',
            phone: data.phone || '',
            address: data.address || '',
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Erro ao carregar dados do perfil');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [user]);

  const handleToggle2FA = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    toast.info(twoFactorEnabled 
      ? 'Autenticação de dois fatores desativada' 
      : 'Autenticação de dois fatores ativada');
  };

  if (loading) {
    return <div className="flex justify-center py-8">Carregando dados do perfil...</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Meu Perfil</h1>
      
      <Tabs defaultValue="personal-info">
        <TabsList className="mb-6">
          <TabsTrigger value="personal-info">Informações Pessoais</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="login-history">Histórico de Login</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal-info">
          <PersonalInfoForm 
            profile={profile} 
            setProfile={setProfile}
            userId={user?.id || ''}
          />
        </TabsContent>
        
        <TabsContent value="security">
          <div className="grid gap-6 md:grid-cols-2">
            <PasswordChangeForm />
            <TwoFactorAuth 
              enabled={twoFactorEnabled}
              onToggle={handleToggle2FA}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="login-history">
          <LoginHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
