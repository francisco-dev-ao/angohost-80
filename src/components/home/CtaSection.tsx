
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CtaSection = () => {
  return (
    <section className="py-12 bg-angohost-primary text-white">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-lg mb-8 text-white/85">
            Registre seu domínio, escolha um plano de hospedagem e coloque seu projeto online hoje mesmo.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              asChild 
              size="lg" 
              className="bg-white text-angohost-primary hover:bg-gray-100"
            >
              <Link to="/domains">
                Registrar Domínio <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              <Link to="/cpanel-hosting">
                Ver Planos de Hospedagem
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
