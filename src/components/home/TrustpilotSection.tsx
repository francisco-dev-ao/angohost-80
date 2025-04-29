import React from "react";
import { Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const TrustpilotSection = () => {
  // Sample client logos - you would replace these with actual client logos
  const clientLogos = [
    { name: "Aldeia Nova", logo: "/aldeianova.jpg" },
    { name: "Aeroporto Internacional Dr. António Agostinho Neto", logo: "/areportointernacional.png" },
    { name: "Clínica Girassol", logo: "/clinicagiralsol.png" },
    { name: "Clínica General Katondo", logo: "/clinicacatondo.png" },
    { name: "Farmácias Coimbra", logo: "/farmaciasdecoimbra.png" },
    { name: "ispetsoyo", logo: "/ispetsoyo.png" },
    { name: "Grupo Zahara", logo: "/grupozahara.png" },
    { name: "ISPTEC", logo: "/isptec.png" },
    { name: "Kero", logo: "/kero.png" },
    { name: "MS Telecom", logo: "/mstelecom.png" },
    { name: "Nespecred", logo: "/nespecred.jpeg" },
    { name: "Sona", logo: "/images.png" }, // ajuste se necessário
    { name: "NewCare Saúde", logo: "/newcare.jpeg" }, // ajuste se necessário
    { name: "Rede Girassol", logo: "/redegirassol.jpeg" }, // ajuste se necessário
    { name: "Somiluana", logo: "/somil.png" }, // ajuste se necessário
    { name: "SonAir", logo: "/sonair.png" }, // ajuste se necessário
    { name: "Sonangol Distribuidora", logo: "/Sonangol_Distribuidora.png" }, // ajuste se necessário
    { name: "Sonangol ", logo: "/Sonangol_Logo_Horizontal_Preto4_Footer-2.png" }, // ajuste se necessário
    { name: "Paz Flor", logo: "/pazflor.png" },
    { name: "Tech Look", logo: "/techkllook.png" }, // ajuste se necessário
  ];
  
  // Sample testimonials - you would replace these with actual testimonials
  const testimonials = [
    
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50/50 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute inset-y-0 left-0 w-1/2">
          <svg width="100%" height="100%" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="trustpilot-dots" width="30" height="30" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="2" fill="#1a365d" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#trustpilot-dots)" />
          </svg>
        </div>
        <div className="absolute inset-y-0 right-0 w-1/2">
          <svg width="100%" height="100%" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="trustpilot-lines" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 20 L40 20" stroke="#1a365d" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#trustpilot-lines)" />
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
          <h2 className="text-3xl md:text-4xl font-bold text-angohost-primary mb-4">Clientes Satisfeitos</h2>
          <div className="flex items-center justify-center mt-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="text-xl text-gray-600 mt-4">4.8/5 em mais de 1000 avaliações no Trustpilot</p>
          
          <div className="flex items-center justify-center mt-4">
          <Star className="h-8 w-8 text-yellow-400" aria-label="Trustpilot" />
            <Button 
              variant="link" 
              asChild
              className="ml-3 text-sm font-medium text-angohost-primary hover:text-angohost-secondary"
            >
              <a href="https://pt.trustpilot.com" target="_blank" rel="noopener noreferrer">
                Ver todas as avaliações <ChevronRight className="h-3 w-3 ml-1" />
              </a>
            </Button>
          </div>
        </motion.div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index} 
              className="bg-white p-8 rounded-xl border border-gray-100 shadow-lg relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 * index }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ y: -5 }}
            >
              {/* Decorative quote mark */}
              <div className="absolute top-6 right-6 text-gray-100 opacity-50">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 11H6C5.46957 11 4.96086 10.7893 4.58579 10.4142C4.21071 10.0391 4 9.53043 4 9V7C4 6.46957 4.21071 5.96086 4.58579 5.58579C4.96086 5.21071 5.46957 5 6 5H8C8.53043 5 9.03914 5.21071 9.41421 5.58579C9.78929 5.96086 10 6.46957 10 7V15C10 15.5304 9.78929 16.0391 9.41421 16.4142C9.03914 16.7893 8.53043 17 8 17H6M20 11H16C15.4696 11 14.9609 10.7893 14.5858 10.4142C14.2107 10.0391 14 9.53043 14 9V7C14 6.46957 14.2107 5.96086 14.5858 5.58579C14.9609 5.21071 15.4696 5 16 5H18C18.5304 5 19.0391 5.21071 19.4142 5.58579C19.7893 5.96086 20 6.46957 20 7V15C20 15.5304 19.7893 16.0391 19.4142 16.4142C19.0391 16.7893 18.5304 17 18 17H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <div className="flex mb-6">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 text-lg mb-6">"{testimonial.text}"</p>
              <div className="flex items-center">
                <div className="w-14 h-14 rounded-full overflow-hidden mr-4">
                  <img 
                    src={testimonial.avatarUrl} 
                    alt={testimonial.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-bold text-gray-800">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Client logos */}
        <motion.div 
          className="mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <h3 className="text-2xl font-bold text-center mb-10 text-angohost-primary">Empresas que confiam na AngoHost</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 items-center">
            {clientLogos.map((client, index) => (
              <motion.div 
                key={index} 
                className="bg-white p-6 rounded-lg shadow-md h-24 flex items-center justify-center"
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                transition={{ duration: 0.2 }}
              >
                <img 
                  src={client.logo} 
                  alt={`${client.name} logo`}
                  className="max-h-12 max-w-full opacity-80"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustpilotSection;
