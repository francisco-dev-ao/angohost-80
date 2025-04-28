
import React from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { toast } from "sonner";

const EditHosting = () => {
  const { id } = useParams();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Editar Serviço de Hospedagem</h2>
            <p className="text-muted-foreground">
              Editar serviço de hospedagem ID: {id}
            </p>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Detalhes do Serviço</CardTitle>
            <CardDescription>
              Altere os dados do serviço selecionado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Esta página está em desenvolvimento. Em breve você poderá editar serviços de hospedagem aqui.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default EditHosting;
