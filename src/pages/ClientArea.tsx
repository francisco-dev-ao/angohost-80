
import React from "react";
import Layout from "@/components/Layout";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ClientArea = () => {
  const { user, loading } = useSupabaseAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && !user) {
      toast.error('Faça login para acessar a área do cliente');
      navigate('/register');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="container py-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Carregando...</h1>
            <p>Por favor, aguarde enquanto carregamos suas informações.</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Área do Cliente</h1>
        <p className="text-center text-muted-foreground">
          Esta área está em desenvolvimento. Em breve, você poderá gerenciar seus serviços aqui.
        </p>
        <div className="flex justify-center mt-8">
          <Button onClick={() => navigate('/')}>
            Voltar para a Página Inicial
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default ClientArea;
