
import React from "react";
import { Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const TrustpilotSection = () => {
  // Sample client logos - you would replace these with actual client logos
  const clientLogos = [
    { name: "Unitel", logo: "/placeholder.svg" },
    { name: "BFA", logo: "/placeholder.svg" },
    { name: "TAAG", logo: "/placeholder.svg" },
    { name: "Endiama", logo: "/placeholder.svg" },
    { name: "Sonangol", logo: "/placeholder.svg" },
  ];
  
  // Sample testimonials - you would replace these with actual testimonials
  const testimonials = [
    {
      name: "Carlos Fernandes",
      company: "Tech Solutions Angola",
      text: "A melhor hospedagem que já utilizei. Suporte rápido e eficiente, sempre disponíveis para ajudar.",
      rating: 5,
      avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      name: "Maria Santos",
      company: "Digital Marketing Pro",
      text: "Muito satisfeita com os serviços da AngoHost. Nunca tive problemas com o uptime do meu site.",
      rating: 5,
      avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg"
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-angohost-primary mb-3">Clientes Satisfeitos</h2>
          <div className="flex items-center justify-center mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="text-gray-600 mt-2">4.8/5 em mais de 700 avaliações no Trustpilot</p>
          
          <div className="flex items-center justify-center mt-3">
            <img 
              src="/lovable-uploads/27955777-4d6a-47cc-84eb-dd4d5c84ba54.png" 
              alt="Trustpilot" 
              className="h-6"
            />
            <Button 
              variant="link" 
              asChild
              className="ml-2 text-sm text-gray-500 hover:text-angohost-primary"
            >
              <a href="https://pt.trustpilot.com/review/angohost.ao" target="_blank" rel="noopener noreferrer">
                Ver todas as 700+ avaliações no Trustpilot <ChevronRight className="h-3 w-3 ml-1" />
              </a>
            </Button>
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-100 shadow-sm">
              <div className="flex mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 italic mb-4">"{testimonial.text}"</p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  <img 
                    src={testimonial.avatarUrl} 
                    alt={testimonial.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Client logos */}
        <div className="mt-10">
          <h3 className="text-lg font-medium text-center mb-8 text-angohost-primary">Empresas que confiam na AngoHost</h3>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-8 items-center justify-items-center">
            {clientLogos.map((client, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg h-20 w-32 flex items-center justify-center">
                <img 
                  src={client.logo} 
                  alt={`${client.name} logo`}
                  className="max-h-12 max-w-full opacity-80"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustpilotSection;
