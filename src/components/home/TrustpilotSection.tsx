
import React from "react";
import { Star } from "lucide-react";

const TrustpilotSection = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-angohost-primary">Clientes Satisfeitos</h2>
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
            <span className="ml-2 text-sm text-gray-500">Veja as 700+ avaliações no Trustpilot</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 items-center justify-center my-8">
          {[1, 2, 3, 4, 5].map((logo) => (
            <div key={logo} className="flex items-center justify-center">
              <div className="bg-gray-100 p-4 rounded-lg h-20 w-32 flex items-center justify-center">
                <span className="text-gray-400 text-sm">Logo Cliente {logo}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustpilotSection;
