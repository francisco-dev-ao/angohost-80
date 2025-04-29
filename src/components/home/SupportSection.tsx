
import React from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, Mail } from "lucide-react";

const SupportSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-angohost-primary">Suporte em Português, 24/7</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Nossa equipe dedicada está sempre pronta para ajudar com qualquer questão técnica ou dúvida sobre nossos serviços.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <img 
                  src="https://randomuser.me/api/portraits/women/32.jpg" 
                  alt="Agente de Suporte" 
                  className="rounded-full w-24 h-24 object-cover mx-auto"
                />
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <img 
                  src="https://randomuser.me/api/portraits/men/43.jpg" 
                  alt="Agente de Suporte" 
                  className="rounded-full w-24 h-24 object-cover mx-auto"
                />
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <img 
                  src="https://randomuser.me/api/portraits/women/55.jpg" 
                  alt="Agente de Suporte" 
                  className="rounded-full w-24 h-24 object-cover mx-auto"
                />
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <img 
                  src="https://randomuser.me/api/portraits/men/76.jpg" 
                  alt="Agente de Suporte" 
                  className="rounded-full w-24 h-24 object-cover mx-auto"
                />
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 md:pl-12">
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-angohost-primary/10 p-3 rounded-full mr-4">
                  <MessageCircle className="h-6 w-6 text-angohost-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">Chat ao Vivo</h3>
                  <p className="text-gray-600 mb-2">Disponível 24/7 para ajuda imediata</p>
                  <Button size="sm" className="bg-angohost-primary hover:bg-angohost-primary/90">
                    Iniciar Chat
                  </Button>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-angohost-primary/10 p-3 rounded-full mr-4">
                  <Phone className="h-6 w-6 text-angohost-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">Telefone</h3>
                  <p className="text-gray-600 mb-2">Fale diretamente com nossa equipe</p>
                  <p className="text-angohost-primary font-medium">+244 923 456 789</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-angohost-primary/10 p-3 rounded-full mr-4">
                  <Mail className="h-6 w-6 text-angohost-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">Email</h3>
                  <p className="text-gray-600 mb-2">Envie sua dúvida para nossa equipe</p>
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
