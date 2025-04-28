
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfile } from "@/hooks/useProfile";
import PersonalInfoForm from "./profile/PersonalInfoForm";
import PasswordChangeForm from "./profile/PasswordChangeForm";
import TwoFactorAuth from "./profile/TwoFactorAuth";
import LoginHistory from "./profile/LoginHistory";

const ProfilePage = () => {
  const { profile, setProfile, loading } = useProfile();

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
          <PersonalInfoForm profile={profile} setProfile={setProfile} />
        </TabsContent>
        
        <TabsContent value="security">
          <div className="grid gap-6 md:grid-cols-2">
            <PasswordChangeForm />
            <TwoFactorAuth />
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
