
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="bg-angohost-primary relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-angohost-secondary/30 filter blur-[100px]"></div>
        <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-angohost-secondary/30 filter blur-[100px]"></div>
        <div className="absolute top-1/4 left-1/3 w-[30%] h-[30%] rounded-full bg-angohost-accent/10 filter blur-[80px]"></div>
      </div>

      {/* SVG Wave at bottom */}
      <div className="absolute bottom-0 left-0 w-full pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 50">
          <path fill="#FFFFFF" fillRule="evenodd" d="M0,0 C240,50 480,50 720,25 C960,0 1200,0 1440,25 L1440,50 L0,50 Z"></path>
        </svg>
      </div>
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-28 relative z-10">
        <div className="flex flex-col lg:flex-row items-center space-y-12 lg:space-y-0 lg:space-x-8">
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="max-w-xl">
              <motion.h1 
                className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                Domínios e Hospedagem<br/> em Angola
              </motion.h1>
              <motion.p 
                className="text-xl text-white/90 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
              >
                Soluções completas de hospedagem web, domínios .AO e email profissional 
                com infraestrutura de última geração para o seu negócio crescer online.
              </motion.p>
              <motion.div 
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.7 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400 }}>
                  <Button
                    asChild
                    size="lg"
                    className="bg-white text-angohost-primary hover:bg-white/90 shadow-lg"
                  >
                    <Link to="/domains">Registrar Domínio <ArrowRight className="ml-2 h-5 w-5" /></Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400 }}>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white/10"
                  >
                    <Link to="/cpanel-hosting">Ver Planos</Link>
                  </Button>
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.9 }}
              >
                {[
                  "Uptime 99.9% garantido", 
                  "Suporte técnico 24/7", 
                  "SSL grátis"
                ].map((item, i) => (
                  <div key={i} className="flex items-center">
                    <div className="mr-2 rounded-full bg-angohost-accent p-1">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-white text-sm md:text-base">{item}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <div className="relative">
              {/* Server image */}
              <motion.div 
                className="relative z-20 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              >
                <img 
                  src="/lovable-uploads/f86d31c2-f867-4f8f-ad54-c5019ec784cc.png" 
                  alt="AngoHost Solutions" 
                  className="w-full h-auto"
                />
              </motion.div>
              
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-angohost-accent/20 blur-lg z-10"></div>
              <div className="absolute -bottom-6 -left-6 w-40 h-40 rounded-full bg-angohost-secondary/20 blur-lg z-10"></div>
              
              {/* Tech icons floating */}
              <div className="absolute top-10 -left-10 bg-white p-4 rounded-full shadow-lg z-30 animate-bounce" style={{animationDuration: '3s', animationDelay: '0.5s'}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-angohost-primary"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="21.17" x2="12" y1="8" y2="8"/><line x1="3.95" x2="8.54" y1="6.06" y2="14"/><line x1="10.88" x2="15.46" y1="21.94" y2="14"/></svg>
              </div>
              <div className="absolute bottom-10 -right-10 bg-white p-4 rounded-full shadow-lg z-30 animate-bounce" style={{animationDuration: '4s'}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-angohost-primary"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.7 }}
        >
          <div className="flex flex-col items-center">
            <span className="text-white/70 text-sm mb-2">Explore mais</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-white/70 animate-bounce"
            >
              <path d="M12 5v14M5 12l7 7 7-7"/>
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
