
import React from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, Mail, Clock } from "lucide-react";

const SupportSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-angohost-primary">Suporte Técnico Especializado</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Nossa equipe de especialistas está sempre disponível para ajudar com qualquer questão técnica ou dúvida sobre nossos serviços.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto">
          <div className="md:w-5/12 mb-8 md:mb-0">
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm transform rotate-[-3deg]">
                  <img 
                    src="https://randomuser.me/api/portraits/women/32.jpg" 
                    alt="Especialista de Suporte" 
                    className="rounded-lg w-full h-auto object-cover"
                  />
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm transform rotate-[3deg] translate-y-4">
                  <img 
                    src="https://randomuser.me/api/portraits/men/43.jpg" 
                    alt="Especialista de Suporte" 
                    className="rounded-lg w-full h-auto object-cover"
                  />
                </div>
              </div>
              <div className="absolute inset-0 -z-10 bg-angohost-primary/10 rounded-full blur-3xl"></div>
            </div>
          </div>
          
          <div className="md:w-6/12 md:pl-12">
            <div className="space-y-6">
              <div className="flex items-start feature-card hover-scale">
                <div className="bg-angohost-primary/10 p-3 rounded-full mr-4">
                  <Clock className="h-6 w-6 text-angohost-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">Disponível 24/7</h3>
                  <p className="text-gray-600">
                    Nossa equipe de suporte está disponível 24 horas por dia, 7 dias por semana para atender suas necessidades.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start feature-card hover-scale">
                <div className="bg-angohost-primary/10 p-3 rounded-full mr-4">
                  <MessageCircle className="h-6 w-6 text-angohost-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">Chat ao Vivo</h3>
                  <p className="text-gray-600 mb-2">Tire suas dúvidas em tempo real com nossos especialistas</p>
                  <Button size="sm" className="bg-angohost-primary hover:bg-angohost-primary/90">
                    Iniciar Chat
                  </Button>
                </div>
              </div>
              
              <div className="flex items-start feature-card hover-scale">
                <div className="bg-angohost-primary/10 p-3 rounded-full mr-4">
                  <Phone className="h-6 w-6 text-angohost-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">Atendimento por Telefone</h3>
                  <p className="text-gray-600 mb-1">Fale diretamente com nossa equipe técnica</p>
                  <p className="text-angohost-primary font-medium">+244 923 456 789</p>
                </div>
              </div>
              
              <div className="flex items-start feature-card hover-scale">
                <div className="bg-angohost-primary/10 p-3 rounded-full mr-4">
                  <Mail className="h-6 w-6 text-angohost-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">Suporte por Email</h3>
                  <p className="text-gray-600 mb-1">Envie suas dúvidas para nossa equipe</p>
                  <p className="text-angohost-primary font-medium">suporte@angohost.ao</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupportSection;
