
import React from "react";

const PartnerLogos = () => {
  return (
    <section className="py-8 bg-gray-50 border-y border-gray-100">
      <div className="container">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-auto grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
              <div className="bg-gray-300 rounded h-full w-24 flex items-center justify-center">
                <span className="text-xs text-gray-600">Parceiro {i}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerLogos;
