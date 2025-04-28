
import React from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <Layout>
      <div className="bg-muted/50 py-12">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Sobre a Hostify</h1>
            <p className="text-lg text-muted-foreground">
              Conheça nossa história e a equipe por trás da nossa empresa.
            </p>
          </div>
        </div>
      </div>

      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Nossa História</h2>
              <p className="mb-4">
                Fundada em 2010, a Hostify nasceu com a missão de revolucionar o mercado de hospedagem de sites no Brasil, oferecendo soluções confiáveis, de alta performance e com preços acessíveis.
              </p>
              <p className="mb-4">
                Começamos como uma pequena startup com apenas 3 colaboradores e, ao longo dos anos, crescemos para nos tornar uma das principais empresas de hospedagem do país, atendendo mais de 50.000 clientes em todo o Brasil e América Latina.
              </p>
              <p>
                Nossa filosofia sempre foi centrada no cliente, buscando oferecer não apenas uma infraestrutura robusta, mas também um suporte técnico excepcional e ferramentas que facilitam a vida de quem precisa manter sua presença online.
              </p>
            </div>
            <div className="bg-muted rounded-lg p-8 relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-primary h-32 rounded-md" />
                  <div className="bg-background h-48 rounded-md shadow-md" />
                </div>
                <div className="space-y-4 pt-8">
                  <div className="bg-background h-48 rounded-md shadow-md" />
                  <div className="bg-primary/20 h-32 rounded-md" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nossos Valores</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Estes são os princípios que guiam nossas decisões e nosso trabalho diário.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Transparência</h3>
                <p className="text-muted-foreground">
                  Acreditamos em comunicação clara e honesta com nossos clientes e colaboradores.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Inovação</h3>
                <p className="text-muted-foreground">
                  Buscamos constantemente novas tecnologias e soluções para melhorar nossos serviços.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10h18M6 14h2M6 18h2M13 14h2M13 18h2"/><path d="M3 6h18v16H3z"/></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Confiabilidade</h3>
                <p className="text-muted-foreground">
                  Mantemos o compromisso com a estabilidade e segurança dos serviços que oferecemos.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nossa Equipe</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Contamos com especialistas apaixonados por tecnologia e focados em oferecer a melhor experiência.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { name: "Carlos Oliveira", role: "CEO", img: "https://i.pravatar.cc/150?img=1" },
              { name: "Amanda Silva", role: "Diretora de Tecnologia", img: "https://i.pravatar.cc/150?img=5" },
              { name: "Rafael Santos", role: "Líder de Suporte", img: "https://i.pravatar.cc/150?img=3" },
              { name: "Julia Costa", role: "Gerente de Marketing", img: "https://i.pravatar.cc/150?img=10" },
            ].map((member, i) => (
              <div key={i} className="text-center">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 bg-muted">
                  <div className="w-full h-full bg-primary/20" />
                </div>
                <h3 className="font-bold">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Escolha um dos nossos planos de hospedagem e comece seu projeto online hoje mesmo.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link to="/products/cpanel">Ver Planos</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">Fale Conosco</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
