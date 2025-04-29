
import React from "react";
import DomainSearch from "@/components/DomainSearch";
import { useDomainExtensions } from "@/hooks/useDomainExtensions";
import { Skeleton } from "@/components/ui/skeleton";

const DomainSearchSection = () => {
  const { extensions, loading } = useDomainExtensions();
  
  const popularExtensions = extensions.filter(ext => ext.is_popular).slice(0, 1);
  const otherExtensions = extensions.filter(ext => !ext.is_popular).slice(0, 3);
  const displayExtensions = [...popularExtensions, ...otherExtensions];
  
  return (
    <section className="py-16 bg-white relative -mt-8">
      <div className="container">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-8 border border-gray-100 relative z-20">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Encontre o domínio perfeito para o seu negócio</h2>
            <p className="text-gray-600 mt-2">Verifique a disponibilidade do seu domínio .ao ou outras extensões</p>
          </div>
          <DomainSearch />
          
          {loading ? (
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {displayExtensions.map((domain) => (
                <div 
                  key={domain.extension} 
                  className={`text-center p-3 rounded-lg border ${domain.is_popular ? 'border-[#345990] bg-[#345990]/5' : 'border-gray-200'}`}
                >
                  <span className="block text-lg font-semibold">{domain.extension}</span>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <span className="text-sm text-gray-500">AOA</span>
                    <span className="font-bold text-[#345990]">{(domain.price / 100).toFixed(2)}</span>
                  </div>
                  {domain.is_popular && (
                    <span className="inline-block bg-[#345990] text-white text-xs px-2 py-0.5 rounded-full mt-2">
                      Popular
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-[#345990]/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#345990]/5 rounded-full blur-3xl -z-10"></div>
      </div>
    </section>
  );
};

export default DomainSearchSection;
