
import React from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const ClientArea = () => {
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Login realizado com sucesso!");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Registro realizado com sucesso! Verifique seu email.");
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info("Instruções de recuperação enviadas ao seu email.");
  };

  return (
    <Layout>
      <div className="container py-16">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Área do Cliente</h1>
          
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Registro</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Acesse sua conta</CardTitle>
                  <CardDescription>
                    Entre com seu email e senha para acessar sua conta.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="seu@email.com" required />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Senha</Label>
                        <Button 
                          type="button" 
                          variant="link" 
                          className="p-0 h-auto text-sm"
                          onClick={handleForgotPassword}
                        >
                          Esqueceu a senha?
                        </Button>
                      </div>
                      <Input id="password" type="password" required />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" type="submit">Entrar</Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Crie sua conta</CardTitle>
                  <CardDescription>
                    Registre-se para gerenciar seus serviços.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-4">
                      Para se registrar, por favor acesse nossa nova página de registro onde você poderá fornecer todas as informações necessárias.
                    </p>
                    <Button asChild>
                      <Link to="/register">Ir para a página de registro</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default ClientArea;
