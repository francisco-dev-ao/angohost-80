import React, { useState } from "react";
import { motion } from "framer-motion";

const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-angohost-primary relative overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="text-4xl font-bold text-white mb-4">Sobre a AngoHost</h2>
          <div className="w-20 h-1.5 bg-angohost-accent mx-auto mt-5 rounded-full"></div>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mt-6">
            A AngoHost é uma empresa angolana autorizada pela DNS Angola, especializada em hospedagem web, e-mail corporativo e soluções digitais. Oferecemos infraestrutura moderna, suporte técnico 24/7 e total confiança para o crescimento do seu negócio.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
