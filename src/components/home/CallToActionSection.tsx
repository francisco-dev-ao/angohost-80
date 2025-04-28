
import React from "react";
import CallToAction from "@/components/CallToAction";

const CallToActionSection = () => {
  return (
    <section className="py-16">
      <div className="container">
        <CallToAction
          title="Pronto para iniciar seu projeto online?"
          description="Escolha um dos nossos planos de hospedagem ou registre seu domínio com preços imbatíveis. Nossa equipe está pronta para ajudar você a construir sua presença digital."
          primaryActionText="Ver planos de hospedagem"
          primaryActionHref="/products/cpanel"
          secondaryActionText="Registrar domínio"
          secondaryActionHref="/domains"
        />
      </div>
    </section>
  );
};

export default CallToActionSection;
