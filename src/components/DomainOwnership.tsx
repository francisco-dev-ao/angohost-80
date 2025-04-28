import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { OwnershipProfile } from "@/contexts/OwnershipContext";

const ownershipFormSchema = z.object({
  name: z.string().min(3, "Nome completo é obrigatório"),
  email: z.string().email("Email inválido"),
  document: z.string().min(5, "Documento é obrigatório"),
  phone: z.string().min(9, "Telefone é obrigatório"),
  address: z.string().min(5, "Endereço é obrigatório"),
});

type OwnershipFormValues = z.infer<typeof ownershipFormSchema>;

interface DomainOwnershipProps {
  domain: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (domain: string, data: OwnershipFormValues) => void;
  existingProfiles?: OwnershipProfile[];
}

const DomainOwnership = ({
  domain,
  isOpen,
  onClose,
  onSubmit,
  existingProfiles = [],
}: DomainOwnershipProps) => {
  const form = useForm<OwnershipFormValues>({
    resolver: zodResolver(ownershipFormSchema),
    defaultValues: {
      name: "",
      email: "",
      document: "",
      phone: "",
      address: "",
    },
  });

  const handleSubmit = (data: OwnershipFormValues) => {
    onSubmit(domain, data);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Informações de Titularidade</DialogTitle>
          <DialogDescription>
            Por favor, forneça as informações do proprietário para o domínio{" "}
            <strong>{domain}</strong>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
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
                    <Input placeholder="email@exemplo.com" {...field} />
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
                  <FormLabel>Número do Documento</FormLabel>
                  <FormControl>
                    <Input placeholder="BI ou NIF" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu endereço completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DomainOwnership;
