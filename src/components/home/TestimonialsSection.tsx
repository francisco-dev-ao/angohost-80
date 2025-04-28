
import React from "react";
import TestimonialCard from "@/components/TestimonialCard";

interface Testimonial {
  quote: string;
  author: {
    name: string;
    role: string;
    company: string;
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
      }
    },
    {
      quote: "Depois de experimentar vários provedores, finalmente encontrei o que meu e-commerce precisava. Hospedagem estável e rápida!",
      author: {
        name: "Ana Souza",
        role: "Proprietária",
        company: "ModaShop Luanda",
      }
    },
    {
      quote: "A facilidade de gerenciar meus sites e o excelente suporte 24/7 fazem toda diferença. Recomendo totalmente!",
      author: {
        name: "Marcos Oliveira",
        role: "Desenvolvedor Web",
        company: "WebSolutions Angola",
      }
    },
  ];

  return (
    <section className="py-16 bg-[#345990]/5">
      <div className="container">
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
      </div>
    </section>
  );
};

export default TestimonialsSection;
