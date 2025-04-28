
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { toast } from "sonner";

const CreateHosting = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Criar Serviço de Hospedagem</h2>
            <p className="text-muted-foreground">
              Adicione um novo serviço de hospedagem para um cliente
            </p>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Detalhes do Serviço</CardTitle>
            <CardDescription>
              Informe os dados do serviço que será criado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Esta página está em desenvolvimento. Em breve você poderá criar serviços de hospedagem aqui.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default CreateHosting;
