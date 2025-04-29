
import React from "react";
import { Link } from "react-router-dom";
import { Server, Globe, Mail, Shield, CloudCog, Database } from "lucide-react";
import { Button } from "@/components/ui/button";

const ServicesSection = () => {
  const services = [
    {
      title: "Hospedagem Web",
      description: "Soluções completas de hospedagem com cPanel, otimizadas para velocidade e segurança.",
      icon: Server,
      features: [
        "cPanel incluído",
        "99.9% de uptime",
        "SSL gratuito",
        "Backup diário"
      ],
      link: "/cpanel-hosting"
    },
    {
      title: "Domínios .AO",
      description: "Registre seu domínio nacional com os melhores preços e gestão simplificada.",
      icon: Globe,
      features: [
        "Domínios .AO, .CO.AO",
        "Proteção de privacidade",
        "DNS gerenciado",
        "Renovação automática"
      ],
      link: "/domains"
    },
    {
      title: "Email Profissional",
      description: "Email corporativo com o seu domínio e proteção avançada contra spam e vírus.",
      icon: Mail,
      features: [
        "Seu-nome@suaempresa.ao",
        "Antivírus e anti-spam",
        "Acesso via webmail",
        "Integração com MS Office"
      ],
      link: "/professional-email"
    },
    {
      title: "Certificados SSL",
      description: "Proteja seu site e aumente a confiança dos visitantes com certificados SSL.",
      icon: Shield,
      features: [
        "HTTPS seguro",
        "Criptografia forte",
        "Compatível com navegadores",
        "Instalação gratuita"
      ],
      link: "/cpanel-hosting"
    },
    {
      title: "Servidores VPS",
      description: "Servidores virtuais privados com total controle e desempenho garantido.",
      icon: CloudCog,
      features: [
        "Recursos dedicados",
        "Escalabilidade",
        "Root access",
        "Backup incluído"
      ],
      link: "/vps-hosting"
    },
    {
      title: "Banco de Dados",
      description: "Soluções de banco de dados MySQL otimizadas para suas aplicações.",
      icon: Database,
      features: [
        "Alta disponibilidade",
        "Otimizado para WordPress",
        "Backups automáticos",
        "Fácil gerenciamento"
      ],
      link: "/cpanel-hosting"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-angohost-primary mb-3">Serviços Completos de Hospedagem</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Soluções de alta qualidade para sua presença online, com o melhor suporte técnico em Angola.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="service-icon">
                <service.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-angohost-primary">{service.title}</h3>
              <p className="text-gray-600 mb-4 min-h-[60px]">{service.description}</p>
              
              <ul className="mb-6 space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <div className="text-green-500 mr-2">✓</div>
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                asChild 
                variant="outline" 
                className="w-full border-angohost-primary text-angohost-primary hover:bg-angohost-primary hover:text-white"
              >
                <Link to={service.link}>Saber mais</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
