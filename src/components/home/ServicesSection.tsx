
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
      link: "/cpanel-hosting",
      color: "bg-gradient-to-br from-blue-50 to-blue-100"
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
      link: "/domains",
      color: "bg-gradient-to-br from-emerald-50 to-emerald-100"
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
      link: "/professional-email",
      color: "bg-gradient-to-br from-amber-50 to-amber-100"
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
      link: "/cpanel-hosting",
      color: "bg-gradient-to-br from-green-50 to-green-100"
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
      link: "/vps-hosting",
      color: "bg-gradient-to-br from-violet-50 to-violet-100"
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
      link: "/cpanel-hosting",
      color: "bg-gradient-to-br from-indigo-50 to-indigo-100"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-angohost-primary mb-4 relative inline-block">
            Serviços Completos de Hospedagem
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-angohost-accent rounded"></div>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
            Soluções de alta qualidade para sua presença online, com o melhor suporte técnico em Angola.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <div 
              key={index} 
              className={`${service.color} rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden relative`}
            >
              <div className="p-7 h-full flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="bg-white rounded-xl shadow-sm p-3 mr-4">
                    <service.icon className="h-7 w-7 text-angohost-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-angohost-primary">{service.title}</h3>
                </div>
                
                <p className="text-gray-600 mb-5">{service.description}</p>
                
                <ul className="mb-6 space-y-2 flex-grow">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="text-green-500 mr-2 mt-1 flex-shrink-0">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  asChild 
                  className="w-full bg-white border-angohost-primary text-angohost-primary hover:bg-angohost-primary hover:text-white group-hover:bg-angohost-primary group-hover:text-white transition-colors mt-auto"
                >
                  <Link to={service.link}>
                    Saber mais
                  </Link>
                </Button>
              </div>
              
              {/* Decorative element */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/20 rounded-full transition-all duration-300 group-hover:-bottom-5 group-hover:-right-5"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
