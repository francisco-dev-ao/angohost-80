
import React from "react";
import DomainSearch from "@/components/DomainSearch";

const DomainSearchSection = () => {
  return (
    <section className="py-16 bg-white relative -mt-8">
      <div className="container">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Encontre o domínio perfeito para o seu negócio</h2>
            <p className="text-gray-600 mt-2">Verifique a disponibilidade do seu domínio .ao ou outras extensões</p>
          </div>
          <DomainSearch />
        </div>
      </div>
    </section>
  );
};

export default DomainSearchSection;
