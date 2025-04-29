
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="bg-angohost-primary text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-white/10"></div>
        <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-white/10"></div>
        <div className="absolute top-40 left-1/4 w-40 h-40 rounded-full bg-white/10"></div>
      </div>
      
      <div className="container py-16 md:py-20 relative z-10">
        <div className="flex flex-col lg:flex-row items-center max-w-6xl mx-auto">
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Domínios e Hospedagem <br/> em Angola
            </h1>
            <p className="text-lg mb-8 text-white/90 max-w-lg">
              Soluções completas de hospedagem web, domínios .AO e email profissional para o seu negócio crescer online.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="bg-white text-angohost-primary hover:bg-white/90 border-0"
              >
                <Link to="/domains">Registrar Domínio <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                <Link to="/cpanel-hosting">Ver Planos</Link>
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
            <div className="bg-white/5 p-3 rounded-lg shadow-lg">
              <img 
                src="/lovable-uploads/f86d31c2-f867-4f8f-ad54-c5019ec784cc.png" 
                alt="Especialista AngoHost" 
                className="relative z-10 rounded-lg shadow-xl mx-auto"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-4 -right-4 w-40 h-40 rounded-full bg-angohost-secondary/30 filter blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
