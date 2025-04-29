
import React from "react";

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
      quote: "A AngoHost forneceu-nos uma solução de hospedagem estável e rápida. O suporte técnico é excelente, sempre disponível para resolver qualquer problema.",
      author: {
        name: "Paulo Henriques",
        role: "CEO",
        company: "TechAngola",
        avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg"
      }
    },
    {
      quote: "O serviço de email corporativo da AngoHost transformou nossa comunicação. Seguro, confiável e com excelente desempenho.",
      author: {
        name: "Ana Marques",
        role: "Diretora",
        company: "Comércio Digital",
        avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg"
      }
    },
    {
      quote: "Migramos para a AngoHost e notamos imediatamente a melhoria na velocidade do nosso site. Recomendamos seus serviços para todas as empresas em Angola.",
      author: {
        name: "Edgard António",
        role: "CTO",
        company: "StartupAO",
        avatarUrl: "https://randomuser.me/api/portraits/men/67.jpg"
      }
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-angohost-primary">O Que Nossos Clientes Dizem</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Veja por que as empresas de Angola escolhem a AngoHost para suas soluções de hospedagem web.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="mb-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="text-yellow-400">★</span>
                ))}
              </div>
              <blockquote className="mb-6 text-gray-600 italic">
                "{testimonial.quote}"
              </blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 mr-4">
                  {testimonial.author.avatarUrl ? (
                    <img 
                      src={testimonial.author.avatarUrl} 
                      alt={testimonial.author.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-angohost-primary text-white flex items-center justify-center text-lg font-bold">
                      {testimonial.author.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{testimonial.author.name}</p>
                  <p className="text-sm text-gray-500">
                    {testimonial.author.role}, {testimonial.author.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
