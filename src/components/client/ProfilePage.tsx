
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProfilePage = () => {
  const { user } = useSupabaseAuth();
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  
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
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) return;
    
    try {
      setUpdating(true);
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
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
  
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }
    
    try {
      setChangingPassword(true);
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Senha alterada com sucesso!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast.error(error.message || 'Erro ao alterar senha');
    } finally {
      setChangingPassword(false);
    }
  };
  
  const handleToggle2FA = async () => {
    // In a real-world scenario, you would integrate with Supabase Auth to enable/disable 2FA
    // This is a placeholder for demonstration purposes
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
        </TabsContent>
        
        <TabsContent value="security">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Alterar Senha</CardTitle>
                <CardDescription>
                  Atualizar sua senha regularmente aumenta a segurança da sua conta.
                </CardDescription>
              </CardHeader>
              
              <form onSubmit={handleChangePassword}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nova Senha</Label>
                    <Input 
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={8}
                    />
                    <p className="text-xs text-muted-foreground">
                      A senha deve ter pelo menos 8 caracteres.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                    <Input 
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button type="submit" disabled={changingPassword}>
                    {changingPassword ? 'Alterando...' : 'Alterar Senha'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Autenticação de Dois Fatores</CardTitle>
                <CardDescription>
                  Aumenta a segurança da sua conta exigindo uma segunda forma de verificação.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Ativar 2FA</p>
                    <p className="text-sm text-muted-foreground">
                      {twoFactorEnabled 
                        ? 'A autenticação de dois fatores está ativada' 
                        : 'A autenticação de dois fatores está desativada'}
                    </p>
                  </div>
                  <Switch
                    checked={twoFactorEnabled}
                    onCheckedChange={handleToggle2FA}
                  />
                </div>
                
                {twoFactorEnabled && (
                  <div className="mt-4">
                    <p className="mb-2">Configure seu aplicativo de autenticação usando o QR Code abaixo:</p>
                    <div className="border w-40 h-40 mx-auto flex items-center justify-center bg-gray-100">
                      [QR Code Placeholder]
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground text-center">
                      Escaneie este QR Code com o seu aplicativo de autenticação
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="login-history">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Login</CardTitle>
              <CardDescription>
                Revise as atividades recentes de login na sua conta.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left px-4 py-2">Data/Hora</th>
                      <th className="text-left px-4 py-2">IP</th>
                      <th className="text-left px-4 py-2">Localização</th>
                      <th className="text-left px-4 py-2">Dispositivo</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="px-4 py-3">28/04/2025, 14:32</td>
                      <td className="px-4 py-3">192.168.1.1</td>
                      <td className="px-4 py-3">Lisboa, Portugal</td>
                      <td className="px-4 py-3">Chrome / Windows</td>
                    </tr>
                    <tr className="border-t bg-muted/50">
                      <td className="px-4 py-3">25/04/2025, 09:15</td>
                      <td className="px-4 py-3">192.168.1.1</td>
                      <td className="px-4 py-3">Lisboa, Portugal</td>
                      <td className="px-4 py-3">Safari / iOS</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-3">20/04/2025, 18:45</td>
                      <td className="px-4 py-3">192.168.1.1</td>
                      <td className="px-4 py-3">Lisboa, Portugal</td>
                      <td className="px-4 py-3">Chrome / Windows</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
            
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Se você não reconhece algum desses logins, altere sua senha imediatamente e entre em contato com o suporte.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
