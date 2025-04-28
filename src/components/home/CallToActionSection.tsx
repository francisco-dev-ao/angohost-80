
import React from "react";
import CallToAction from "@/components/CallToAction";
import { ArrowRight } from "lucide-react";

const CallToActionSection = () => {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="container relative z-10">
        <CallToAction
          title="Pronto para iniciar seu projeto online?"
          description="Escolha um dos nossos planos de hospedagem ou registre seu domínio com preços imbatíveis. Nossa equipe está pronta para ajudar você a construir sua presença digital em Angola."
          primaryActionText={<>Ver planos de hospedagem <ArrowRight className="ml-1 h-4 w-4" /></>}
          primaryActionHref="/products/cpanel"
          secondaryActionText="Registrar domínio"
          secondaryActionHref="/domains"
        />
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-50 to-white -z-10"></div>
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-[#345990]/5 rounded-full blur-3xl -z-5"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#345990]/5 rounded-full blur-3xl -z-5"></div>
    </section>
  );
};

export default CallToActionSection;
