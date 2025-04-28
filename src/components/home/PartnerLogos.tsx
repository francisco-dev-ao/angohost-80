
import React from "react";

const PartnerLogos = () => {
  // Logos de parceiros fictícios mas com nomes que sugerem empresas reais de Angola
  const partners = [
    { name: "Unitel", logo: "https://placehold.co/200x80/e0e0e0/333333?text=Unitel" },
    { name: "BFA", logo: "https://placehold.co/200x80/e0e0e0/333333?text=BFA" },
    { name: "Sonangol", logo: "https://placehold.co/200x80/e0e0e0/333333?text=Sonangol" },
    { name: "TAAG", logo: "https://placehold.co/200x80/e0e0e0/333333?text=TAAG" },
    { name: "Africell", logo: "https://placehold.co/200x80/e0e0e0/333333?text=Africell" },
  ];

  return (
    <section className="py-8 bg-gray-50 border-y border-gray-100">
      <div className="container">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {partners.map((partner, i) => (
            <div key={i} className="h-10 w-auto grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
              <img 
                src={partner.logo} 
                alt={`${partner.name} - Parceiro AngoHost`}
                className="h-full w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerLogos;
