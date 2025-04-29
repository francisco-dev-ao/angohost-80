
import React from "react";
import { Link } from "react-router-dom";
import { Server, Globe, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const ServicesSection = () => {
  const services = [
    {
      title: "Hospedagem Web",
      description: "Soluções de hospedagem de alta qualidade com uptime garantido e suporte técnico 24/7.",
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
      title: "Domínios",
      description: "Registre seu domínio .AO e outras extensões com preços competitivos e gestão simplificada.",
      icon: Globe,
      features: [
        "Proteção de privacidade",
        "Renovação automática",
        "Painel de controle",
        "Suporte técnico 24/7"
      ],
      link: "/domains"
    },
    {
      title: "Email Profissional",
      description: "Soluções de email empresarial com sua marca e recursos avançados de segurança.",
      icon: Mail,
      features: [
        "Anti-spam avançado",
        "Webmail responsivo",
        "50GB de espaço",
        "Integração com MS Office"
      ],
      link: "/professional-email"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-angohost-primary mb-3">Serviços de Alta Qualidade</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Oferecemos soluções completas para sua presença online com o melhor suporte do mercado angolano.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="service-icon">
                <service.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-angohost-primary">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              
              <ul className="mb-6 space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <div className="text-green-500 mr-2">✓</div>
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button asChild variant="outline" className="w-full border-angohost-primary text-angohost-primary hover:bg-angohost-primary hover:text-white">
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
