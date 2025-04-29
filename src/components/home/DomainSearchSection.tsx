
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
    <section className="py-16 bg-gray-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-1/4 w-64 h-64 bg-angohost-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-1/3 w-72 h-72 bg-angohost-secondary/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-angohost-primary">Encontre o Seu Domínio Perfeito</h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Registe seu domínio .AO e estabeleça a sua presença online profissional em Angola
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8 border border-gray-100">
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
                  className={`text-center p-3 rounded-lg border ${domain.is_popular ? 'border-angohost-primary bg-angohost-primary/5' : 'border-gray-200'}`}
                >
                  <span className="block text-lg font-semibold">{domain.extension}</span>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <span className="text-sm text-gray-500">AOA</span>
                    <span className="font-bold text-angohost-primary">{(domain.price / 100).toFixed(2)}</span>
                  </div>
                  {domain.is_popular && (
                    <span className="inline-block bg-angohost-primary text-white text-xs px-2 py-0.5 rounded-full mt-2">
                      Popular
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DomainSearchSection;
