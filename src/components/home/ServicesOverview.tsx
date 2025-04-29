
import React from "react";
import { Link } from "react-router-dom";
import { 
  Server, 
  Globe, 
  Mail, 
  Shield, 
  ShoppingCart, 
  CreditCard,
  Clock,
  Users,
  Database
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ServicesOverview = () => {
  const services = [
    {
      icon: <Server className="h-8 w-8" />,
      title: "Hospedagem",
      description: "Planos de hospedagem confiáveis para seu site",
      link: "/products/cpanel"
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Domínios",
      description: "Registre domínios .ao e internacionais",
      link: "/domains"
    },
    {
      icon: <Mail className="h-8 w-8" />,
      title: "Email",
      description: "Soluções de email profissional",
      link: "/products/email"
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: "VPS",
      description: "Servidores virtuais de alta performance",
      link: "/vps-hosting"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "SSL",
      description: "Certificados de segurança para seu site",
      link: "/ssl"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Revenda",
      description: "Planos de revenda de hospedagem",
      link: "/reseller"
    }
  ];

  return (
    <section className="py-24 bg-white relative">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Nossos Serviços</h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Tudo o que você precisa para estabelecer e manter uma presença online forte e profissional.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <Link 
              to={service.link} 
              key={index} 
              className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className="mb-4 text-[#345990] group-hover:text-blue-600 transition-colors">
                {service.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {service.description}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-xl overflow-hidden">
          <div className="p-8 md:p-12 text-center md:text-left md:flex items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold text-white mb-2">Precisa de ajuda para escolher?</h3>
              <p className="text-white/80">
                Nossos especialistas estão prontos para te ajudar a encontrar a solução ideal.
              </p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-4">
              <Button 
                asChild
                size="lg"
                variant="secondary"
                className="bg-white hover:bg-gray-50 text-blue-600"
              >
                <Link to="/contact">
                  Fale com um especialista
                </Link>
              </Button>
              <Button 
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                <Link to="/about">
                  Sobre nós
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesOverview;
