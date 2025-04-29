
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="bg-angohost-primary text-white relative overflow-hidden">
      <div className="container py-16 md:py-24 relative z-10">
        <div className="flex flex-col lg:flex-row items-center max-w-6xl mx-auto">
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              O seu site sempre <br/> no ar, protegido.
            </h1>
            <p className="text-lg mb-8 text-white/90 max-w-lg">
              Hospedagem confiável, domínios .AO e soluções completas para o mercado angolano.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="bg-orange-400 hover:bg-orange-500 text-white border-0"
              >
                <Link to="/products/cpanel">Saber mais</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                <Link to="/contact">Fale connosco</Link>
              </Button>
            </div>
            
            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm">
              <div className="flex items-center">
                <div className="mr-2 rounded-full bg-white/20 p-1">
                  <Check className="h-4 w-4" />
                </div>
                <span>Uptime 99.9% garantido</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 rounded-full bg-white/20 p-1">
                  <Check className="h-4 w-4" />
                </div>
                <span>Suporte técnico 24/7</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 rounded-full bg-white/20 p-1">
                  <Check className="h-4 w-4" />
                </div>
                <span>SSL grátis</span>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 lg:pl-8 relative">
            <img 
              src="/lovable-uploads/f86d31c2-f867-4f8f-ad54-c5019ec784cc.png" 
              alt="Especialista AngoHost" 
              className="relative z-10 rounded-lg shadow-2xl mx-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
