
import React from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

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
                <form onSubmit={handleRegister}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome completo</Label>
                      <Input id="name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input id="register-email" type="email" placeholder="seu@email.com" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Senha</Label>
                      <Input id="register-password" type="password" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirme a senha</Label>
                      <Input id="confirm-password" type="password" required />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" type="submit">Registrar</Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default ClientArea;
