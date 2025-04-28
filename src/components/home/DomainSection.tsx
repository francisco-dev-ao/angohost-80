
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const DomainSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-12 mb-8 lg:mb-0">
              <h2 className="text-3xl font-bold mb-6 text-[#345990]">Registre seu domínio .ao</h2>
              <p className="text-lg text-gray-600 mb-6">
                Garanta sua presença online com um domínio angolano. Oferecemos os melhores preços do mercado para domínios .ao, .co.ao e outras extensões.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Proteção de privacidade WHOIS incluída",
                  "Gerenciamento DNS fácil",
                  "Renovação automática",
                  "Painel de controle intuitivo"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <div className="mr-2 text-[#345990]">
                      <Check className="h-5 w-5" />
                    </div>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                asChild 
                className="bg-[#345990] hover:bg-[#345990]/90"
              >
                <Link to="/domains">Ver preços de domínios</Link>
              </Button>
            </div>
            
            <div className="lg:w-1/2 relative">
              <img 
                src="/lovable-uploads/f86d31c2-f867-4f8f-ad54-c5019ec784cc.png"
                alt="Domínio .ao"
                className="rounded-lg shadow-lg mx-auto"
              />
              <div className="absolute -bottom-4 -right-4 w-64 h-64 bg-[#345990] rounded-full filter blur-3xl opacity-10 z-0"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DomainSection;
