
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const CtaSection = () => {
  return (
    <section className="py-20 bg-angohost-primary relative overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
          <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <path d="M488.5,274.5Q446,299,422.5,338.5Q399,378,365.5,412Q332,446,282,455.5Q232,465,191,432.5Q150,400,106,376.5Q62,353,56.5,303Q51,253,51.5,201.5Q52,150,101.5,128Q151,106,183,74Q215,42,266,36Q317,30,361,54.5Q405,79,423,123Q441,167,486,208.5Q531,250,488.5,274.5Z" fill="#ffffff"></path>
          </svg>
        </div>
        <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 opacity-10">
          <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <path d="M374,352.5Q336,455,226,438Q116,421,111.5,310.5Q107,200,198.5,134.5Q290,69,369,134.5Q448,200,393,301Q338,402,374,352.5Z" fill="#ffffff"></path>
          </svg>
        </div>
      </div>
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div 
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Pronto para começar?</h2>
          <p className="text-xl mb-10 text-white/90 max-w-3xl mx-auto">
            Registre seu domínio, escolha um plano de hospedagem e coloque seu projeto online hoje mesmo. 
            Oferecemos a melhor experiência de hospedagem em Angola com suporte técnico especializado.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 400 }}>
              <Button 
                asChild 
                size="lg" 
                className="bg-white text-angohost-primary hover:bg-gray-100 text-lg px-8 py-6 h-auto shadow-lg"
              >
                <Link to="/domains">
                  Registrar Domínio <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 400 }}>
              <Button 
                asChild 
                size="lg" 
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6 h-auto"
              >
                <Link to="/cpanel-hosting">
                  Ver Planos de Hospedagem
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;
