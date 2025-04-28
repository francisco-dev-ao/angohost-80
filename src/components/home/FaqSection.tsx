
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FaqSection = () => {
  const faqs = [
    {
      question: "O que é hospedagem de sites?",
      answer: "Hospedagem de sites é um serviço que permite que empresas e indivíduos publiquem seus sites e aplicações na internet. Na AngoHost, oferecemos soluções de hospedagem confiáveis, rápidas e seguras para todos os tamanhos de projetos."
    },
    {
      question: "Qual plano de hospedagem devo escolher?",
      answer: "A escolha do plano depende das necessidades do seu projeto. Para sites pequenos e pessoais, recomendamos o plano Iniciante. Para empresas e e-commerces, o plano Business. E para projetos maiores que precisam de mais recursos, o plano Profissional é a melhor opção."
    },
    {
      question: "É possível migrar meu site para a AngoHost?",
      answer: "Sim! Oferecemos migração gratuita para todos os novos clientes. Nossa equipe técnica cuidará de todo o processo de transferência do seu site, domínios e emails, garantindo zero tempo de inatividade."
    },
    {
      question: "Vocês oferecem domínios .ao?",
      answer: "Sim, somos registradores oficiais de domínios .ao e outras extensões angolanas como .co.ao, .org.ao e .ed.ao. Também oferecemos diversas extensões internacionais como .com, .net e muitas outras."
    },
    {
      question: "A AngoHost oferece garantia de uptime?",
      answer: "Sim, garantimos 99,9% de uptime em todos os nossos planos de hospedagem. Nossa infraestrutura robusta e redundante assegura que seu site esteja sempre disponível para seus visitantes."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4 text-[#345990]">Perguntas Frequentes</h2>
            <p className="text-lg text-gray-600">Tudo o que você precisa saber sobre nossos serviços</p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200">
                <AccordionTrigger className="text-left font-medium text-gray-800 hover:text-[#345990]">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="text-center mt-10">
            <p className="text-gray-600">
              Não encontrou o que procura? 
              <a href="/contact" className="text-[#345990] font-medium ml-1 hover:underline">
                Entre em contacto com nossa equipe
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
