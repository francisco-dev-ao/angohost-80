
import React from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const Contact = () => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    toast.success("Mensagem enviada com sucesso! Entraremos em contato em breve.");
  };

  return (
    <Layout>
      <div className="bg-muted/50 py-12">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Fale Conosco</h1>
            <p className="text-lg text-muted-foreground">
              Estamos aqui para responder suas dúvidas e ajudar com qualquer questão.
            </p>
          </div>
        </div>
      </div>

      <div className="container py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Envie uma mensagem</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input id="name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Assunto</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o assunto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="support">Suporte Técnico</SelectItem>
                      <SelectItem value="sales">Vendas</SelectItem>
                      <SelectItem value="billing">Faturamento</SelectItem>
                      <SelectItem value="feedback">Feedback</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea id="message" rows={5} required />
                </div>
                
                <Button type="submit">Enviar Mensagem</Button>
              </form>
            </Card>
          </div>
          
          <div>
            <Card className="p-6 h-full">
              <h2 className="text-2xl font-bold mb-6">Informações de Contato</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Suporte ao Cliente</h3>
                  <p className="text-muted-foreground">suporte@hostify.com</p>
                  <p className="text-muted-foreground">+55 (11) 1234-5678</p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Vendas</h3>
                  <p className="text-muted-foreground">vendas@hostify.com</p>
                  <p className="text-muted-foreground">+55 (11) 1234-5679</p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Horário de Atendimento</h3>
                  <p className="text-muted-foreground">Segunda a Sexta: 8h - 20h</p>
                  <p className="text-muted-foreground">Sábados: 9h - 15h</p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Endereço</h3>
                  <address className="not-italic text-muted-foreground">
                    <p>Av. Paulista, 1000, 10° andar</p>
                    <p>Bela Vista, São Paulo - SP</p>
                    <p>CEP: 01310-100</p>
                  </address>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
