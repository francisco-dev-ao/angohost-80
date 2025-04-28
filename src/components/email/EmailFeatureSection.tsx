
import React from "react";
import FeatureCard from "@/components/FeatureCard";
import { Mail, Server, Globe } from "lucide-react";

const EmailFeatureSection = () => {
  return (
    <div className="grid md:grid-cols-3 gap-8 mt-16">
      <FeatureCard
        icon={<Mail className="w-6 h-6" />}
        title="Email Profissional"
        description="Use seu domínio próprio para emails corporativos com acesso em qualquer dispositivo"
      />
      <FeatureCard
        icon={<Server className="w-6 h-6" />}
        title="Segurança Avançada"
        description="Proteção contra spam, vírus e ataques de phishing incluída em todos os planos"
      />
      <FeatureCard
        icon={<Globe className="w-6 h-6" />}
        title="Suporte 24/7"
        description="Nossa equipe está disponível 24 horas por dia, 7 dias por semana para ajudar você"
      />
    </div>
  );
};

export default EmailFeatureSection;
