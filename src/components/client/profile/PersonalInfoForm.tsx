
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProfileData {
  full_name: string;
  email: string;
  phone: string;
  address: string;
}

interface PersonalInfoFormProps {
  profile: ProfileData;
  setProfile: React.Dispatch<React.SetStateAction<ProfileData>>;
  userId: string;
}

const PersonalInfoForm = ({ profile, setProfile, userId }: PersonalInfoFormProps) => {
  const [updating, setUpdating] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) return;
    
    try {
      setUpdating(true);
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          full_name: profile.full_name,
          email: profile.email,
          phone: profile.phone,
          address: profile.address,
          updated_at: new Date().toISOString(),
        });
        
      if (error) {
        throw error;
      }
      
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Erro ao atualizar perfil');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Pessoais</CardTitle>
        <CardDescription>
          Atualize seus dados pessoais e informações de contato.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleUpdateProfile}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Nome Completo</Label>
            <Input 
              id="full_name"
              value={profile.full_name}
              onChange={(e) => setProfile({...profile, full_name: e.target.value})}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({...profile, email: e.target.value})}
              required
              disabled
            />
            <p className="text-sm text-muted-foreground">
              O email não pode ser alterado diretamente. Entre em contato com o suporte.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input 
              id="phone"
              value={profile.phone}
              onChange={(e) => setProfile({...profile, phone: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input 
              id="address"
              value={profile.address}
              onChange={(e) => setProfile({...profile, address: e.target.value})}
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <Button type="submit" disabled={updating}>
            {updating ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PersonalInfoForm;
