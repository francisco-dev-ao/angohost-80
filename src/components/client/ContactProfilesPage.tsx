
import React, { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Edit, Plus, Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

interface ContactProfile {
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

const contactProfileSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  phone: z.string().min(9, { message: 'Telefone deve ter pelo menos 9 caracteres' }),
  document: z.string().min(5, { message: 'Documento deve ter pelo menos 5 caracteres' }),
  address: z.string().min(5, { message: 'Endereço deve ter pelo menos 5 caracteres' }),
});

const ContactProfilesPage = () => {
  const { user } = useSupabaseAuth();
  const [profiles, setProfiles] = useState<ContactProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentProfile, setCurrentProfile] = useState<ContactProfile | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof contactProfileSchema>>({
    resolver: zodResolver(contactProfileSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      document: '',
      address: '',
    },
  });

  const fetchProfiles = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contact_profiles')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setProfiles(data as ContactProfile[] || []);
    } catch (error: any) {
      toast.error('Erro ao carregar perfis de contato: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [user]);

  const handleEditProfile = (profile: ContactProfile) => {
    setCurrentProfile(profile);
    form.reset({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      document: profile.document,
      address: profile.address,
    });
    setDialogOpen(true);
  };

  const handleNewProfile = () => {
    setCurrentProfile(null);
    form.reset({
      name: '',
      email: '',
      phone: '',
      document: '',
      address: '',
    });
    setDialogOpen(true);
  };

  const handleDeleteProfile = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('contact_profiles')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      toast.success('Perfil de contato excluído com sucesso');
      fetchProfiles();
    } catch (error: any) {
      toast.error('Erro ao excluir perfil de contato: ' + error.message);
    }
  };

  const onSubmit = async (values: z.infer<typeof contactProfileSchema>) => {
    if (!user) return;

    try {
      if (currentProfile) {
        const { error } = await supabase
          .from('contact_profiles')
          .update({
            name: values.name,
            email: values.email,
            phone: values.phone,
            document: values.document,
            address: values.address,
            updated_at: new Date().toISOString(),
          })
          .eq('id', currentProfile.id)
          .eq('user_id', user.id);

        if (error) throw error;
        toast.success('Perfil de contato atualizado com sucesso');
      } else {
        const { error } = await supabase
          .from('contact_profiles')
          .insert({
            user_id: user.id,
            name: values.name,
            email: values.email,
            phone: values.phone,
            document: values.document,
            address: values.address,
          });

        if (error) throw error;
        toast.success('Perfil de contato criado com sucesso');
      }

      setDialogOpen(false);
      fetchProfiles();
    } catch (error: any) {
      toast.error('Erro ao salvar perfil de contato: ' + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Perfis de Contato</h1>
        <Button onClick={handleNewProfile}>
          <Plus className="mr-2 h-4 w-4" /> Novo Perfil
        </Button>
      </div>

      <p className="text-muted-foreground">
        Gerencia seus perfis de contato utilizados para titularidade de domínios e serviços.
      </p>

      {loading ? (
        <div className="text-center py-8">Carregando perfis de contato...</div>
      ) : profiles.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {profiles.map((profile) => (
            <Card key={profile.id}>
              <CardHeader>
                <CardTitle>{profile.name}</CardTitle>
                <CardDescription>{profile.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2 text-sm">
                  <div className="flex">
                    <dt className="w-24 font-medium">Telefone:</dt>
                    <dd>{profile.phone}</dd>
                  </div>
                  <div className="flex">
                    <dt className="w-24 font-medium">Documento:</dt>
                    <dd>{profile.document}</dd>
                  </div>
                  <div className="flex">
                    <dt className="w-24 font-medium">Endereço:</dt>
                    <dd>{profile.address}</dd>
                  </div>
                </dl>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleEditProfile(profile)}
                >
                  <Edit className="h-4 w-4 mr-2" /> Editar
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={() => handleDeleteProfile(profile.id)}
                >
                  <Trash className="h-4 w-4 mr-2" /> Excluir
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Nenhum perfil de contato encontrado</CardTitle>
            <CardDescription>
              Crie perfis de contato para facilitar o registro de domínios e serviços.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={handleNewProfile}>Criar primeiro perfil</Button>
          </CardFooter>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentProfile ? 'Editar Perfil de Contato' : 'Novo Perfil de Contato'}
            </DialogTitle>
            <DialogDescription>
              Preencha as informações do perfil de contato. Estes dados serão usados para titularidade de domínios e serviços.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input placeholder="+244 999 999 999" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="document"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Documento</FormLabel>
                      <FormControl>
                        <Input placeholder="BI, Passaporte ou NIF" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Input placeholder="Endereço completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactProfilesPage;
