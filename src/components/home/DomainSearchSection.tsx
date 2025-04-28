
import React from "react";
import DomainSearch from "@/components/DomainSearch";

const DomainSearchSection = () => {
  const domainPrices = [
    { extension: ".ao", price: "3.990", isPopular: true },
    { extension: ".co.ao", price: "2.990" },
    { extension: ".com", price: "1.490" },
    { extension: ".net", price: "1.890" },
  ];

  return (
    <section className="py-16 bg-white relative -mt-8">
      <div className="container">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-8 border border-gray-100 relative z-20">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Encontre o domínio perfeito para o seu negócio</h2>
            <p className="text-gray-600 mt-2">Verifique a disponibilidade do seu domínio .ao ou outras extensões</p>
          </div>
          <DomainSearch />
          
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {domainPrices.map((domain) => (
              <div 
                key={domain.extension} 
                className={`text-center p-3 rounded-lg border ${domain.isPopular ? 'border-[#345990] bg-[#345990]/5' : 'border-gray-200'}`}
              >
                <span className="block text-lg font-semibold">{domain.extension}</span>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <span className="text-sm text-gray-500">AOA</span>
                  <span className="font-bold text-[#345990]">{domain.price}</span>
                </div>
                {domain.isPopular && (
                  <span className="inline-block bg-[#345990] text-white text-xs px-2 py-0.5 rounded-full mt-2">
                    Popular
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-[#345990]/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#345990]/5 rounded-full blur-3xl -z-10"></div>
      </div>
    </section>
  );
};

export default DomainSearchSection;
