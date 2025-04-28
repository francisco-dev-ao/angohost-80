
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const EmailSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col-reverse lg:flex-row items-center">
            <div className="lg:w-1/2 relative mr-8">
              <img 
                src="/lovable-uploads/f86d31c2-f867-4f8f-ad54-c5019ec784cc.png"
                alt="Profissional usando Email"
                className="rounded-lg shadow-lg mx-auto"
              />
              <div className="absolute -bottom-4 -left-4 w-64 h-64 bg-[#345990] rounded-full filter blur-3xl opacity-10 z-0"></div>
            </div>
            
            <div className="lg:w-1/2 lg:pl-12 mb-8 lg:mb-0">
              <h2 className="text-3xl font-bold mb-6 text-[#345990]">Soluções de Email Profissional</h2>
              <p className="text-lg text-gray-600 mb-6">
                Comunique-se profissionalmente com seus clientes e parceiros usando soluções de email corporativo confiáveis e seguras.
              </p>
              <ul className="space-y-4">
                {[
                  "Emails com o nome do seu domínio (seu.nome@suaempresa.ao)",
                  "Proteção avançada contra spam e vírus",
                  "Acesso pelo webmail ou no seu celular e computador",
                  "Integração com Microsoft Outlook e outros clientes de email",
                  "Opções de Microsoft 365 com pacote Office completo"
                ].map((feature, index) => (
                  <li key={index} className="flex">
                    <div className="mr-3 mt-1 text-[#345990]">
                      <Check className="h-5 w-5" />
                    </div>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button 
                  asChild 
                  className="bg-[#345990] hover:bg-[#345990]/90"
                >
                  <Link to="/products/email">Ver planos de email</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmailSection;
