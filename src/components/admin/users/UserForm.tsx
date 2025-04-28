
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Schema de validação para o formulário
const formSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  fullName: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  role: z.enum(["admin", "support", "finance", "customer"]),
  password: z
    .string()
    .min(8, { message: "Senha deve ter pelo menos 8 caracteres" })
    .optional(),
});

interface UserFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user?: {
    id: string;
    email: string;
    fullName: string;
    role: 'admin' | 'support' | 'finance' | 'customer';
  };
  onSuccess: () => void;
}

const UserForm = ({ isOpen, onOpenChange, user, onSuccess }: UserFormProps) => {
  const isEditMode = !!user;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user?.email || "",
      fullName: user?.fullName || "",
      role: (user?.role || "customer") as "admin" | "support" | "finance" | "customer",
      password: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        password: "",
      });
    } else {
      form.reset({
        email: "",
        fullName: "",
        role: "customer",
        password: "",
      });
    }
  }, [user, form, isOpen]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      if (isEditMode) {
        // Atualizar usuário existente
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: values.fullName,
            role: values.role,
          })
          .eq('id', user.id);

        if (error) throw error;

        // Se foi fornecida uma nova senha, atualizá-la
        if (values.password) {
          // Reset de senha via email
          const { error: resetError } = await supabase.auth.resetPasswordForEmail(user.email, {
            redirectTo: `${window.location.origin}/reset-password`,
          });

          if (resetError) throw resetError;
        }

        toast.success("Usuário atualizado com sucesso!");
      } else {
        // Criar novo usuário
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: values.email,
          password: values.password || "Temp123456!",
          options: {
            data: {
              full_name: values.fullName,
            },
          },
        });

        if (authError) throw authError;

        if (authData.user) {
          // Atualizar o papel do usuário no perfil
          const { error: profileError } = await supabase
            .from('profiles')
            .update({
              role: values.role,
            })
            .eq('id', authData.user.id);

          if (profileError) throw profileError;
        }

        toast.success("Usuário criado com sucesso!");
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(`Erro: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Editar usuário" : "Adicionar novo usuário"}</DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? "Edite as informações do usuário abaixo." 
              : "Preencha os dados para criar um novo usuário."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="email@exemplo.com" 
                      disabled={isEditMode} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nome completo" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Função</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma função" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="support">Suporte</SelectItem>
                      <SelectItem value="finance">Financeiro</SelectItem>
                      <SelectItem value="customer">Cliente</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {isEditMode ? "Nova senha (opcional)" : "Senha"}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="password" 
                      placeholder={isEditMode ? "Deixe em branco para manter a atual" : "Senha"} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : (isEditMode ? "Salvar" : "Criar")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UserForm;
