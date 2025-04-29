
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className="py-24 bg-angohost-primary/5 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="testimonial-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <rect width="1" height="1" fill="#1a365d" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#testimonial-grid)" />
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
          <h2 className="text-4xl font-bold text-angohost-primary mb-4">O Que Nossos Clientes Dizem</h2>
          <div className="w-20 h-1.5 bg-angohost-accent mx-auto mt-5 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-6">
            Veja por que as empresas de Angola escolhem a AngoHost para suas soluções de hospedagem web.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Testimonial carousel */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-100">
              <div className="p-2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                    className="p-8 md:p-12"
                  >
                    <div className="flex justify-center mb-8">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className="w-6 h-6 text-yellow-400 fill-current mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <blockquote className="text-center">
                      <p className="text-2xl font-medium italic text-gray-700 mb-8">
                        "{testimonials[currentIndex].quote}"
                      </p>
                      <div className="flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                          {testimonials[currentIndex].author.avatarUrl ? (
                            <img 
                              src={testimonials[currentIndex].author.avatarUrl} 
                              alt={testimonials[currentIndex].author.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-angohost-primary text-white flex items-center justify-center text-xl font-bold">
                              {testimonials[currentIndex].author.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-xl text-gray-800">{testimonials[currentIndex].author.name}</p>
                          <p className="text-gray-600">
                            {testimonials[currentIndex].author.role}, {testimonials[currentIndex].author.company}
                          </p>
                        </div>
                      </div>
                    </blockquote>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation dots */}
              <div className="flex justify-center pb-6">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-3 h-3 rounded-full mx-1 focus:outline-none ${
                      idx === currentIndex ? "bg-angohost-primary" : "bg-gray-300"
                    }`}
                    aria-label={`Go to testimonial ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Navigation buttons */}
            <button
              onClick={prevTestimonial}
              className="absolute top-1/2 -left-4 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center focus:outline-none hover:bg-gray-50"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6 text-angohost-primary" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute top-1/2 -right-4 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center focus:outline-none hover:bg-gray-50"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6 text-angohost-primary" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
