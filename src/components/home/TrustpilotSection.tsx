
import React from "react";
import { Star } from "lucide-react";

const TrustpilotSection = () => {
  // Sample client logos - in a real implementation, these would be imported from your assets
  const clientLogos = [
    { name: "Cliente 1", logo: "/lovable-uploads/27955777-4d6a-47cc-84eb-dd4d5c84ba54.png" },
    { name: "Cliente 2", logo: "/lovable-uploads/27955777-4d6a-47cc-84eb-dd4d5c84ba54.png" },
    { name: "Cliente 3", logo: "/lovable-uploads/27955777-4d6a-47cc-84eb-dd4d5c84ba54.png" },
    { name: "Cliente 4", logo: "/lovable-uploads/27955777-4d6a-47cc-84eb-dd4d5c84ba54.png" },
    { name: "Cliente 5", logo: "/lovable-uploads/27955777-4d6a-47cc-84eb-dd4d5c84ba54.png" },
  ];

  // Sample testimonials for a more visual impact
  const testimonials = [
    {
      quote: "Serviço excelente, sempre disponíveis para ajudar!",
      author: "Maria Silva",
      company: "TechAO"
    },
    {
      quote: "Melhor host em Angola, uptime realmente de 99.9%!",
      author: "João Pedro",
      company: "E-commerce Angola"
    },
    {
      quote: "Suporte técnico rápido e eficiente, recomendo.",
      author: "Ana Costa",
      company: "Consultoria Digital"
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-angohost-primary">Clientes Satisfeitos</h2>
          <div className="flex items-center justify-center mt-3 mb-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="text-gray-600">4.8/5 nas 700+ avaliações no Trustpilot</p>
          
          <div className="flex items-center justify-center mt-3">
            <img 
              src="/lovable-uploads/27955777-4d6a-47cc-84eb-dd4d5c84ba54.png" 
              alt="Trustpilot" 
              className="h-6"
            />
            <a 
              href="https://pt.trustpilot.com/review/angohost.ao" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="ml-2 text-sm text-angohost-primary hover:underline"
            >
              Veja as 700+ avaliações no Trustpilot
            </a>
          </div>
        </div>

        {/* Featured client testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-angohost-primary/20 flex items-center justify-center text-angohost-primary font-medium">
                  {testimonial.author.charAt(0)}
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-800">{testimonial.author}</p>
                  <p className="text-xs text-gray-500">{testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Client logos carousel */}
        <h3 className="text-xl font-semibold text-center mb-6 text-angohost-primary">Empresas que Confiam em Nós</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 items-center justify-center mt-4">
          {clientLogos.map((logo, index) => (
            <div key={index} className="flex items-center justify-center">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 h-20 w-full flex items-center justify-center hover:shadow-md transition-all">
                <img 
                  src={logo.logo} 
                  alt={logo.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustpilotSection;
