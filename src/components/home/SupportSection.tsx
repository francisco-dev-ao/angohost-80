
import React from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MessageCircle, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const SupportSection = () => {
  const supportFeatures = [
    {
      icon: Phone,
      title: "Suporte por Telefone",
      description: "Atendimento direto com nossos especialistas.",
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: Mail,
      title: "Suporte por Email",
      description: "Resposta em menos de 2 horas.",
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: MessageCircle,
      title: "Chat ao Vivo",
      description: "Converse em tempo real com nossa equipe.",
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: Clock,
      title: "24/7 Disponível",
      description: "Estamos sempre prontos para ajudar.",
      color: "bg-blue-50 text-blue-600"
    }
  ];

  const containerAnimation = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    },
    hover: {
      y: -5,
      transition: { duration: 0.2 }
    }
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-angohost-primary/5 rounded-l-[100px] -z-0"></div>
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="text-4xl font-bold text-angohost-primary mb-6">
              Suporte Técnico Especializado
            </h2>
            <div className="w-20 h-1.5 bg-angohost-accent mb-8 rounded-full"></div>
            
            <p className="text-xl text-gray-600 mb-8">
              Nossa equipe de especialistas está disponível 24 horas por dia, 7 dias por semana para garantir 
              que seu site esteja sempre no ar e funcionando perfeitamente.
            </p>
            
            <ul className="space-y-5 mb-10">
              {["Suporte técnico 24/7", "Profissionais certificados", "Resposta rápida", "Resolução eficaz"].map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-lg text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
            
            <div className="flex space-x-4">
              <Button 
                asChild 
                className="bg-angohost-primary hover:bg-angohost-primary/90 px-8"
              >
                <Link to="/contact">Entrar em Contato</Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                className="border-angohost-primary text-angohost-primary hover:bg-angohost-primary/10"
              >
                <a href="tel:+244999999999">Ligar Agora</a>
              </Button>
            </div>
          </motion.div>
          
          <motion.div 
            className="lg:w-1/2"
            variants={containerAnimation}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {supportFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemAnimation}
                  whileHover="hover"
                  className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 h-full flex flex-col"
                >
                  <div className={`${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6`}>
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SupportSection;
