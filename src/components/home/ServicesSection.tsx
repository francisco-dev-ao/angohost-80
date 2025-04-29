
import React from "react";
import { Link } from "react-router-dom";
import { Server, Globe, Mail, Shield, CloudCog, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    },
    hover: {
      y: -10,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.3 }
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-angohost-primary">
            Serviços Completos de Hospedagem
          </h2>
          <div className="w-24 h-1.5 bg-angohost-accent mx-auto mt-6 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-6">
            Soluções de alta qualidade para sua presença online, com o melhor suporte técnico em Angola.
          </p>
        </div>

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover="hover"
              className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-lg transition-all duration-300"
            >
              <div className="p-8 h-full flex flex-col">
                <div className="bg-angohost-primary/10 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                  <service.icon className="h-7 w-7 text-angohost-primary" />
                </div>
                
                <h3 className="text-2xl font-bold text-angohost-primary mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                
                <ul className="mb-8 space-y-3 flex-grow">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="text-green-500 mr-3 mt-1 flex-shrink-0">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  asChild 
                  className="w-full bg-angohost-primary hover:bg-angohost-primary/90 text-white mt-auto"
                >
                  <Link to={service.link}>
                    Ver detalhes
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
