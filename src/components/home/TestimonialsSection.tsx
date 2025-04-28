
import React from "react";
import TestimonialCard from "@/components/TestimonialCard";
import { Check } from "lucide-react";

interface Testimonial {
  quote: string;
  author: {
    name: string;
    role: string;
    company: string;
    avatarUrl?: string;
  };
}

const TestimonialsSection = () => {
  const testimonials: Testimonial[] = [
    {
      quote: "Migrei meu site para a AngoHost e a velocidade melhorou drasticamente. O suporte técnico é simplesmente incomparável!",
      author: {
        name: "Carlos Silva",
        role: "CEO",
        company: "TechPro Angola",
        avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg"
      }
    },
    {
      quote: "Depois de experimentar vários provedores, finalmente encontrei o que meu e-commerce precisava. Hospedagem estável e rápida!",
      author: {
        name: "Ana Souza",
        role: "Proprietária",
        company: "ModaShop Luanda",
        avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg"
      }
    },
    {
      quote: "A facilidade de gerenciar meus sites e o excelente suporte 24/7 fazem toda diferença. Recomendo totalmente!",
      author: {
        name: "Marcos Oliveira",
        role: "Desenvolvedor Web",
        company: "WebSolutions Angola",
        avatarUrl: "https://randomuser.me/api/portraits/men/67.jpg"
      }
    },
  ];

  return (
    <section className="py-20 bg-[#345990]/5 relative overflow-hidden">
      <div className="container relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-[#345990]">O que nossos clientes dizem</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubra por que empresas e profissionais em Angola confiam na nossa plataforma de hospedagem.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
            />
          ))}
        </div>
        
        <div className="mt-16 max-w-4xl mx-auto bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="md:w-1/2">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Por que nossos clientes nos escolhem?</h3>
              <ul className="space-y-3">
                {[
                  "100% dos clientes recomendam nossos serviços",
                  "Suporte técnico especializado disponível 24/7",
                  "Infraestrutura local com baixa latência",
                  "Migração gratuita do seu site para nossa plataforma"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <div className="mt-1 mr-3 rounded-full bg-green-100 p-1 text-green-600">
                      <Check className="h-4 w-4" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="flex items-center justify-center bg-[#345990]/10 rounded-full p-6 w-40 h-40">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#345990]">98%</div>
                  <div className="text-sm text-gray-600 mt-1">Satisfação dos clientes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute top-12 left-0 w-64 h-64 bg-[#345990]/10 rounded-full -z-10 blur-3xl"></div>
      <div className="absolute bottom-12 right-0 w-80 h-80 bg-[#345990]/5 rounded-full -z-10 blur-3xl"></div>
    </section>
  );
};

export default TestimonialsSection;
